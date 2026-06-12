import { describe, expect, it, vi } from "vitest";
import { AiGatewayError, runAiGatewayTask } from "../ai-gateway";

describe("AI Gateway", () => {
  it("runs a supported task, charges credits, and logs the request", async () => {
    const chargeCredits = vi.fn().mockResolvedValue(undefined);
    const createRequestLog = vi.fn().mockResolvedValue({ id: "log_1" });
    const execute = vi.fn().mockResolvedValue({
      outputSummary: "抽取完成",
      result: {
        summary: "Structured extraction result",
        title: "Example"
      }
    });

    const response = await runAiGatewayTask(
      {
        capability: "structured_extraction",
        credentialSource: "platform_pool",
        input: { text: "https://example.com" },
        modelId: "mock-structured-fast",
        productSlug: "timepick",
        toolSlug: "timepick",
        userId: "user_1"
      },
      {
        chargeCredits,
        createRequestLog,
        executeProvider: execute
      }
    );

    expect(response.status).toBe("succeeded");
    expect(response.creditCost).toBe(1);
    expect(response.result).toEqual({
      summary: "Structured extraction result",
      title: "Example"
    });
    expect(chargeCredits).toHaveBeenCalledWith({
      amount: 1,
      note: "AI Gateway structured_extraction via mock-structured-fast",
      scope: "platform",
      userId: "user_1"
    });
    expect(createRequestLog).toHaveBeenCalledWith(
      expect.objectContaining({
        capability: "structured_extraction",
        creditCost: 1,
        modelId: "mock-structured-fast",
        productSlug: "timepick",
        status: "succeeded",
        userId: "user_1"
      })
    );
  });

  it("rejects a model that does not support the capability", async () => {
    await expect(
      runAiGatewayTask(
        {
          capability: "structured_extraction",
          credentialSource: "platform_pool",
          input: { text: "https://example.com" },
          modelId: "mock-image-edit",
          productSlug: "timepick",
          userId: "user_1"
        },
        {
          chargeCredits: vi.fn(),
          createRequestLog: vi.fn(),
          executeProvider: vi.fn()
        }
      )
    ).rejects.toMatchObject({
      code: "model_not_allowed",
      status: 400
    } satisfies Partial<AiGatewayError>);
  });

  it("maps insufficient platform credits to a structured gateway error", async () => {
    await expect(
      runAiGatewayTask(
        {
          capability: "text_generation",
          credentialSource: "platform_pool",
          input: { message: "今天适合推进什么？" },
          modelId: "mock-structured-fast",
          productSlug: "timepick",
          toolSlug: "timepick-fortune-chat",
          userId: "user_1"
        },
        {
          chargeCredits: vi.fn().mockRejectedValue(new Error("平台积分不足。")),
          createRequestLog: vi.fn(),
          executeProvider: vi.fn()
        }
      )
    ).rejects.toMatchObject({
      code: "insufficient_credits",
      message: "平台积分不足。",
      status: 402
    } satisfies Partial<AiGatewayError>);
  });

  it("blocks openai-compatible models when provider config is incomplete", async () => {
    const previousKey = process.env.AI_GATEWAY_OPENAI_COMPATIBLE_API_KEY;
    delete process.env.AI_GATEWAY_OPENAI_COMPATIBLE_API_KEY;

    await expect(
      runAiGatewayTask(
        {
          capability: "text_generation",
          credentialSource: "external_gateway_byok",
          input: { message: "今天适合推进什么？" },
          modelId: "openai-compatible-general",
          productSlug: "timepick",
          toolSlug: "timepick-fortune-chat",
          userId: "user_1"
        },
        {
          chargeCredits: vi.fn(),
          createRequestLog: vi.fn(),
          executeProvider: vi.fn()
        }
      )
    ).rejects.toMatchObject({
      code: "provider_misconfigured",
      status: 503
    } satisfies Partial<AiGatewayError>);

    process.env.AI_GATEWAY_OPENAI_COMPATIBLE_API_KEY = previousKey;
  });

  it("refunds credits when provider execution fails after charging", async () => {
    const chargeCredits = vi.fn().mockResolvedValue(undefined);
    const refundCredits = vi.fn().mockResolvedValue(undefined);
    const createRequestLog = vi.fn().mockResolvedValue({ id: "log_1" });

    await expect(
      runAiGatewayTask(
        {
          capability: "text_generation",
          credentialSource: "platform_pool",
          input: { message: "今天适合推进什么？" },
          modelId: "mock-structured-fast",
          productSlug: "timepick",
          toolSlug: "timepick-fortune-chat",
          userId: "user_1"
        },
        {
          chargeCredits,
          createRequestLog,
          executeProvider: vi.fn().mockRejectedValue(new Error("provider down")),
          refundCredits
        }
      )
    ).rejects.toThrow("provider down");

    expect(refundCredits).toHaveBeenCalledWith({
      amount: 1,
      note: "AI Gateway refund text_generation via mock-structured-fast",
      scope: "platform",
      userId: "user_1"
    });
    expect(createRequestLog).toHaveBeenCalledWith(
      expect.objectContaining({
        errorCode: "execution_failed",
        outputSummary: "provider down",
        status: "failed"
      })
    );
  });

  it("rejects image_edit tasks when the image payload is missing", async () => {
    const chargeCredits = vi.fn();
    const createRequestLog = vi.fn();

    await expect(
      runAiGatewayTask(
        {
          capability: "image_edit",
          credentialSource: "platform_pool",
          input: {
            contentType: "image/png",
            prompt: "polish portrait"
          },
          modelId: "mock-image-edit",
          productSlug: "dreamchasers",
          toolSlug: "ai-photo-editor-beauty",
          userId: "user_1"
        },
        {
          chargeCredits,
          createRequestLog,
          executeProvider: vi.fn()
        }
      )
    ).rejects.toMatchObject({
      code: "input_invalid",
      status: 400
    } satisfies Partial<AiGatewayError>);

    expect(chargeCredits).not.toHaveBeenCalled();
    expect(createRequestLog).not.toHaveBeenCalled();
  });

  it("rejects image_generation tasks when prompt is empty", async () => {
    await expect(
      runAiGatewayTask(
        {
          capability: "image_generation",
          credentialSource: "platform_pool",
          input: {},
          modelId: "mock-image-edit",
          productSlug: "dreamchasers",
          toolSlug: "platform-image-generation",
          userId: "user_1"
        },
        {
          chargeCredits: vi.fn(),
          createRequestLog: vi.fn(),
          executeProvider: vi.fn()
        }
      )
    ).rejects.toMatchObject({
      code: "input_invalid",
      status: 400
    } satisfies Partial<AiGatewayError>);
  });
});
