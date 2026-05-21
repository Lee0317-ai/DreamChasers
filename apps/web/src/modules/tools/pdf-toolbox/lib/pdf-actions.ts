import { PDFDocument, StandardFonts, degrees, rgb } from "pdf-lib";
import type {
  PdfBuildPage,
  PdfBuildSource,
  PdfCoverAreaOptions,
  ImageToPdfInput,
  PdfSignatureOptions,
  PdfWatermarkOptions
} from "../types";

function toArrayBuffer(input: ArrayBuffer | Uint8Array): ArrayBuffer {
  if (input instanceof ArrayBuffer) {
    return input.slice(0);
  }

  const buffer = new ArrayBuffer(input.byteLength);
  new Uint8Array(buffer).set(input);
  return buffer;
}

export function normalizeRotation(rotation: number): 0 | 90 | 180 | 270 {
  const normalized = ((rotation % 360) + 360) % 360;
  if (normalized < 45 || normalized >= 315) {
    return 0;
  }
  if (normalized < 135) {
    return 90;
  }
  if (normalized < 225) {
    return 180;
  }
  return 270;
}

export async function getPdfPageCount(input: ArrayBuffer | Uint8Array): Promise<number> {
  const pdf = await PDFDocument.load(toArrayBuffer(input));
  return pdf.getPageCount();
}

export async function mergePdfDocuments(inputs: Array<ArrayBuffer | Uint8Array>): Promise<Uint8Array> {
  const output = await PDFDocument.create();

  for (const input of inputs) {
    const source = await PDFDocument.load(toArrayBuffer(input));
    const copiedPages = await output.copyPages(source, source.getPageIndices());
    copiedPages.forEach((page) => output.addPage(page));
  }

  return output.save();
}

export async function extractPdfPages(
  input: ArrayBuffer | Uint8Array,
  pageIndices: number[]
): Promise<Uint8Array> {
  const source = await PDFDocument.load(toArrayBuffer(input));
  const output = await PDFDocument.create();
  const copiedPages = await output.copyPages(source, pageIndices);
  copiedPages.forEach((page) => output.addPage(page));
  return output.save();
}

export async function removePdfPages(
  input: ArrayBuffer | Uint8Array,
  removedPageIndices: number[]
): Promise<Uint8Array> {
  const source = await PDFDocument.load(toArrayBuffer(input));
  const removed = new Set(removedPageIndices);
  const keptPageIndices = source.getPageIndices().filter((index) => !removed.has(index));
  return extractPdfPages(input, keptPageIndices);
}

export async function reorderPdfPages(
  input: ArrayBuffer | Uint8Array,
  pageIndices: number[]
): Promise<Uint8Array> {
  return extractPdfPages(input, pageIndices);
}

export async function rotatePdfPages(
  input: ArrayBuffer | Uint8Array,
  rotationsByPageIndex: Record<number, number>
): Promise<Uint8Array> {
  const source = await PDFDocument.load(toArrayBuffer(input));

  for (const [pageIndex, rotation] of Object.entries(rotationsByPageIndex)) {
    const page = source.getPage(Number(pageIndex));
    page.setRotation(degrees(normalizeRotation(rotation)));
  }

  return source.save();
}

export async function buildPdfFromPages(
  sources: PdfBuildSource[],
  pages: PdfBuildPage[]
): Promise<Uint8Array> {
  const output = await PDFDocument.create();
  const loadedSources = new Map<string, PDFDocument>();

  for (const source of sources) {
    loadedSources.set(source.id, await PDFDocument.load(toArrayBuffer(source.data)));
  }

  for (const pageSpec of pages) {
    const source = loadedSources.get(pageSpec.fileId);
    if (!source) {
      throw new Error(`PDF source not found: ${pageSpec.fileId}`);
    }

    const [copiedPage] = await output.copyPages(source, [pageSpec.pageIndex]);
    if (!copiedPage) {
      throw new Error(`PDF page not found: ${pageSpec.pageIndex}`);
    }

    copiedPage.setRotation(degrees(normalizeRotation(pageSpec.rotation ?? 0)));
    output.addPage(copiedPage);
  }

  return output.save();
}

