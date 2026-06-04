import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { deleteTimePickFolder, getTimePickUserIdByEmail, updateTimePickFolder } from "@/lib/timepick/timepick-api";
import { buildTimePickCorsHeadersForRequest, buildTimePickOptionsResponse } from "@/lib/timepick/timepick-cors";

export function OPTIONS(request: Request) {
  return buildTimePickOptionsResponse(request);
}

export async function DELETE(request: Request, { params }: { params: Promise<{ folderId: string }> }) {
  const corsHeaders = buildTimePickCorsHeadersForRequest(request);
  const user = await getCurrentUser();

  if (!user?.email) {
    return NextResponse.json({ error: "请先登录。" }, { headers: corsHeaders, status: 401 });
  }

  const { folderId } = await params;
  const userId = await getTimePickUserIdByEmail(user.email);
  const deleted = await deleteTimePickFolder({ folderId, userId });

  if (!deleted) {
    return NextResponse.json({ error: "文件夹不存在。" }, { headers: corsHeaders, status: 404 });
  }

  return NextResponse.json({ ok: true }, { headers: corsHeaders });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ folderId: string }> }) {
  const corsHeaders = buildTimePickCorsHeadersForRequest(request);
  const user = await getCurrentUser();

  if (!user?.email) {
    return NextResponse.json({ error: "请先登录。" }, { headers: corsHeaders, status: 401 });
  }

  const { folderId } = await params;
  const body = (await request.json()) as { name?: string; parent_id?: string | null };
  const userId = await getTimePickUserIdByEmail(user.email);
  const result = await updateTimePickFolder({
    folderId,
    name: body.name ?? "",
    parentId: body.parent_id ?? null,
    userId
  });

  if (!result.folder) {
    return NextResponse.json({ error: result.error }, { headers: corsHeaders, status: result.status });
  }

  return NextResponse.json({ folder: result.folder }, { headers: corsHeaders });
}
