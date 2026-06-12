import type { AiGatewayTaskInput } from "@/lib/ai/ai-gateway";

const timePickFortuneSystemPrompt =
  "你是 TimePick 的轻量运势与决策陪伴助手。请基于用户提问，给出简短、温和、可执行的中文建议。避免神秘断言，强调把问题收敛到今天最值得推进的一件事。";

export function buildTimePickFortuneChatGatewayInput(input: {
  message: string;
  userId: string;
}): AiGatewayTaskInput {
  return {
    capability: "text_generation",
    credentialSource: "platform_pool",
    input: {
      message: input.message,
      prompt: timePickFortuneSystemPrompt
    },
    modelId: "mock-structured-fast",
    productSlug: "timepick",
    toolSlug: "timepick-fortune-chat",
    userId: input.userId
  };
}

export function buildTimePickFortuneChatOutput(input: {
  result: Record<string, unknown>;
}) {
  const text =
    typeof input.result.text === "string"
      ? input.result.text
      : typeof input.result.summary === "string"
        ? input.result.summary
        : "当前没有生成可展示的内容。";

  return {
    output: {
      text
    }
  };
}
