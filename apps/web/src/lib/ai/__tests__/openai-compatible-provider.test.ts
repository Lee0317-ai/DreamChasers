import { afterEach, describe, expect, it, vi } from "vitest";
import { createOpenAiCompatibleProvider } from "../providers/openai-compatible-provider";

const originalFetch = global.fetch;

describe("openai-compatible-provider", () => {
  afterEach(() => {
    global.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it("uses the image edit endpoint for image_edit capability", async () => {
    const json = vi.fn().mockResolvedValue({
      data: [
        {
          b64_json: "AQID"
        }
      ]
    });

    global.fetch = vi.fn().mockResolvedValue({
      json,
      ok: true
    } as unknown as Response);

    const provider = createOpenAiCompatibleProvider({
      apiKey: "sk-test",
      baseUrl: "https://example.com/v1"
    });

    const response = await provider.execute({
      capability: "image_edit",
      credentialSource: "platform_pool",
      input: {
        beautyType: "natural_portrait",
        contentType: "image/png",
        imageBase64: "AQID"
      },
      model: {
        capabilities: ["image_edit"],
        credentialSources: ["platform_pool"],
        creditCost: 3,
        displayName: "OpenAI-Compatible Image Edit",
        modelId: "openai-compatible-image-edit",
        providerId: "openai_compatible",
        qualityTier: "high",
        recommended: true,
        speedTier: "balanced"
      },
      productSlug: "dreamchasers",
      toolSlug: "ai-photo-editor-beauty",
      userId: "user_1"
    });

    expect(global.fetch).toHaveBeenCalledWith(
      "https://example.com/v1/images/edits",
      expect.objectContaining({
        method: "POST"
      })
    );
    expect(response.result).toEqual({
      contentType: "image/png",
      imageBase64: "AQID"
    });
  });

  it("passes product and background images to image edit requests", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue({
        data: [
          {
            b64_json: "BAUG"
          }
        ]
      }),
      ok: true
    } as unknown as Response);

    const provider = createOpenAiCompatibleProvider({
      apiKey: "sk-test",
      baseUrl: "https://example.com/v1"
    });

    await provider.execute({
      capability: "image_edit",
      credentialSource: "platform_pool",
      input: {
        backgroundContentType: "image/jpeg",
        backgroundImageBase64: "BAUG",
        contentType: "image/png",
        imageBase64: "AQID",
        prompt: "blend"
      },
      model: {
        capabilities: ["image_edit"],
        credentialSources: ["platform_pool"],
        creditCost: 3,
        displayName: "OpenAI-Compatible Image Edit",
        modelId: "openai-compatible-image-edit",
        providerId: "openai_compatible",
        qualityTier: "high",
        recommended: true,
        speedTier: "balanced"
      },
      productSlug: "dreamchasers",
      toolSlug: "ai-photo-editor-scene-blend",
      userId: "user_1"
    });

    const request = vi.mocked(global.fetch).mock.calls[0]?.[1] as RequestInit;
    const formData = request.body as FormData;
    const images = formData.getAll("image");

    expect(images).toHaveLength(2);
    expect(images[0]).toBeInstanceOf(File);
    expect(images[1]).toBeInstanceOf(File);
    expect((images[0] as File).name).toBe("product.png");
    expect((images[1] as File).name).toBe("background.png");
    expect(formData.get("prompt")).toBe("blend");
  });

  it("uses the provided secondary image filename for image edit requests", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue({
        data: [
          {
            b64_json: "BAUG"
          }
        ]
      }),
      ok: true
    } as unknown as Response);

    const provider = createOpenAiCompatibleProvider({
      apiKey: "sk-test",
      baseUrl: "https://example.com/v1"
    });

    await provider.execute({
      capability: "image_edit",
      credentialSource: "platform_pool",
      input: {
        backgroundContentType: "image/png",
        backgroundFileName: "DreamChasers logo.png",
        backgroundImageBase64: "BAUG",
        contentType: "image/png",
        imageBase64: "AQID",
        prompt: "watermark"
      },
      model: {
        capabilities: ["image_edit"],
        credentialSources: ["platform_pool"],
        creditCost: 3,
        displayName: "OpenAI-Compatible Image Edit",
        modelId: "openai-compatible-image-edit",
        providerId: "openai_compatible",
        qualityTier: "high",
        recommended: true,
        speedTier: "balanced"
      },
      productSlug: "dreamchasers",
      toolSlug: "ai-photo-editor-brand-watermark",
      userId: "user_1"
    });

    const request = vi.mocked(global.fetch).mock.calls[0]?.[1] as RequestInit;
    const formData = request.body as FormData;
    const images = formData.getAll("image");

    expect((images[1] as File).name).toBe("DreamChasers-logo.png");
  });

  it("uses configured provider image model for image edit requests", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue({
        data: [
          {
            b64_json: "AQID"
          }
        ]
      }),
      ok: true
    } as unknown as Response);

    const provider = createOpenAiCompatibleProvider({
      apiKey: "sk-test",
      baseUrl: "https://example.com/v1",
      imageModelId: "gpt-image-2"
    });

    await provider.execute({
      capability: "image_edit",
      credentialSource: "platform_pool",
      input: {
        contentType: "image/png",
        imageBase64: "AQID",
        prompt: "blend"
      },
      model: {
        capabilities: ["image_edit"],
        credentialSources: ["platform_pool"],
        creditCost: 3,
        displayName: "OpenAI-Compatible Image Edit",
        modelId: "openai-compatible-image-edit",
        providerId: "openai_compatible",
        qualityTier: "high",
        recommended: true,
        speedTier: "balanced"
      },
      productSlug: "dreamchasers",
      toolSlug: "ai-photo-editor-scene-blend",
      userId: "user_1"
    });

    const request = vi.mocked(global.fetch).mock.calls[0]?.[1] as RequestInit;
    const formData = request.body as FormData;

    expect(formData.get("model")).toBe("gpt-image-2");
  });

  it("includes provider error response text when image edit requests fail", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 400,
      text: vi.fn().mockResolvedValue('{"error":{"message":"model not found"}}')
    } as unknown as Response);

    const provider = createOpenAiCompatibleProvider({
      apiKey: "sk-test",
      baseUrl: "https://example.com/v1"
    });

    await expect(
      provider.execute({
        capability: "image_edit",
        credentialSource: "platform_pool",
        input: {
          contentType: "image/png",
          imageBase64: "AQID",
          prompt: "blend"
        },
        model: {
          capabilities: ["image_edit"],
          credentialSources: ["platform_pool"],
          creditCost: 3,
          displayName: "OpenAI-Compatible Image Edit",
          modelId: "openai-compatible-image-edit",
          providerId: "openai_compatible",
          qualityTier: "high",
          recommended: true,
          speedTier: "balanced"
        },
        productSlug: "dreamchasers",
        toolSlug: "ai-photo-editor-scene-blend",
        userId: "user_1"
      })
    ).rejects.toThrow('OpenAI-compatible provider request failed: 400 {"error":{"message":"model not found"}}');
  });
});
