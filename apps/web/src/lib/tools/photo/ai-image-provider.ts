const defaultImageProvider = "openai-compatible";
const defaultImageModel = "gpt-image-2";
const rightCodeDrawProvider = "right-code-draw";
const legacyProviderName = "legacy";
const maxBeautyImageBytes = 15 * 1024 * 1024;
const supportedImageTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

export const naturalPortraitBeautyType = "natural_portrait";

export type BeautyType = typeof naturalPortraitBeautyType;

export type ImageEditResult = {
  contentType: string;
  data: Buffer;
};

type ImageAiConfig = {
  activeProvider: string;
  apiKey: string;
  baseUrl: string;
  model: string;
  protocol: string;
};

type BeautyImageInput = {
  beautyType: string;
  image: File;
};

export function getImageAiConfig(): ImageAiConfig {
  const activeProvider = process.env.AI_IMAGE_ACTIVE_PROVIDER?.trim();

  if (activeProvider) {
    return getNamedImageAiConfig(activeProvider);
  }

  return getLegacyImageAiConfig();
}

function getNamedImageAiConfig(activeProvider: string): ImageAiConfig {
  const prefix = toProviderEnvPrefix(activeProvider);
  const baseUrl = process.env[`AI_IMAGE_PROVIDER_${prefix}_BASE_URL`]?.trim();
  const apiKey = process.env[`AI_IMAGE_PROVIDER_${prefix}_API_KEY`]?.trim();
  const protocol = process.env[`AI_IMAGE_PROVIDER_${prefix}_PROTOCOL`]?.trim() || defaultImageProvider;
  const model = process.env[`AI_IMAGE_PROVIDER_${prefix}_MODEL`]?.trim() || defaultImageModel;

  if (!baseUrl || !apiKey) {
    throw new Error(`AI 图片 provider ${activeProvider} 的 BASE_URL 和 API_KEY 未配置。`);
  }

  return {
    activeProvider,
    apiKey,
    baseUrl: baseUrl.replace(/\/+$/, ""),
    model,
    protocol
  };
}

function getLegacyImageAiConfig(): ImageAiConfig {
  const baseUrl = process.env.AI_IMAGE_API_BASE_URL?.trim();
  const apiKey = process.env.AI_IMAGE_API_KEY?.trim();

  if (!baseUrl || !apiKey) {
    throw new Error("AI_IMAGE_API_BASE_URL 和 AI_IMAGE_API_KEY 未配置。");
  }

  return {
    activeProvider: legacyProviderName,
    apiKey,
    baseUrl: baseUrl.replace(/\/+$/, ""),
    model: process.env.AI_IMAGE_MODEL?.trim() || defaultImageModel,
    protocol: process.env.AI_IMAGE_PROVIDER?.trim() || defaultImageProvider
  };
}

export function assertSupportedBeautyInput({ beautyType, image }: BeautyImageInput) {
  if (beautyType !== naturalPortraitBeautyType) {
    throw new Error("暂不支持该美颜类型。");
  }

  if (!supportedImageTypes.has(image.type)) {
    throw new Error("请上传 JPG、PNG 或 WebP 图片。");
  }

  if (image.size > maxBeautyImageBytes) {
    throw new Error("图片不能超过 15MB。");
  }
}

export async function runNaturalPortraitBeauty(image: File): Promise<ImageEditResult> {
  const config = getImageAiConfig();

  if (config.protocol === defaultImageProvider) {
    return runOpenAiCompatibleImageEdit(config, image);
  }

  if (config.protocol === rightCodeDrawProvider) {
    return runRightCodeDrawImageEdit(config, image);
  }

  throw new Error(`暂不支持 AI 图片 provider 协议：${config.protocol}。`);
}

async function runOpenAiCompatibleImageEdit(config: ImageAiConfig, image: File): Promise<ImageEditResult> {
  const formData = new FormData();
  formData.set("model", config.model);
  formData.set("image", image, image.name || "portrait.png");
  formData.set("prompt", buildNaturalPortraitPrompt());
  formData.set("quality", "high");
  formData.set("output_format", "png");
  formData.set("background", "auto");
  formData.set("moderation", "auto");

  const response = await fetch(`${config.baseUrl}/images/edits`, {
    body: formData,
    headers: {
      Authorization: `Bearer ${config.apiKey}`
    },
    method: "POST"
  });

  if (!response.ok) {
    throw new Error(await readImageAiError(response));
  }

  const payload = (await response.json()) as unknown;
  const base64Image = readBase64Image(payload);

  return {
    contentType: "image/png",
    data: Buffer.from(base64Image, "base64")
  };
}

