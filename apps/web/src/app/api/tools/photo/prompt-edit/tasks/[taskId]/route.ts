import { NextResponse } from "next/server";
import { getPhotoEditTask } from "@/lib/tools/photo/photo-edit-task-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{
    taskId: string;
  }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { taskId } = await context.params;
  const task = getPhotoEditTask(taskId);

  if (!task) {
    return NextResponse.json({ error: "任务不存在或已过期。" }, { status: 404 });
  }

  return NextResponse.json(task, {
    headers: {
      "Cache-Control": "no-store"
    }
  });
}
