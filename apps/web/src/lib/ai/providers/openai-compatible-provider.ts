import type { AiProviderAdapter, AiGatewayProviderRequest } from "../provider-adapter";

type OpenAiCompatibleProviderConfig = {
  apiKey: string;
  baseUrl: string;
};

export function createOpenAiCompatibleProvider(config: OpenAiCompatibleProviderConfig): AiProviderAdapter {
  return {
    async execute(request: AiGatewayProviderRequest) {
      if (request.capability === "image_edit") {
        return runOpenAiCompatibleImageEdit(config, request);
      }

      const response = await fetch(`${config.baseUrl.replace(/\/$/, "")}/chat/completions`, {
        body: JSON.stringify({
          messages: [
            {
              content: JSON.stringify(request.input),
              role: "user"
            }
          ],
          model: request.model.modelId
        }),
        headers: {
          Authorization: `Bearer ${config.apiKey}`,
          "Content-Type": "application/json"
        },
        method: "POST"
      });

      if (!response.ok) {
        throw new Error(`OpenAI-compatible provider request failed: ${response.status}`);
      }

      const payload = (await response.json()) as {
        choices?: Array<{
          message?: {
            content?: string;
          };
        }>;
      };
      const content = payload.choices?.[0]?.message?.content || "";

      return {
        outputSummary: content.slice(0, 120) || "OpenAI-compatible provider completed the request.",
        result: {
          raw: content
        }
      };
    }
  };
}

async function runOpenAiCompatibleImageEdit(config: OpenAiCompatibleProviderConfig, request: AiGatewayProviderRequest) {
  const imageBase64 = typeof request.input.imageBase64 === "string" ? request.input.imageBase64 : "";
  const contentType = typeof request.input.contentType === "string" ? request.input.contentType : "image/png";
  const prompt = typeof request.input.prompt === "string" ? request.input.prompt : "";

  if (!imageBase64) {
    throw new Error("Image edit input missing image payload.");
  }

  const formData = new FormData();
  formData.set("model", request.model.modelId);
  formData.set("image", createImageFileFromBase64(imageBase64, contentType));
  formData.set("prompt", prompt);
  formData.set("quality", "high");
  formData.set("output_format", "png");
  formData.set("background", "auto");
  formData.set("moderation", "auto");

  const response = await fetch(`${config.baseUrl.replace(/\/$/, "")}/images/edits`, {
    body: formData,
    headers: {
      Authorization: `Bearer ${config.apiKey}`
    },
    method: "POST"
  });

  if (!response.ok) {
    throw new Error(`OpenAI-compatible provider request failed: ${response.status}`);
  }

  const payload = (await response.json()) as {
    data?: Array<{
      b64_json?: string;
    }>;
  };
  const editedImageBase64 = payload.data?.[0]?.b64_json;

  if (!editedImageBase64) {
    throw new Error("OpenAI-compatible provider did not return an edited image.");
  }

  return {
    outputSummary: "图像编辑已完成",
    result: {
      contentType: "image/png",
      imageBase64: editedImageBase64
    }
  };
}

function createImageFileFromBase64(imageBase64: string, contentType: string) {
  return new File([Buffer.from(imageBase64, "base64")], "image.png", {
    type: contentType
  });
}
