import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import {
  deleteTimePickInspiration,
  getTimePickUserIdByEmail,
  updateTimePickInspiration
} from "@/lib/timepick/timepick-api";
import { buildTimePickCorsHeadersForRequest, buildTimePickOptionsResponse } from "@/lib/timepick/timepick-cors";

export function OPTIONS(request: Request) {
  return buildTimePickOptionsResponse(request);
}

export async function PATCH(request: Request, { params }: { params: Promise<{ inspirationId: string }> }) {
  const corsHeaders = buildTimePickCorsHeadersForRequest(request);
  const user = await getCurrentUser();

  if (!user?.email) {
    return NextResponse.json({ error: "请先登录。" }, { headers: corsHeaders, status: 401 });
  }

  const { inspirationId } = await params;
  const body = (await request.json()) as { content?: string | null; location?: string | null; status?: string | null };
  const userId = await getTimePickUserIdByEmail(user.email);
  const result = await updateTimePickInspiration({
    input: body,
    inspirationId,
    userId
  });

  if (!result.inspiration) {
    return NextResponse.json({ error: result.error }, { headers: corsHeaders, status: result.status });
  }

  return NextResponse.json({ inspiration: result.inspiration }, { headers: corsHeaders, status: result.status });
}

export async function DELETE(request: Request, { params }: { params: Promise<{ inspirationId: string }> }) {
  const corsHeaders = buildTimePickCorsHeadersForRequest(request);
  const user = await getCurrentUser();

  if (!user?.email) {
    return NextResponse.json({ error: "请先登录。" }, { headers: corsHeaders, status: 401 });
  }

  const { inspirationId } = await params;
  const userId = await getTimePickUserIdByEmail(user.email);
  const deleted = await deleteTimePickInspiration({
    inspirationId,
    userId
  });

  if (!deleted) {
    return NextResponse.json({ error: "灵感不存在或无权删除。" }, { headers: corsHeaders, status: 404 });
  }

  return NextResponse.json({ ok: true }, { headers: corsHeaders });
}
