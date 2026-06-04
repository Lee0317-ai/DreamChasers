import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { createTimePickFolder, getTimePickUserIdByEmail, listTimePickFolders } from "@/lib/timepick/timepick-api";
import { buildTimePickCorsHeadersForRequest, buildTimePickOptionsResponse } from "@/lib/timepick/timepick-cors";

export function OPTIONS(request: Request) {
  return buildTimePickOptionsResponse(request);
}

export async function GET(request: Request) {
  const corsHeaders = buildTimePickCorsHeadersForRequest(request);
  const user = await getCurrentUser();

  if (!user?.email) {
    return NextResponse.json({ error: "请先登录。" }, { headers: corsHeaders, status: 401 });
  }

  const userId = await getTimePickUserIdByEmail(user.email);
  const folders = await listTimePickFolders(userId);

  return NextResponse.json(
    { folders },
    {
      headers: {
        ...corsHeaders,
        "Cache-Control": "no-store"
      }
    }
  );
}

export async function POST(request: Request) {
  const corsHeaders = buildTimePickCorsHeadersForRequest(request);
  const user = await getCurrentUser();

  if (!user?.email) {
    return NextResponse.json({ error: "请先登录。" }, { headers: corsHeaders, status: 401 });
  }

  const body = (await request.json()) as { name?: string; parent_id?: string | null };
  const userId = await getTimePickUserIdByEmail(user.email);
  const result = await createTimePickFolder({
    name: body.name ?? "",
    parentId: body.parent_id ?? null,
    userId
  });

  if (!result.folder) {
    return NextResponse.json({ error: result.error }, { headers: corsHeaders, status: result.status });
  }

  return NextResponse.json({ folder: result.folder }, { headers: corsHeaders, status: result.status });
}
