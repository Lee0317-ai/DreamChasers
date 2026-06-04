import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { buildTimePickCorsHeadersForRequest, buildTimePickOptionsResponse } from "@/lib/timepick/timepick-cors";

export function OPTIONS(request: Request) {
  return buildTimePickOptionsResponse(request);
}

export async function POST(request: Request) {
  const corsHeaders = buildTimePickCorsHeadersForRequest(request);
  const user = await getCurrentUser();

  if (!user?.email) {
    return NextResponse.json({ error: "请先登录。" }, { headers: corsHeaders, status: 401 });
  }

  const body = (await request.json().catch(() => ({}))) as { message?: string | null };
  const message = body.message?.trim();

  if (!message) {
    return NextResponse.json({ error: "请输入想咨询的内容。" }, { headers: corsHeaders, status: 400 });
  }

  const output = [
    "当前运势聊天已切换到 DreamChasers 平台占位服务，暂未接入真实 AI 模型。",
    "",
    `你刚才问的是：${message}`,
    "",
    "建议先把问题拆成一个具体主题，比如事业、学习、财务、感情或健康，再结合今天最需要推进的一件事做判断。",
    "",
    "后续这条链路会接入平台 AI Gateway，并统一走账号、额度和审计。"
  ].join("\n");

  return NextResponse.json(
    {
      output: {
        text: output
      }
    },
    {
      headers: {
        ...corsHeaders,
        "Cache-Control": "no-store"
      }
    }
  );
}
