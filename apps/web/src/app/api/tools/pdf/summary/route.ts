import { NextResponse } from "next/server";
import { runAiGatewayTask } from "@/lib/ai/ai-gateway";
import { buildAiGatewayErrorPayload } from "@/lib/ai/route-error";
import { getCurrentUser } from "@/lib/auth/session";
import { buildPdfSummaryGatewayPayload, buildPdfSummaryOutput } from "@/modules/tools/pdf-toolbox/lib/pdf-ai";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const user = await getCurrentUser();

  if (!user?.id) {
    return NextResponse.json({ code: "unauthorized", error: "请先登录。" }, { status: 401 });
  }

  const payload = (await request.json().catch(() => ({}))) as {
    fileName?: string;
    sourceText?: string;
  };
  const fileName = payload.fileName?.trim() || "PDF 文档";
  const sourceText = payload.sourceText?.trim();

  if (!sourceText) {
    return NextResponse.json({ code: "execution_failed", error: "当前 PDF 没有可摘要的文本内容。" }, { status: 400 });
  }

  try {
    const result = await runAiGatewayTask({
      ...buildPdfSummaryGatewayPayload({
        fileName,
        sourceText
      }),
      userId: user.id
    });

    return NextResponse.json(buildPdfSummaryOutput(result.result), {
      headers: {
        "Cache-Control": "no-store"
      }
    });
  } catch (error) {
    const response = buildAiGatewayErrorPayload(error, "PDF 摘要暂时不可用。");
    return NextResponse.json(response.body, { status: response.status });
  }
}
