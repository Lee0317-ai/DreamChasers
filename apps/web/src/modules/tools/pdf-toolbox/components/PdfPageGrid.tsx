"use client";

import { useEffect, useRef, useState } from "react";
import { renderPdfPageToCanvas } from "../lib/pdf-render";
import type { PdfPageItem, PdfSourceFile } from "../types";

type PdfPageGridProps = {
  files: PdfSourceFile[];
  pages: PdfPageItem[];
  onTogglePage: (pageId: string) => void;
};

function PdfPagePreview({
  file,
  page
}: {
  file: PdfSourceFile | undefined;
  page: PdfPageItem;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [status, setStatus] = useState<"idle" | "ready" | "error">("idle");

  useEffect(() => {
    let cancelled = false;
    const canvas = canvasRef.current;

    if (!file || !canvas) {
      return;
    }

    setStatus("idle");
    renderPdfPageToCanvas({
      canvas,
      data: file.data,
      pageNumber: page.pageNumber,
      rotation: page.rotation
    })
      .then(() => {
        if (!cancelled) {
          setStatus("ready");
        }
      })
      .catch(() => {
        if (!cancelled) {
          setStatus("error");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [file, page.pageNumber, page.rotation]);

  return (
    <div className={`pdf-page-preview ${status}`}>
      <canvas aria-hidden="true" ref={canvasRef} />
      {status === "idle" ? <span>渲染中</span> : null}
      {status === "error" ? <span>预览失败</span> : null}
    </div>
  );
}

export function PdfPageGrid({ files, pages, onTogglePage }: PdfPageGridProps) {
  const fileMap = new Map(files.map((file) => [file.id, file]));
  const activePages = pages.filter((page) => !page.deleted);

  if (!activePages.length) {
    return (
      <div className="pdf-empty-grid">
        <strong>等待页面</strong>
        <span>上传 PDF 后可以选择页面、旋转、删除、排序和拆分。</span>
      </div>
    );
  }

  return (
    <div className="pdf-page-grid">
      {activePages.map((page, index) => (
        <button
          className={`pdf-page-card${page.selected ? " selected" : ""}`}
          key={page.id}
          onClick={() => onTogglePage(page.id)}
          type="button"
        >
          <PdfPagePreview file={fileMap.get(page.fileId)} page={page} />
          <span className="pdf-page-label">
            {index + 1}. {page.fileName} · 第 {page.pageNumber} 页
          </span>
          <span className="pdf-page-rotation">{page.rotation}°</span>
        </button>
      ))}
    </div>
  );
}
