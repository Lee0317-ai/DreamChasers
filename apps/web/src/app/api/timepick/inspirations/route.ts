import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { createTimePickInspiration, getTimePickUserIdByEmail, listTimePickInspirations } from "@/lib/timepick/timepick-api";
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

  const url = new URL(request.url);
  const status = url.searchParams.get("status");
  const limit = Number(url.searchParams.get("limit") ?? "");
  const userId = await getTimePickUserIdByEmail(user.email);
  const inspirations = await listTimePickInspirations({
    limit: Number.isFinite(limit) && limit > 0 ? limit : null,
    status,
    userId
  });

  return NextResponse.json(
    { inspirations },
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

  const body = (await request.json()) as { content?: string | null; location?: string | null; status?: string | null };
  const userId = await getTimePickUserIdByEmail(user.email);
  const result = await createTimePickInspiration({
    input: body,
    userId
  });

  if (!result.inspiration) {
    return NextResponse.json({ error: result.error }, { headers: corsHeaders, status: result.status });
  }

  return NextResponse.json({ inspiration: result.inspiration }, { headers: corsHeaders, status: result.status });
}
