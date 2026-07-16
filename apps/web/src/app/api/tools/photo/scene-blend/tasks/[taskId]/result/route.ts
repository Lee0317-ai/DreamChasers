import { NextResponse } from "next/server";
import { getSceneBlendTaskResult } from "@/lib/tools/photo/scene-blend-task-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: Promise<{ taskId: string }> }) {
  const { taskId } = await params;
  const result = getSceneBlendTaskResult(taskId);

  if (!result) {
    return NextResponse.json({ error: "AI 溶图结果不存在或尚未生成。" }, { status: 404 });
  }

  return new NextResponse(new Uint8Array(result.data), {
    headers: {
      "Cache-Control": "no-store",
      "Content-Type": result.contentType
    }
  });
}
