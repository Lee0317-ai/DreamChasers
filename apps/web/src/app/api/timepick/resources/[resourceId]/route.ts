import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import {
  deleteTimePickResource,
  getTimePickUserIdByEmail,
  moveTimePickResource,
  updateTimePickResource
} from "@/lib/timepick/timepick-api";
import { buildTimePickCorsHeadersForRequest, buildTimePickOptionsResponse } from "@/lib/timepick/timepick-cors";

export function OPTIONS(request: Request) {
  return buildTimePickOptionsResponse(request);
}

export async function PATCH(request: Request, { params }: { params: Promise<{ resourceId: string }> }) {
  const corsHeaders = buildTimePickCorsHeadersForRequest(request);
  const user = await getCurrentUser();

  if (!user?.email) {
    return NextResponse.json({ error: "请先登录。" }, { headers: corsHeaders, status: 401 });
  }

  const { resourceId } = await params;
  const body = (await request.json()) as { folder_id?: string | null; name?: string | null; section_id?: string | null };
  const userId = await getTimePickUserIdByEmail(user.email);

  if (body.name !== undefined || body.section_id !== undefined) {
    const result = await updateTimePickResource({
      input: body,
      resourceId,
      userId
    });

    if (!result.resource) {
      return NextResponse.json({ error: result.error }, { headers: corsHeaders, status: result.status });
    }

    return NextResponse.json({ resource: result.resource }, { headers: corsHeaders, status: result.status });
  }

  const resource = await moveTimePickResource({
    resourceId,
    targetFolderId: body.folder_id ?? null,
    userId
  });

  if (!resource) {
    return NextResponse.json({ error: "资源不存在或无权移动。" }, { headers: corsHeaders, status: 404 });
  }

  return NextResponse.json({ ok: true }, { headers: corsHeaders });
}

export async function DELETE(request: Request, { params }: { params: Promise<{ resourceId: string }> }) {
  const corsHeaders = buildTimePickCorsHeadersForRequest(request);
  const user = await getCurrentUser();

  if (!user?.email) {
    return NextResponse.json({ error: "请先登录。" }, { headers: corsHeaders, status: 401 });
  }

  const { resourceId } = await params;
  const userId = await getTimePickUserIdByEmail(user.email);
  const deleted = await deleteTimePickResource({
    resourceId,
    userId
  });

  if (!deleted) {
    return NextResponse.json({ error: "资源不存在或无权删除。" }, { headers: corsHeaders, status: 404 });
  }

  return NextResponse.json({ ok: true }, { headers: corsHeaders });
}
