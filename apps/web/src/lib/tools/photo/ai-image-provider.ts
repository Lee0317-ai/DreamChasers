import { getProviderReadiness } from "../../ai/provider-readiness";

const maxBeautyImageBytes = 15 * 1024 * 1024;
const supportedImageTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const openAiCompatibleImageEditModelId = "openai-compatible-image-edit";
const mockImageEditModelId = "mock-image-edit";

export const naturalPortraitBeautyType = "natural_portrait";

export type BeautyType = typeof naturalPortraitBeautyType;

export type ImageEditResult = {
  contentType: string;
  data: Buffer;
};

type BeautyImageInput = {
  beautyType: string;
  image: File;
};

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

export async function buildBeautyGatewayInput(image: File, userId: string) {
  const imageBase64 = Buffer.from(await image.arrayBuffer()).toString("base64");

  return {
    capability: "image_edit" as const,
    credentialSource: "platform_pool" as const,
    input: {
      beautyType: naturalPortraitBeautyType,
      contentType: image.type || "image/png",
      fileName: image.name || "portrait.png",
      fileSize: image.size,
      imageBase64,
      prompt: buildNaturalPortraitPrompt()
    },
    modelId: getPreferredBeautyModelId(),
    productSlug: "dreamchasers",
    toolSlug: "ai-photo-editor-beauty",
    userId
  };
}

export function readImageEditGatewayResult(result: Record<string, unknown>): ImageEditResult {
  const imageBase64 = typeof result.imageBase64 === "string" ? result.imageBase64 : "";
  const contentType = typeof result.contentType === "string" ? result.contentType : "image/png";

  if (!imageBase64) {
    throw new Error("AI 图片服务未返回可用的图片结果。");
  }

  return {
    contentType,
    data: Buffer.from(imageBase64, "base64")
  };
}

function getPreferredBeautyModelId() {
  const readiness = getProviderReadiness("openai_compatible");
  return readiness.status === "enabled" ? openAiCompatibleImageEditModelId : mockImageEditModelId;
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
