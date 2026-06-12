export const aiCapabilities = [
  "text_generation",
  "structured_extraction",
  "image_understanding",
  "image_generation",
  "image_edit",
  "ocr",
  "moderation"
] as const;

export type AiCapability = (typeof aiCapabilities)[number];

export function isAiCapability(value: string): value is AiCapability {
  return aiCapabilities.includes(value as AiCapability);
}

export function listAiCapabilities() {
  return [...aiCapabilities];
}
