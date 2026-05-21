import { describe, expect, it } from "vitest";
import { PDFDocument } from "pdf-lib";
import {
  addSignatureImageToPdf,
  addTextWatermarkToPdf,
  buildPdfFromPages,
  coverPdfArea,
  extractPdfPages,
  getPdfPageCount,
  imagesToPdf,
  mergePdfDocuments,
  normalizeRotation,
  removePdfPages,
  reorderPdfPages,
  rotatePdfPages
} from "../lib/pdf-actions";

const onePixelPng = Uint8Array.from([
  137, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 13, 73, 72, 68, 82, 0, 0, 0, 1, 0, 0, 0, 1, 8,
  6, 0, 0, 0, 31, 21, 196, 137, 0, 0, 0, 13, 73, 68, 65, 84, 120, 156, 99, 248, 15, 4, 0,
  9, 251, 3, 253, 160, 238, 224, 112, 0, 0, 0, 0, 73, 69, 78, 68, 174, 66, 96, 130
]);

async function createTestPdf(pageCount: number): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  for (let index = 0; index < pageCount; index += 1) {
    const page = pdf.addPage([240, 320]);
    page.drawText(`Page ${index + 1}`, { x: 24, y: 280, size: 18 });
  }
  return pdf.save();
}

describe("pdf-actions", () => {
  it("normalizes page rotations", () => {
    expect(normalizeRotation(0)).toBe(0);
    expect(normalizeRotation(90)).toBe(90);
    expect(normalizeRotation(450)).toBe(90);
    expect(normalizeRotation(-90)).toBe(270);
  });

  it("merges PDF documents", async () => {
    const first = await createTestPdf(2);
    const second = await createTestPdf(3);

    const merged = await mergePdfDocuments([first, second]);

    await expect(getPdfPageCount(merged)).resolves.toBe(5);
  });

  it("extracts selected pages", async () => {
    const source = await createTestPdf(4);

    const extracted = await extractPdfPages(source, [0, 2]);

    await expect(getPdfPageCount(extracted)).resolves.toBe(2);
  });

  it("removes pages", async () => {
    const source = await createTestPdf(4);

    const result = await removePdfPages(source, [1, 3]);

    await expect(getPdfPageCount(result)).resolves.toBe(2);
  });

  it("reorders pages", async () => {
    const source = await createTestPdf(3);

    const result = await reorderPdfPages(source, [2, 0, 1]);

    await expect(getPdfPageCount(result)).resolves.toBe(3);
  });

  it("rotates pages", async () => {
    const source = await createTestPdf(2);

    const result = await rotatePdfPages(source, { 0: 90 });
    const loaded = await PDFDocument.load(result);

    expect(loaded.getPage(0).getRotation().angle).toBe(90);
    expect(loaded.getPage(1).getRotation().angle).toBe(0);
  });

  it("builds a PDF from page specs across source files", async () => {
    const first = await createTestPdf(2);
    const second = await createTestPdf(2);

    const result = await buildPdfFromPages(
      [
        { id: "first", data: first },
        { id: "second", data: second }
      ],
      [
        { fileId: "second", pageIndex: 1, rotation: 180 },
        { fileId: "first", pageIndex: 0 }
      ]
    );
    const loaded = await PDFDocument.load(result);

    expect(loaded.getPageCount()).toBe(2);
    expect(loaded.getPage(0).getRotation().angle).toBe(180);
  });

  it("adds text watermarks", async () => {
    const source = await createTestPdf(2);

    const result = await addTextWatermarkToPdf(source, { text: "DreamChasers" });

    await expect(getPdfPageCount(result)).resolves.toBe(2);
    expect(result.byteLength).toBeGreaterThan(source.byteLength);
  });

  it("adds signature images", async () => {
    const source = await createTestPdf(1);

    const result = await addSignatureImageToPdf(source, {
      imageBytes: onePixelPng,
      imageType: "png"
    });

    await expect(getPdfPageCount(result)).resolves.toBe(1);
    expect(result.byteLength).toBeGreaterThan(source.byteLength);
  });

  it("covers a page area", async () => {
    const source = await createTestPdf(2);

    const result = await coverPdfArea(source, { position: "top-right" });

    await expect(getPdfPageCount(result)).resolves.toBe(2);
    expect(result.byteLength).toBeGreaterThan(source.byteLength);
  });

  it("converts images to PDF pages", async () => {
    const result = await imagesToPdf([
      { bytes: onePixelPng, imageType: "png" },
      { bytes: onePixelPng, imageType: "png" }
    ]);

    await expect(getPdfPageCount(result)).resolves.toBe(2);
  });
});
