import { NextResponse } from "next/server";
import { getBrandWatermarkTask } from "@/lib/tools/photo/brand-watermark-task-store";

export const runtime = "nodejs";

export async function GET(_request: Request, { params }: { params: Promise<{ taskId: string }> }) {
  const { taskId } = await params;
  const task = getBrandWatermarkTask(taskId);

  if (!task) {
    return NextResponse.json({ error: "AI Logo 水印任务不存在或已过期。" }, { status: 404 });
  }

  return NextResponse.json(task, {
    headers: {
      "Cache-Control": "no-store"
    }
  });
}
