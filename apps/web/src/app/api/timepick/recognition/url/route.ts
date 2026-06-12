import { NextResponse } from "next/server";
import { runAiGatewayTask } from "@/lib/ai/ai-gateway";
import { buildAiGatewayErrorPayload } from "@/lib/ai/route-error";
import { getCurrentUser } from "@/lib/auth/session";
import { buildTimePickUrlRecognitionGatewayInput, buildTimePickUrlRecognitionOutput } from "@/lib/timepick/timepick-recognition";
import { buildTimePickCorsHeadersForRequest, buildTimePickOptionsResponse } from "@/lib/timepick/timepick-cors";

export function OPTIONS(request: Request) {
  return buildTimePickOptionsResponse(request);
}

export async function POST(request: Request) {
  const corsHeaders = buildTimePickCorsHeadersForRequest(request);
  const user = await getCurrentUser();

  if (!user?.email || !user.id) {
    return NextResponse.json({ error: "请先登录。" }, { headers: corsHeaders, status: 401 });
  }

  const body = (await request.json().catch(() => ({}))) as { url?: string | null };
  const url = body.url?.trim();

  if (!url) {
    return NextResponse.json({ error: "请先输入网址。" }, { headers: corsHeaders, status: 400 });
  }

  try {
    const result = await runAiGatewayTask(
      buildTimePickUrlRecognitionGatewayInput({
        url,
        userId: user.id
      })
    );

    return NextResponse.json(buildTimePickUrlRecognitionOutput({ result: result.result, url }), {
      headers: {
        ...corsHeaders,
        "Cache-Control": "no-store"
      }
    });
  } catch (error) {
    const response = buildAiGatewayErrorPayload(error, "自动识别暂时不可用。");
    return NextResponse.json(
      response.body,
      { headers: corsHeaders, status: response.status }
    );
  }
}
