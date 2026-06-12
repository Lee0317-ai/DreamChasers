import type { AiGatewayTaskInput } from "@/lib/ai/ai-gateway";

const timePickRecognitionPrompt =
  "你是 TimePick 的资源录入助手。请根据给定 URL 返回适合资源卡片的简短标题、一句中文摘要，以及可选的缩略图链接。不要编造未给出的细节；拿不准时保守输出。";

export function buildTimePickUrlRecognitionGatewayInput(input: {
  url: string;
  userId: string;
}): AiGatewayTaskInput {
  return {
    capability: "structured_extraction",
    credentialSource: "platform_pool",
    input: {
      prompt: timePickRecognitionPrompt,
      url: input.url
    },
    modelId: "mock-structured-fast",
    productSlug: "timepick",
    toolSlug: "timepick-url-recognition",
    userId: input.userId
  };
}

export function buildTimePickUrlRecognitionOutput(input: {
  result: Record<string, unknown>;
  url: string;
}) {
  const title = readString(input.result.title) || deriveRecognitionTitleFromUrl(input.url);
  const content = readString(input.result.summary) || `来源链接：${input.url}`;
  const img = readString(input.result.thumbnailUrl) || readString(input.result.imageUrl) || "";

  return {
    recognition: {
      content,
      img,
      title
    }
  };
}

function deriveRecognitionTitleFromUrl(inputUrl: string) {
  try {
    const parsed = new URL(inputUrl);
    return parsed.hostname.replace(/^www\./, "") || inputUrl;
  } catch {
    return inputUrl;
  }
}

function readString(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : "";
}
