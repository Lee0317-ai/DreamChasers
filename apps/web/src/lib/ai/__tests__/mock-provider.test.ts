import { describe, expect, it } from "vitest";
import { mockAiProvider } from "../providers/mock-provider";

describe("mock-provider", () => {
  it("returns deterministic text output for text generation requests", async () => {
    const response = await mockAiProvider.execute({
      capability: "text_generation",
      credentialSource: "platform_pool",
      input: {
        message: "今天适合推进什么？"
      },
      model: {
        capabilities: ["text_generation"],
        credentialSources: ["platform_pool"],
        creditCost: 1,
        displayName: "Mock Text",
        modelId: "mock-structured-fast",
        providerId: "mock",
        qualityTier: "standard",
        recommended: true,
        speedTier: "fast"
      },
      productSlug: "timepick",
      toolSlug: "timepick-fortune-chat",
      userId: "user_1"
    });

    expect(response.outputSummary).toContain("今天适合推进什么");
    expect(response.result).toEqual(
      expect.objectContaining({
        text: expect.stringContaining("今天适合推进什么")
      })
    );
  });

  it("returns deterministic extraction fields for URL recognition requests", async () => {
    const response = await mockAiProvider.execute({
      capability: "structured_extraction",
      credentialSource: "platform_pool",
      input: {
        url: "https://www.example.com/articles/alpha?ref=timepick"
      },
      model: {
        capabilities: ["structured_extraction"],
        credentialSources: ["platform_pool"],
        creditCost: 1,
        displayName: "Mock Structured",
        modelId: "mock-structured-fast",
        providerId: "mock",
        qualityTier: "standard",
        recommended: true,
        speedTier: "fast"
      },
      productSlug: "timepick",
      toolSlug: "timepick-url-recognition",
      userId: "user_1"
    });

    expect(response.outputSummary).toContain("example.com");
    expect(response.result).toEqual({
      summary: "识别到来自 example.com 的链接内容，可先作为待读文章或资料收集入口。",
      thumbnailUrl: "",
      title: "example.com"
    });
  });

  it("returns image payload fields for image edit requests", async () => {
    const response = await mockAiProvider.execute({
      capability: "image_edit",
      credentialSource: "platform_pool",
      input: {
        beautyType: "natural_portrait",
        contentType: "image/png",
        imageBase64: "dGVzdA=="
      },
      model: {
        capabilities: ["image_edit"],
        credentialSources: ["platform_pool"],
        creditCost: 3,
        displayName: "Mock Image Edit",
        modelId: "mock-image-edit",
        providerId: "mock",
        qualityTier: "standard",
        recommended: true,
        speedTier: "balanced"
      },
      productSlug: "dreamchasers",
      toolSlug: "ai-photo-editor-beauty",
      userId: "user_1"
    });

    expect(response.outputSummary).toContain("模拟完成");
    expect(response.result).toEqual({
      contentType: "image/png",
      imageBase64: "dGVzdA==",
      summary: "Image edit result"
    });
  });
});
