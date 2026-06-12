import { describe, expect, it } from "vitest";
import { getModelForCapability, getModelsForCapability, listAiCapabilities } from "../model-catalog";

describe("AI model catalog", () => {
  it("returns only models enabled for the requested capability", () => {
    const models = getModelsForCapability("structured_extraction");

    expect(models.length).toBeGreaterThan(0);
    expect(models.every((model) => model.capabilities.includes("structured_extraction"))).toBe(true);
  });

  it("does not return image edit models for structured extraction", () => {
    const models = getModelsForCapability("structured_extraction");

    expect(models.some((model) => model.modelId === "mock-image-edit")).toBe(false);
  });

  it("finds a model only when it supports the capability", () => {
    expect(getModelForCapability("structured_extraction", "mock-structured-fast")?.creditCost).toBe(1);
    expect(getModelForCapability("structured_extraction", "mock-image-edit")).toBeNull();
  });

  it("lists stable AI capabilities", () => {
    expect(listAiCapabilities()).toContain("structured_extraction");
    expect(listAiCapabilities()).toContain("image_edit");
  });
});