export async function addTextWatermarkToPdf(
  input: ArrayBuffer | Uint8Array,
  options: PdfWatermarkOptions
): Promise<Uint8Array> {
  const text = options.text.trim();
  if (!text) {
    throw new Error("Watermark text is required");
  }

  const pdf = await PDFDocument.load(toArrayBuffer(input));
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const opacity = options.opacity ?? 0.22;

  for (const page of pdf.getPages()) {
    const { width, height } = page.getSize();
    const fontSize = Math.max(24, Math.min(width, height) / 10);
    const textWidth = font.widthOfTextAtSize(text, fontSize);

    page.drawText(text, {
      x: (width - textWidth) / 2,
      y: height / 2,
      size: fontSize,
      font,
      color: rgb(0.18, 0.32, 0.78),
      opacity,
      rotate: degrees(-30)
    });
  }

  return pdf.save();
}

export async function addSignatureImageToPdf(
  input: ArrayBuffer | Uint8Array,
  options: PdfSignatureOptions
): Promise<Uint8Array> {
  const pdf = await PDFDocument.load(toArrayBuffer(input));
  const image =
    options.imageType === "png"
      ? await pdf.embedPng(toArrayBuffer(options.imageBytes))
      : await pdf.embedJpg(toArrayBuffer(options.imageBytes));

  for (const page of pdf.getPages()) {
    const { width } = page.getSize();
    const maxWidth = Math.min(150, width * 0.32);
    const dimensions = image.scale(maxWidth / image.width);

    page.drawImage(image, {
      x: width - dimensions.width - 36,
      y: 36,
      width: dimensions.width,
      height: dimensions.height,
      opacity: 0.92
    });
  }

  return pdf.save();
}

export async function coverPdfArea(
  input: ArrayBuffer | Uint8Array,
  options: PdfCoverAreaOptions
): Promise<Uint8Array> {
  const pdf = await PDFDocument.load(toArrayBuffer(input));
  const widthRatio = options.widthRatio ?? 0.28;
  const heightRatio = options.heightRatio ?? 0.1;
  const marginRatio = 0.06;

  for (const page of pdf.getPages()) {
    const { width, height } = page.getSize();
    const coverWidth = width * widthRatio;
    const coverHeight = height * heightRatio;
    const margin = Math.min(width, height) * marginRatio;
    let x = width - coverWidth - margin;
    let y = height - coverHeight - margin;

    if (options.position.includes("left")) {
      x = margin;
    }
    if (options.position.includes("bottom")) {
      y = margin;
    }
    if (options.position === "center") {
      x = (width - coverWidth) / 2;
      y = (height - coverHeight) / 2;
    }

    page.drawRectangle({
      x,
      y,
      width: coverWidth,
      height: coverHeight,
      color: rgb(1, 1, 1),
      opacity: 1
    });
  }

  return pdf.save();
}

export async function imagesToPdf(images: ImageToPdfInput[]): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  const pageWidth = 595.28;
  const pageHeight = 841.89;
  const margin = 36;

  for (const imageInput of images) {
    const image =
      imageInput.imageType === "png"
        ? await pdf.embedPng(toArrayBuffer(imageInput.bytes))
        : await pdf.embedJpg(toArrayBuffer(imageInput.bytes));
    const page = pdf.addPage([pageWidth, pageHeight]);
    const maxWidth = pageWidth - margin * 2;
    const maxHeight = pageHeight - margin * 2;
    const scale = Math.min(maxWidth / image.width, maxHeight / image.height);
    const drawWidth = image.width * scale;
    const drawHeight = image.height * scale;

    page.drawImage(image, {
      x: (pageWidth - drawWidth) / 2,
      y: (pageHeight - drawHeight) / 2,
      width: drawWidth,
      height: drawHeight
    });
  }

  return pdf.save();
}
