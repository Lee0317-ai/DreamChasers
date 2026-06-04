import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { createTimePickSearchHistory, getTimePickUserIdByEmail, listTimePickSearchHistory } from "@/lib/timepick/timepick-api";
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
  const history = await listTimePickSearchHistory(userId);

  return NextResponse.json(
    { history },
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

  const body = (await request.json()) as { keyword?: string | null };
  const userId = await getTimePickUserIdByEmail(user.email);
  const result = await createTimePickSearchHistory({
    keyword: body.keyword ?? "",
    userId
  });

  if (!result.history) {
    return NextResponse.json({ error: result.error }, { headers: corsHeaders, status: result.status });
  }

  return NextResponse.json({ history: result.history }, { headers: corsHeaders, status: result.status });
}
