import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { buildTimePickCorsHeadersForRequest, buildTimePickOptionsResponse } from "@/lib/timepick/timepick-cors";
import { deleteTimePickTryQueueLink, getTimePickUserIdByEmail, updateTimePickTryQueueLink } from "@/lib/timepick/timepick-api";

type TimePickTodoRouteContext = {
  params: Promise<{
    todoId: string;
  }>;
};

export function OPTIONS(request: Request) {
  return buildTimePickOptionsResponse(request);
}

export async function PATCH(request: Request, context: TimePickTodoRouteContext) {
  const corsHeaders = buildTimePickCorsHeadersForRequest(request);
  const user = await getCurrentUser();

  if (!user?.email) {
    return NextResponse.json({ error: "请先登录。" }, { headers: corsHeaders, status: 401 });
  }

  const body = await request.json();
  const { todoId } = await context.params;
  const userId = await getTimePickUserIdByEmail(user.email);
  const result = await updateTimePickTryQueueLink({
    input: body,
    todoId,
    userId
  });

  if (!result.todo) {
    return NextResponse.json({ error: result.error }, { headers: corsHeaders, status: result.status });
  }

  return NextResponse.json({ todo: result.todo }, { headers: corsHeaders, status: result.status });
}

export async function DELETE(request: Request, context: TimePickTodoRouteContext) {
  const corsHeaders = buildTimePickCorsHeadersForRequest(request);
  const user = await getCurrentUser();

  if (!user?.email) {
    return NextResponse.json({ error: "请先登录。" }, { headers: corsHeaders, status: 401 });
  }

  const { todoId } = await context.params;
  const userId = await getTimePickUserIdByEmail(user.email);
  const deleted = await deleteTimePickTryQueueLink({
    todoId,
    userId
  });

  if (!deleted) {
    return NextResponse.json({ error: "任务不存在或无权删除。" }, { headers: corsHeaders, status: 404 });
  }

  return NextResponse.json({ ok: true }, { headers: corsHeaders });
}
