import { NextResponse } from "next/server";
import { getPhotoEditTaskResult } from "@/lib/tools/photo/photo-edit-task-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{
    taskId: string;
  }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { taskId } = await context.params;
  const result = getPhotoEditTaskResult(taskId);

  if (!result) {
    return NextResponse.json({ error: "结果不存在、未完成或已过期。" }, { status: 404 });
  }

  return new NextResponse(new Uint8Array(result.data), {
    headers: {
      "Cache-Control": "no-store",
      "Content-Type": result.contentType
    }
  });
}
