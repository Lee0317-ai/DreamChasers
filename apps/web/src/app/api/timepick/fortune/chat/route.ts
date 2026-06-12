import { NextResponse } from "next/server";
import { runAiGatewayTask } from "@/lib/ai/ai-gateway";
import { buildAiGatewayErrorPayload } from "@/lib/ai/route-error";
import { getCurrentUser } from "@/lib/auth/session";
import { buildTimePickCorsHeadersForRequest, buildTimePickOptionsResponse } from "@/lib/timepick/timepick-cors";
import { buildTimePickFortuneChatGatewayInput, buildTimePickFortuneChatOutput } from "@/lib/timepick/timepick-fortune-chat";

export function OPTIONS(request: Request) {
  return buildTimePickOptionsResponse(request);
}

export async function POST(request: Request) {
  const corsHeaders = buildTimePickCorsHeadersForRequest(request);
  const user = await getCurrentUser();

  if (!user?.email || !user.id) {
    return NextResponse.json({ error: "请先登录。" }, { headers: corsHeaders, status: 401 });
  }

  const body = (await request.json().catch(() => ({}))) as { message?: string | null };
  const message = body.message?.trim();

  if (!message) {
    return NextResponse.json({ error: "请输入想咨询的内容。" }, { headers: corsHeaders, status: 400 });
  }

  try {
    const result = await runAiGatewayTask(
      buildTimePickFortuneChatGatewayInput({
        message,
        userId: user.id
      })
    );

    return NextResponse.json(buildTimePickFortuneChatOutput(result), {
      headers: {
        ...corsHeaders,
        "Cache-Control": "no-store"
      }
    });
  } catch (error) {
    const response = buildAiGatewayErrorPayload(error, "运势聊天暂时不可用。");
    return NextResponse.json(
      response.body,
      { headers: corsHeaders, status: response.status }
    );
  }
}
