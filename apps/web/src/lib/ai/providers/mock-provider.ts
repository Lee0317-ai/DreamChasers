import type { AiProviderAdapter, AiGatewayProviderRequest, AiGatewayProviderResponse } from "../provider-adapter";

function buildMockResult(request: AiGatewayProviderRequest): AiGatewayProviderResponse {
  switch (request.capability) {
    case "text_generation": {
      const message =
        typeof request.input.message === "string"
          ? request.input.message.trim()
          : typeof request.input.prompt === "string"
            ? request.input.prompt.trim()
            : "今天最值得推进的一件事";

      return {
        outputSummary: `已生成建议：${message}`,
        result: {
          summary: "Mock AI gateway response",
          text: [`你刚才问的是：${message}`, "", "建议先收敛到今天最重要的一件事，再给它一个明确的下一步动作。"].join(
            "\n"
          )
        }
      };
    }
    case "structured_extraction":
      const url = typeof request.input.url === "string" ? request.input.url.trim() : "";
      const hostname = extractHostname(url);

      return {
        outputSummary: hostname ? `已识别链接：${hostname}` : "抽取完成",
        result: {
          summary: hostname
            ? `识别到来自 ${hostname} 的链接内容，可先作为待读文章或资料收集入口。`
            : "Structured extraction result",
          thumbnailUrl: "",
          title: hostname || "Example"
        }
      };
    case "image_understanding":
      return {
        outputSummary: "识别完成",
        result: {
          labels: ["document", "notes"],
          summary: "Image understanding result"
        }
      };
    case "image_edit":
      const contentType = typeof request.input.contentType === "string" ? request.input.contentType : "image/png";
      const imageBase64 = typeof request.input.imageBase64 === "string" ? request.input.imageBase64 : "";

      return {
        outputSummary: "编辑任务已模拟完成",
        result: {
          contentType,
          imageBase64,
          summary: "Image edit result"
        }
      };
    default:
      return {
        outputSummary: "任务已模拟完成",
        result: {
          summary: "Mock AI gateway response"
        }
      };
  }
}

function extractHostname(inputUrl: string) {
  if (!inputUrl) {
    return "";
  }

  try {
    return new URL(inputUrl).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

export const mockAiProvider: AiProviderAdapter = {
  async execute(request) {
    return buildMockResult(request);
  }
};
