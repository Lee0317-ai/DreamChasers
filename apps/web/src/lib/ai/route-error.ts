import { AiGatewayError } from "./ai-gateway";

export function buildAiGatewayErrorPayload(error: unknown, fallbackMessage: string) {
  if (error instanceof AiGatewayError) {
    return {
      body: {
        code: error.code,
        error: error.message
      },
      status: error.status
    };
  }

  return {
    body: {
      code: "execution_failed",
      error: error instanceof Error ? error.message : fallbackMessage
    },
    status: 500
  };
}
