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

type SceneBlendInput = {
  backgroundImage: File;
  productImage: File;
  prompt: string;
};

type BrandWatermarkInput = {
  image: File;
  logo: File;
  logoSize: number;
};

export type PhotoEditMode = "enhance" | "prompt_edit" | "repair";

type PhotoEditInput = {
  image: File;
  mode: PhotoEditMode;
  prompt?: string;
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

export function assertSupportedSceneBlendInput({ backgroundImage, productImage, prompt }: SceneBlendInput) {
  assertSupportedImageFile(productImage, "产品图");
  assertSupportedImageFile(backgroundImage, "背景图");

  if (!prompt.trim()) {
    throw new Error("请填写溶图场景描述。");
  }

  if (prompt.length > 220) {
    throw new Error("场景描述不能超过 220 个字。");
  }
}

export async function buildSceneBlendGatewayInput({ backgroundImage, productImage, prompt }: SceneBlendInput, userId: string) {
  const productImageBase64 = Buffer.from(await productImage.arrayBuffer()).toString("base64");
  const backgroundImageBase64 = Buffer.from(await backgroundImage.arrayBuffer()).toString("base64");

  return {
    capability: "image_edit" as const,
    credentialSource: "platform_pool" as const,
    input: {
      backgroundContentType: backgroundImage.type || "image/png",
      backgroundFileName: backgroundImage.name || "background.png",
      backgroundImageBase64,
      contentType: productImage.type || "image/png",
      fileName: productImage.name || "product.png",
      fileSize: productImage.size,
      imageBase64: productImageBase64,
      prompt: buildSceneBlendPrompt(prompt)
    },
    modelId: getPreferredImageEditModelId(),
    productSlug: "dreamchasers",
    toolSlug: "ai-photo-editor-scene-blend",
    userId
  };
}

export function assertSupportedBrandWatermarkInput({ image, logo, logoSize }: BrandWatermarkInput) {
  assertSupportedImageFile(image, "原图");
  assertSupportedImageFile(logo, "Logo");

  if (!Number.isFinite(logoSize) || logoSize < 5 || logoSize > 30) {
    throw new Error("Logo 大小必须在 5% 到 30% 之间。");
  }
}

export async function buildBrandWatermarkGatewayInput({ image, logo, logoSize }: BrandWatermarkInput, userId: string) {
  const imageBase64 = Buffer.from(await image.arrayBuffer()).toString("base64");
  const logoBase64 = Buffer.from(await logo.arrayBuffer()).toString("base64");

  return {
    capability: "image_edit" as const,
    credentialSource: "platform_pool" as const,
    input: {
      backgroundContentType: logo.type || "image/png",
      backgroundFileName: logo.name || "logo.png",
      backgroundImageBase64: logoBase64,
      contentType: image.type || "image/png",
      fileName: image.name || "image.png",
      fileSize: image.size,
      imageBase64,
      logoSize,
      prompt: buildBrandWatermarkPrompt(logoSize)
    },
    modelId: getPreferredImageEditModelId(),
    productSlug: "dreamchasers",
    toolSlug: "ai-photo-editor-brand-watermark",
    userId
  };
}

export function assertSupportedPhotoEditInput({ image, mode, prompt }: PhotoEditInput) {
  assertSupportedImageFile(image, "原图");

  if (mode === "repair" || mode === "prompt_edit") {
    if (!prompt?.trim()) {
      throw new Error(mode === "repair" ? "请填写需要修复的内容。" : "请填写 AI 修图指令。");
    }

    if (prompt.length > 220) {
      throw new Error(mode === "repair" ? "修复描述不能超过 220 个字。" : "AI 修图指令不能超过 220 个字。");
    }
  }
}

export async function buildPhotoEditGatewayInput({ image, mode, prompt }: PhotoEditInput, userId: string) {
  const imageBase64 = Buffer.from(await image.arrayBuffer()).toString("base64");

  return {
    capability: "image_edit" as const,
    credentialSource: "platform_pool" as const,
    input: {
      contentType: image.type || "image/png",
      editMode: mode,
      fileName: image.name || "image.png",
      fileSize: image.size,
      imageBase64,
      prompt: buildPhotoEditPrompt(mode, prompt)
    },
    modelId: getPreferredImageEditModelId(),
    productSlug: "dreamchasers",
    toolSlug: `ai-photo-editor-${mode.replace("_", "-")}`,
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

function assertSupportedImageFile(image: File, label: string) {
  if (!supportedImageTypes.has(image.type)) {
    throw new Error(`${label}请上传 JPG、PNG 或 WebP 图片。`);
  }

  if (image.size > maxBeautyImageBytes) {
    throw new Error(`${label}不能超过 15MB。`);
  }
}

function getPreferredImageEditModelId() {
  const readiness = getProviderReadiness("openai_compatible");
  return readiness.status === "enabled" ? openAiCompatibleImageEditModelId : mockImageEditModelId;
}

function getPreferredBeautyModelId() {
  return getPreferredImageEditModelId();
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

function buildSceneBlendPrompt(prompt: string) {
  return [
    "Create a realistic product scene composite using the product image as the main subject and the background image as the environment reference.",
    "Do not simply paste the product onto the background.",
    "Preserve the product identity, shape, logo, material, color, and key details.",
    "Blend the product naturally into the scene with softened edges, contact shadows, coherent perspective, reflected light, ambient color, exposure, and surface interaction.",
    "Make it look like the product was actually photographed in the environment.",
    `Scene direction from the user: ${prompt.trim()}`,
    "Return only the final blended image."
  ].join(" ");
}

function buildBrandWatermarkPrompt(logoSize: number) {
  return [
    "Edit this photo by adding the uploaded logo as a watermark.",
    "Use the uploaded logo image exactly as the watermark source.",
    "Do not redraw the logo and do not invent a new logo.",
    "Do not crop, cut off, simplify, translate, misspell, recolor, reshape, or partially hide the logo.",
    "The complete logo must appear once in the bottom-right corner, fully inside the image with clear padding from the right and bottom edges.",
    `Set the complete logo size to about ${Math.round(logoSize)}% of the shorter side of this photo.`,
    "Keep all logo text, letters, icon shapes, colors, proportions, spacing, and transparent areas intact and readable.",
    "Preserve the rest of this photo unchanged, including people, faces, products, background, colors, composition, and existing text.",
    "Only apply minimal opacity, contrast, or shadow adjustment if needed to make the watermark readable; do not change the logo design.",
    "Do not add any other text, icons, stickers, borders, frames, mockups, or decorative elements.",
    "Return only the final watermarked image."
  ].join(" ");
}

function buildPhotoEditPrompt(mode: PhotoEditMode, prompt?: string) {
  if (mode === "enhance") {
    return [
      "Enhance this image for high-definition output.",
      "Improve clarity, fine detail, texture definition, mild compression artifacts, noise, and local contrast.",
      "Preserve the original composition, identity, faces, products, background, colors, text, logos, and overall style.",
      "Do not add new objects, remove objects, change the scene, change facial identity, redraw logos, or alter readable text.",
      "Keep the result natural and realistic, avoiding oversharpening, halos, waxy skin, cartoon effects, or artificial HDR.",
      "Return only the enhanced image."
    ].join(" ");
  }

  if (mode === "repair") {
    return [
      "Repair the uploaded image according to the user's instruction.",
      "The edit should remove or fix only the described blemish, obstruction, unwanted mark, small damaged area, or local artifact.",
      "Reconstruct the affected area with natural texture, lighting, shadows, perspective, and surrounding detail.",
      "Preserve all unrelated areas unchanged, including faces, products, background, composition, colors, text, and logos.",
      `User repair instruction: ${prompt?.trim() ?? ""}`,
      "Return only the repaired image."
    ].join(" ");
  }

  return [
    "Edit the uploaded image according to the user's instruction.",
    "Follow the instruction precisely while preserving unrelated areas, composition, identity, faces, products, text, and logos.",
    "Make the result natural and coherent with the original lighting, color, perspective, texture, and image style.",
    "Do not add unrelated objects or decorative elements.",
    `User edit instruction: ${prompt?.trim() ?? ""}`,
    "Return only the edited image."
  ].join(" ");
}
