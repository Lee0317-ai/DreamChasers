import { describe, expect, it } from "vitest";
import { createWordDocxDocument } from "../lib/pdf-text";

describe("pdf-text", () => {
  it("creates a real docx package instead of an HTML document", () => {
    const bytes = createWordDocxDocument("PDF to Word Beta", ["First page text"]);
    const textStart = new TextDecoder().decode(bytes.slice(0, 32));

    expect(bytes[0]).toBe(0x50);
    expect(bytes[1]).toBe(0x4b);
    expect(textStart.toLowerCase()).not.toContain("<!doctype html");
  });
});
