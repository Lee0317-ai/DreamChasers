"use client";

type PdfUploaderProps = {
  disabled?: boolean;
  onFilesSelected: (files: File[]) => void;
};

export function PdfUploader({ disabled = false, onFilesSelected }: PdfUploaderProps) {
  return (
    <label className={`pdf-uploader${disabled ? " disabled" : ""}`}>
      <input
        accept="application/pdf,.pdf"
        disabled={disabled}
        multiple
        onChange={(event) => {
          onFilesSelected(Array.from(event.target.files ?? []));
          event.currentTarget.value = "";
        }}
        type="file"
      />
      <span className="pdf-uploader-icon">PDF</span>
      <span className="pdf-uploader-title">上传 PDF 文件</span>
      <span className="pdf-uploader-text">支持多文件合并，处理过程在浏览器内完成。</span>
    </label>
  );
}
