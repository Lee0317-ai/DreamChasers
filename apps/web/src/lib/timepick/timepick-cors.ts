const defaultAllowedTimePickOrigins = ["http://localhost:8080", "http://127.0.0.1:8080"];

export function getAllowedTimePickOrigins() {
  const configuredOrigins = process.env.TIMEPICK_ALLOWED_ORIGINS?.split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  return configuredOrigins && configuredOrigins.length > 0 ? configuredOrigins : defaultAllowedTimePickOrigins;
}

export function isAllowedTimePickOrigin(origin: string | null) {
  return Boolean(origin && getAllowedTimePickOrigins().includes(origin));
}

export function buildTimePickCorsHeaders(origin: string | null): Record<string, string> {
  if (!origin || !isAllowedTimePickOrigin(origin)) {
    return {
      Vary: "Origin"
    };
  }

  return {
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Headers": "Content-Type, Accept",
    "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
    "Access-Control-Allow-Origin": origin,
    Vary: "Origin"
  };
}

export function buildTimePickCorsHeadersForRequest(request: Request) {
  return buildTimePickCorsHeaders(request.headers.get("origin"));
}

export function buildTimePickOptionsResponse(request: Request) {
  return new Response(null, {
    headers: buildTimePickCorsHeadersForRequest(request),
    status: 204
  });
}
