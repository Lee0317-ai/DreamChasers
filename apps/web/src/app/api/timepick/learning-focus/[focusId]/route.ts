import { NextResponse } from "next/server";
import { deleteTimePickLearningFocus, getTimePickUserIdByEmail, updateTimePickLearningFocus } from "@/lib/timepick/timepick-api";
import { getCurrentUser } from "@/lib/auth/session";
import { buildTimePickCorsHeadersForRequest, buildTimePickOptionsResponse } from "@/lib/timepick/timepick-cors";

export function OPTIONS(request: Request) {
  return buildTimePickOptionsResponse(request);
}

export async function PATCH(request: Request, { params }: { params: Promise<{ focusId: string }> }) {
  const corsHeaders = buildTimePickCorsHeadersForRequest(request);
  const user = await getCurrentUser();

  if (!user?.email) {
    return NextResponse.json({ error: "请先登录。" }, { headers: corsHeaders, status: 401 });
  }

  const body = (await request.json()) as { is_paused?: boolean | null; name?: string | null; synonyms?: string[] | null; weight?: number | null };
  const { focusId } = await params;
  const userId = await getTimePickUserIdByEmail(user.email);
  const result = await updateTimePickLearningFocus({
    focusId,
    input: body,
    userId
  });

  if (!result.focus) {
    return NextResponse.json({ error: result.error }, { headers: corsHeaders, status: result.status });
  }

  return NextResponse.json({ focus: result.focus }, { headers: corsHeaders, status: result.status });
}

export async function DELETE(request: Request, { params }: { params: Promise<{ focusId: string }> }) {
  const corsHeaders = buildTimePickCorsHeadersForRequest(request);
  const user = await getCurrentUser();

  if (!user?.email) {
    return NextResponse.json({ error: "请先登录。" }, { headers: corsHeaders, status: 401 });
  }

  const { focusId } = await params;
  const userId = await getTimePickUserIdByEmail(user.email);
  const deleted = await deleteTimePickLearningFocus({
    focusId,
    userId
  });

  if (!deleted) {
    return NextResponse.json({ error: "学习重点不存在或无权删除。" }, { headers: corsHeaders, status: 404 });
  }

  return NextResponse.json({ ok: true }, { headers: corsHeaders });
}
