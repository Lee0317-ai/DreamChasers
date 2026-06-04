import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { deleteTimePickSearchHistory, getTimePickUserIdByEmail } from "@/lib/timepick/timepick-api";
import { buildTimePickCorsHeadersForRequest, buildTimePickOptionsResponse } from "@/lib/timepick/timepick-cors";

export function OPTIONS(request: Request) {
  return buildTimePickOptionsResponse(request);
}

export async function DELETE(request: Request, { params }: { params: Promise<{ historyId: string }> }) {
  const corsHeaders = buildTimePickCorsHeadersForRequest(request);
  const user = await getCurrentUser();

  if (!user?.email) {
    return NextResponse.json({ error: "请先登录。" }, { headers: corsHeaders, status: 401 });
  }

  const { historyId } = await params;
  const userId = await getTimePickUserIdByEmail(user.email);
  const deleted = await deleteTimePickSearchHistory({
    historyId,
    userId
  });

  if (!deleted) {
    return NextResponse.json({ error: "搜索历史不存在。" }, { headers: corsHeaders, status: 404 });
  }

  return NextResponse.json({ ok: true }, { headers: corsHeaders });
}