async function runRightCodeDrawImageEdit(config: ImageAiConfig, image: File): Promise<ImageEditResult> {
  const imageDataUrl = await fileToDataUrl(image);
  const response = await fetch(`${config.baseUrl}/v1/images/generations`, {
    body: JSON.stringify({
      image: [imageDataUrl],
      model: config.model,
      prompt: buildNaturalPortraitPrompt(),
      response_format: "url",
      size: "1024x1024"
    }),
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      "Content-Type": "application/json"
    },
    method: "POST"
  });

  if (!response.ok) {
    throw new Error(await readImageAiError(response));
  }

  const payload = (await response.json()) as unknown;
  const imageUrl = readImageUrl(payload);
  const resultResponse = await fetch(imageUrl);

  if (!resultResponse.ok) {
    throw new Error(`AI 图片结果下载失败（${resultResponse.status}）。`);
  }

  const arrayBuffer = await resultResponse.arrayBuffer();

  return {
    contentType: resultResponse.headers.get("content-type") || "image/png",
    data: Buffer.from(arrayBuffer)
  };
}

function buildNaturalPortraitPrompt() {
  return [
    "Natural portrait enhancement for a real user photo.",
    "Preserve the person's identity, face shape, facial feature proportions, hairstyle, clothing, pose, framing, and background.",
    "Do not slim the face, enlarge eyes, change makeup, change hairstyle, alter age, change expression, or make the person look like someone else.",
    "Subtly improve skin tone balance, dullness, minor blemishes, noise, lighting, and clarity.",
    "Keep realistic skin texture, pores, shadows, and natural color. Avoid plastic skin, over-whitening, heavy smoothing, or artificial beauty effects.",
    "Return only the edited image."
  ].join(" ");
}

function readBase64Image(payload: unknown) {
  if (!payload || typeof payload !== "object" || !("data" in payload) || !Array.isArray(payload.data)) {
    throw new Error("AI 图片服务返回格式异常。");
  }

  const firstItem = payload.data[0] as unknown;

  if (!firstItem || typeof firstItem !== "object") {
    throw new Error("AI 图片服务未返回图片。");
  }

  if ("b64_json" in firstItem && typeof firstItem.b64_json === "string") {
    return firstItem.b64_json;
  }

  throw new Error("AI 图片服务未返回可用的 base64 图片。");
}

function readImageUrl(payload: unknown) {
  if (!payload || typeof payload !== "object" || !("data" in payload) || !Array.isArray(payload.data)) {
    throw new Error("AI 图片服务返回格式异常。");
  }

  const firstItem = payload.data[0] as unknown;

  if (!firstItem || typeof firstItem !== "object") {
    throw new Error("AI 图片服务未返回图片。");
  }

  if ("url" in firstItem && typeof firstItem.url === "string") {
    return firstItem.url;
  }

  throw new Error("AI 图片服务未返回可用的图片 URL。");
}

async function fileToDataUrl(file: File) {
  const buffer = Buffer.from(await file.arrayBuffer());
  const mimeType = file.type || "image/png";

  return `data:${mimeType};base64,${buffer.toString("base64")}`;
}

function toProviderEnvPrefix(provider: string) {
  return provider.toUpperCase().replace(/[^A-Z0-9]+/g, "_").replace(/^_+|_+$/g, "");
}

async function readImageAiError(response: Response) {
  const fallback = `AI 图片服务调用失败（${response.status}）。`;

  try {
    const payload = (await response.json()) as unknown;

    if (payload && typeof payload === "object" && "error" in payload) {
      const error = payload.error as unknown;

      if (error && typeof error === "object" && "message" in error && typeof error.message === "string") {
        return error.message;
      }
    }
  } catch {
    return fallback;
  }

  return fallback;
}
