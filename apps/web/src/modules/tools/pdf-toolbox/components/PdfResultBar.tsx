import type { PdfActionResult } from "../types";

type PdfResultBarProps = {
  error: string | null;
  result: PdfActionResult | null;
};

export function PdfResultBar({ error, result }: PdfResultBarProps) {
  if (!error && !result) {
    return null;
  }

  return (
    <div className={`pdf-result-bar${error ? " error" : ""}`}>
      {error ? (
        <span>{error}</span>
      ) : (
        <span>
          已生成 <strong>{result?.fileName}</strong>，下载已开始。
        </span>
      )}
    </div>
  );
}
