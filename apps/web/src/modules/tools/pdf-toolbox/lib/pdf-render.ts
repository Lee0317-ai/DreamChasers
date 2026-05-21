let workerConfigured = false;

async function loadPdfJs() {
  const pdfjs = await import("pdfjs-dist");

  if (!workerConfigured && typeof window !== "undefined") {
    pdfjs.GlobalWorkerOptions.workerSrc = new URL(
      "pdfjs-dist/build/pdf.worker.mjs",
      import.meta.url
    ).toString();
    workerConfigured = true;
  }

  return pdfjs;
}

export async function renderPdfPageToCanvas({
  data,
  pageNumber,
  canvas,
  rotation = 0,
  scale = 0.42
}: {
  data: ArrayBuffer;
  pageNumber: number;
  canvas: HTMLCanvasElement;
  rotation?: number;
  scale?: number;
}) {
  const pdfjs = await loadPdfJs();
  const loadingTask = pdfjs.getDocument({ data: data.slice(0) });
  const pdf = await loadingTask.promise;
  const page = await pdf.getPage(pageNumber);
  const viewport = page.getViewport({ rotation, scale });
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Canvas context is unavailable");
  }

  canvas.width = Math.ceil(viewport.width);
  canvas.height = Math.ceil(viewport.height);
  await page.render({ canvas, canvasContext: context, viewport }).promise;
  await pdf.destroy();
}
