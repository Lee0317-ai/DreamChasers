import { describe, expect, it } from "vitest";
import { buildTimePickCorsHeaders, isAllowedTimePickOrigin } from "../timepick-cors";

describe("timepick cors", () => {
  it("allows the TimePick local dev origin for credentialed API calls", () => {
    expect(isAllowedTimePickOrigin("http://localhost:8080")).toBe(true);
    expect(isAllowedTimePickOrigin("http://127.0.0.1:8080")).toBe(true);
    expect(isAllowedTimePickOrigin("https://example.com")).toBe(false);
  });

  it("builds credentialed CORS headers only for allowed origins", () => {
    expect(buildTimePickCorsHeaders("http://localhost:8080")).toEqual({
      "Access-Control-Allow-Credentials": "true",
      "Access-Control-Allow-Headers": "Content-Type, Accept",
      "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
      "Access-Control-Allow-Origin": "http://localhost:8080",
      Vary: "Origin"
    });
    expect(buildTimePickCorsHeaders("https://example.com")).toEqual({
      Vary: "Origin"
    });
  });
});
