import type { AiProviderAdapter, AiGatewayProviderRequest } from "../provider-adapter";

type OpenAiCompatibleProviderConfig = {
  apiKey: string;
  baseUrl: string;
  imageModelId?: string;
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
        throw new Error(await buildProviderErrorMessage(response));
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
  const backgroundImageBase64 = typeof request.input.backgroundImageBase64 === "string" ? request.input.backgroundImageBase64 : "";
  const backgroundContentType = typeof request.input.backgroundContentType === "string" ? request.input.backgroundContentType : "image/png";
  const backgroundFileName = typeof request.input.backgroundFileName === "string" ? request.input.backgroundFileName : "background.png";
  const prompt = typeof request.input.prompt === "string" ? request.input.prompt : "";

  if (!imageBase64) {
    throw new Error("Image edit input missing image payload.");
  }

  const formData = new FormData();
  formData.set("model", config.imageModelId || request.model.modelId);
  formData.append("image", createImageFileFromBase64(imageBase64, contentType, "product.png"));
  if (backgroundImageBase64) {
    formData.append("image", createImageFileFromBase64(backgroundImageBase64, backgroundContentType, sanitizeImageFileName(backgroundFileName)));
  }
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
    throw new Error(await buildProviderErrorMessage(response));
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

function createImageFileFromBase64(imageBase64: string, contentType: string, fileName: string) {
  return new File([Buffer.from(imageBase64, "base64")], fileName, {
    type: contentType
  });
}

function sanitizeImageFileName(fileName: string) {
  const normalizedFileName = fileName.trim().replace(/[^\w.-]+/g, "-");

  return normalizedFileName || "image.png";
}

async function buildProviderErrorMessage(response: Response) {
  const body = await response.text().catch(() => "");
  const detail = body.trim().slice(0, 500);

  return detail
    ? `OpenAI-compatible provider request failed: ${response.status} ${detail}`
    : `OpenAI-compatible provider request failed: ${response.status}`;
}
