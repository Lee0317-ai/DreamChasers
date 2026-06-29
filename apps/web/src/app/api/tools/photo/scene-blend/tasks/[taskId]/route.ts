import { NextResponse } from "next/server";
import { getSceneBlendTask } from "@/lib/tools/photo/scene-blend-task-store";

export const runtime = "nodejs";

export async function GET(_request: Request, { params }: { params: Promise<{ taskId: string }> }) {
  const { taskId } = await params;
  const task = getSceneBlendTask(taskId);

  if (!task) {
    return NextResponse.json({ error: "AI 溶图任务不存在或已过期。" }, { status: 404 });
  }

  return NextResponse.json(task, {
    headers: {
      "Cache-Control": "no-store"
    }
  });
}
