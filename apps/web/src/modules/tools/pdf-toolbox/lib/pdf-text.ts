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

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export async function extractPdfText(input: ArrayBuffer): Promise<string[]> {
  const pdfjs = await loadPdfJs();
  const loadingTask = pdfjs.getDocument({ data: input.slice(0) });
  const pdf = await loadingTask.promise;
  const pages: string[] = [];

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const textContent = await page.getTextContent();
    const text = textContent.items
      .map((item) => ("str" in item ? item.str : ""))
      .filter(Boolean)
      .join(" ");
    pages.push(text);
  }

  await pdf.destroy();
  return pages;
}

export function createWordHtmlDocument(title: string, pages: string[]) {
  const body = pages
    .map((pageText, index) => {
      const escapedText = escapeHtml(pageText || "[本页未抽取到文本，可能是扫描件或图片型 PDF。]");
      return `<h2>Page ${index + 1}</h2><p>${escapedText.replaceAll("\n", "<br>")}</p>`;
    })
    .join('<br style="page-break-after: always;">');

  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>${escapeHtml(title)}</title>
  <style>
    body { font-family: Arial, sans-serif; font-size: 12pt; line-height: 1.65; }
    h1, h2 { font-family: Arial, sans-serif; }
    p { white-space: normal; }
  </style>
</head>
<body>
  <h1>${escapeHtml(title)}</h1>
  ${body}
</body>
</html>`;
}
