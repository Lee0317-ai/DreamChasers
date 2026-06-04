"use client";

import { useMemo, useState } from "react";
import {
  addSignatureImageToPdf,
  addTextWatermarkToPdf,
  buildPdfFromPages,
  coverPdfArea,
  getPdfPageCount,
  imagesToPdf
} from "../lib/pdf-actions";
import { createWordDocxDocument, extractPdfText } from "../lib/pdf-text";
import type { PdfActionResult, PdfBuildPage, PdfPageItem, PdfSourceFile } from "../types";
import { PdfActionPanel } from "./PdfActionPanel";
import { PdfFileList } from "./PdfFileList";
import { PdfPageGrid } from "./PdfPageGrid";
import { PdfResultBar } from "./PdfResultBar";
import { PdfUploader } from "./PdfUploader";

function createId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function downloadBytes(result: PdfActionResult) {
  const buffer = new ArrayBuffer(result.bytes.byteLength);
  new Uint8Array(buffer).set(result.bytes);
  const blob = new Blob([buffer], { type: result.mimeType ?? "application/pdf" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = result.fileName;
  anchor.style.display = "none";
  document.body.append(anchor);
  anchor.click();
  window.setTimeout(() => {
    anchor.remove();
    URL.revokeObjectURL(url);
  }, 1000);
}

function createPagesForFile(file: PdfSourceFile): PdfPageItem[] {
  return Array.from({ length: file.pageCount }, (_, index) => ({
    id: `${file.id}-page-${index}`,
    fileId: file.id,
    fileName: file.name,
    pageIndex: index,
    pageNumber: index + 1,
    rotation: 0,
    selected: false,
    deleted: false
  }));
}

export function PdfToolbox() {
  const [files, setFiles] = useState<PdfSourceFile[]>([]);
  const [pages, setPages] = useState<PdfPageItem[]>([]);
  const [isBusy, setIsBusy] = useState(false);
  const [statusText, setStatusText] = useState("上传 PDF 后开始处理。");
  const [result, setResult] = useState<PdfActionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [watermarkText, setWatermarkText] = useState("");
  const [signatureFile, setSignatureFile] = useState<File | null>(null);
  const [coverPosition, setCoverPosition] = useState("top-right");
  const [scanImageFiles, setScanImageFiles] = useState<File[]>([]);

  const activePages = useMemo(() => pages.filter((page) => !page.deleted), [pages]);
  const selectedPages = useMemo(
    () => activePages.filter((page) => page.selected),
    [activePages]
  );
  const selectedIndexes = useMemo(
    () => selectedPages.map((page) => activePages.findIndex((activePage) => activePage.id === page.id)),
    [activePages, selectedPages]
  );
  const canMoveUp = selectedIndexes.length > 0 && selectedIndexes.every((index) => index > 0);
  const canMoveDown =
    selectedIndexes.length > 0 && selectedIndexes.every((index) => index < activePages.length - 1);

  async function handleFilesSelected(uploadedFiles: File[]) {
    const pdfFiles = uploadedFiles.filter(
      (file) => file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")
    );

    if (!pdfFiles.length) {
      setError("请选择 PDF 文件。");
      return;
    }

    setIsBusy(true);
    setError(null);
    setResult(null);
    setStatusText("正在读取 PDF...");

    try {
      const loadedFiles: PdfSourceFile[] = [];
      const loadedPages: PdfPageItem[] = [];

      for (const file of pdfFiles) {
        const data = await file.arrayBuffer();
        const sourceFile: PdfSourceFile = {
          id: createId("pdf"),
          name: file.name,
          size: file.size,
          data,
          pageCount: await getPdfPageCount(data)
        };
        loadedFiles.push(sourceFile);
        loadedPages.push(...createPagesForFile(sourceFile));
      }

      setFiles((currentFiles) => [...currentFiles, ...loadedFiles]);
      setPages((currentPages) => [...currentPages, ...loadedPages]);
      setStatusText(`已加载 ${loadedFiles.length} 个文件，合计 ${loadedPages.length} 页。`);
    } catch {
      setError("PDF 读取失败。文件可能已损坏、加密，或浏览器无法解析。");
      setStatusText("读取失败，请换一个 PDF 再试。");
    } finally {
      setIsBusy(false);
    }
  }

  function removeFile(fileId: string) {
    setFiles((currentFiles) => currentFiles.filter((file) => file.id !== fileId));
    setPages((currentPages) => currentPages.filter((page) => page.fileId !== fileId));
    setResult(null);
    setError(null);
  }

  function togglePage(pageId: string) {
    setPages((currentPages) =>
      currentPages.map((page) =>
        page.id === pageId ? { ...page, selected: !page.selected } : page
      )
    );
  }

  function updateSelectedPages(update: (page: PdfPageItem) => PdfPageItem) {
    setPages((currentPages) =>
      currentPages.map((page) => (page.selected && !page.deleted ? update(page) : page))
    );
  }

  function moveSelected(direction: -1 | 1) {
    setPages((currentPages) => {
      const nextPages = [...currentPages];
      const indexes =
        direction === -1
          ? nextPages.map((page, index) => ({ page, index })).filter(({ page }) => page.selected)
          : nextPages
              .map((page, index) => ({ page, index }))
              .filter(({ page }) => page.selected)
              .reverse();

      for (const { index } of indexes) {
        const targetIndex = index + direction;
        if (targetIndex < 0 || targetIndex >= nextPages.length) {
          continue;
        }
        [nextPages[index], nextPages[targetIndex]] = [nextPages[targetIndex], nextPages[index]];
      }

      return nextPages;
    });
  }

  async function buildAndDownload(fileName: string, pageSpecs: PdfBuildPage[]) {
    if (!pageSpecs.length) {
      setError("没有可导出的页面。");
      return;
    }

    setIsBusy(true);
    setError(null);
    setResult(null);
    setStatusText("正在生成 PDF...");

    try {
      const bytes = await buildPdfFromPages(files, pageSpecs);
      const nextResult = { fileName, bytes };
      setResult(nextResult);
      downloadBytes(nextResult);
      setStatusText("PDF 已生成。");
    } catch {
      setError("生成 PDF 失败。请减少文件数量或页面数量后重试。");
      setStatusText("处理失败。");
    } finally {
      setIsBusy(false);
    }
  }

  async function buildCurrentPdfBytes() {
    const pageSpecs = currentPageSpecs();
    if (!pageSpecs.length) {
      throw new Error("No pages to export");
    }
    return buildPdfFromPages(files, pageSpecs);
  }

  async function applyTextWatermark() {
    const text = watermarkText.trim();
    if (!text) {
      setError("请先输入水印文字。");
      return;
    }

    setIsBusy(true);
    setError(null);
    setResult(null);
    setStatusText("正在添加文字水印...");

    try {
      const sourceBytes = await buildCurrentPdfBytes();
      const bytes = await addTextWatermarkToPdf(sourceBytes, { text });
      const nextResult = { fileName: "dreamchasers-watermark.pdf", bytes };
      setResult(nextResult);
      downloadBytes(nextResult);
      setStatusText("文字水印 PDF 已生成。");
    } catch {
      setError("添加文字水印失败。请减少页面数量后重试。");
      setStatusText("处理失败。");
    } finally {
      setIsBusy(false);
    }
  }

  async function applySignature() {
    if (!signatureFile) {
      setError("请先选择 PNG 或 JPG 签名图片。");
      return;
    }

    const extension = signatureFile.name.toLowerCase();
    const imageType = extension.endsWith(".png") ? "png" : "jpg";

    setIsBusy(true);
    setError(null);
    setResult(null);
    setStatusText("正在添加签名...");

    try {
      const sourceBytes = await buildCurrentPdfBytes();
      const bytes = await addSignatureImageToPdf(sourceBytes, {
        imageBytes: await signatureFile.arrayBuffer(),
        imageType
      });
      const nextResult = { fileName: "dreamchasers-signed.pdf", bytes };
      setResult(nextResult);
      downloadBytes(nextResult);
      setStatusText("签名 PDF 已生成。");
    } catch {
      setError("添加签名失败。请确认图片是 PNG 或 JPG 格式。");
      setStatusText("处理失败。");
    } finally {
      setIsBusy(false);
    }
  }

  async function exportWordBeta() {
    setIsBusy(true);
    setError(null);
    setResult(null);
    setStatusText("正在抽取文本并生成 Word Beta...");

    try {
      const sourceBytes = await buildCurrentPdfBytes();
      const buffer = new ArrayBuffer(sourceBytes.byteLength);
      new Uint8Array(buffer).set(sourceBytes);
      const pagesText = await extractPdfText(buffer);
      const bytes = createWordDocxDocument("DreamChasers PDF to Word Beta", pagesText);
      const nextResult = {
        fileName: "dreamchasers-pdf-to-word-beta.docx",
        bytes,
        mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      };
      setResult(nextResult);
      downloadBytes(nextResult);
      setStatusText("Word Beta 已生成。");
    } catch {
      setError("PDF 转 Word Beta 失败。扫描件或复杂版式可能需要后续 OCR 能力。");
      setStatusText("处理失败。");
    } finally {
      setIsBusy(false);
    }
  }

  async function applyCoverArea() {
    setIsBusy(true);
    setError(null);
    setResult(null);
    setStatusText("正在遮盖区域...");

    try {
      const sourceBytes = await buildCurrentPdfBytes();
      const bytes = await coverPdfArea(sourceBytes, {
        position: coverPosition as "top-right" | "top-left" | "bottom-right" | "bottom-left" | "center"
      });
      const nextResult = { fileName: "dreamchasers-covered.pdf", bytes };
      setResult(nextResult);
      downloadBytes(nextResult);
      setStatusText("遮盖区域 PDF 已生成。");
    } catch {
      setError("遮盖区域失败。请减少页面数量后重试。");
      setStatusText("处理失败。");
    } finally {
      setIsBusy(false);
    }
  }

  async function convertImagesToPdf() {
    const validFiles = scanImageFiles.filter(
      (file) =>
        file.type === "image/png" ||
        file.type === "image/jpeg" ||
        file.name.toLowerCase().endsWith(".png") ||
        file.name.toLowerCase().endsWith(".jpg") ||
        file.name.toLowerCase().endsWith(".jpeg")
    );

    if (!validFiles.length) {
      setError("请先选择 PNG 或 JPG 图片。");
      return;
    }

    setIsBusy(true);
    setError(null);
    setResult(null);
    setStatusText("正在将图片合成为 PDF...");

    try {
      const bytes = await imagesToPdf(
        await Promise.all(
          validFiles.map(async (file) => ({
            bytes: await file.arrayBuffer(),
            imageType: file.name.toLowerCase().endsWith(".png") ? ("png" as const) : ("jpg" as const)
          }))
        )
      );
      const nextResult = { fileName: "dreamchasers-scan-images.pdf", bytes };
      setResult(nextResult);
      downloadBytes(nextResult);
      setStatusText("图片扫描 PDF 已生成。");
    } catch {
      setError("图片扫描成 PDF 失败。请确认图片是 PNG 或 JPG 格式。");
      setStatusText("处理失败。");
    } finally {
      setIsBusy(false);
    }
  }

  function currentPageSpecs(): PdfBuildPage[] {
    return activePages.map((page) => ({
      fileId: page.fileId,
      pageIndex: page.pageIndex,
      rotation: page.rotation
    }));
  }

  return (
    <main className="pdf-toolbox-page tools-station">
      <section className="pdf-hero">
        <div className="container pdf-hero-inner">
          <a className="pdf-back-link" href="/tools">
            返回工具箱
          </a>
          <span className="page-kicker">Browser PDF Toolbox</span>
          <h1>PDF 工具箱</h1>
          <p>合并、拆分、删除、排序和旋转 PDF 页面。文件在浏览器内处理，不上传服务器。</p>
          <div className="pdf-hero-note">
            PDF 转 Word、OCR 和复杂压缩会分阶段补齐，扫描件识别后续归入 AI/OCR 能力。
          </div>
        </div>
      </section>

      <section className="container pdf-workspace" aria-label="PDF 工具台">
        <div className="pdf-main-panel">
          <PdfUploader disabled={isBusy} onFilesSelected={handleFilesSelected} />
          <PdfResultBar error={error} result={result} />
          <div className="pdf-status-line">{statusText}</div>
          <PdfPageGrid files={files} onTogglePage={togglePage} pages={pages} />
        </div>

        <div className="pdf-side-panel">
          <PdfFileList files={files} onRemoveFile={removeFile} />
          <PdfActionPanel
            canActOnPages={selectedPages.length > 0}
            canBuild={activePages.length > 0}
            canMoveDown={canMoveDown}
            canMoveUp={canMoveUp}
            isBusy={isBusy}
            watermarkText={watermarkText}
            coverPosition={coverPosition}
            onClear={() => {
              setFiles([]);
              setPages([]);
              setResult(null);
              setError(null);
              setStatusText("上传 PDF 后开始处理。");
            }}
            onDeleteSelected={() => {
              updateSelectedPages((page) => ({ ...page, deleted: true, selected: false }));
              setResult(null);
            }}
            onDownloadCurrent={() => buildAndDownload("dreamchasers-pdf-toolbox.pdf", currentPageSpecs())}
            onApplyCoverArea={applyCoverArea}
            onApplySignature={applySignature}
            onApplyWatermark={applyTextWatermark}
            onCoverPositionChange={setCoverPosition}
            onExportWord={exportWordBeta}
            onExtractSelected={() =>
              buildAndDownload(
                "dreamchasers-pdf-selection.pdf",
                selectedPages.map((page) => ({
                  fileId: page.fileId,
                  pageIndex: page.pageIndex,
                  rotation: page.rotation
                }))
              )
            }
            onMoveDown={() => moveSelected(1)}
            onImagesSelected={setScanImageFiles}
            onImagesToPdf={convertImagesToPdf}
            onMoveUp={() => moveSelected(-1)}
            onRotateLeft={() =>
              updateSelectedPages((page) => ({ ...page, rotation: (page.rotation + 270) % 360 }))
            }
            onRotateRight={() =>
              updateSelectedPages((page) => ({ ...page, rotation: (page.rotation + 90) % 360 }))
            }
            onSignatureSelected={setSignatureFile}
            onSelectAll={() =>
              setPages((currentPages) =>
                currentPages.map((page) => (page.deleted ? page : { ...page, selected: true }))
              )
            }
            selectedCount={selectedPages.length}
            onWatermarkTextChange={setWatermarkText}
          />
        </div>
      </section>
    </main>
  );
}
