import type { PdfSourceFile } from "../types";

type PdfFileListProps = {
  files: PdfSourceFile[];
  onRemoveFile: (fileId: string) => void;
};

function formatFileSize(size: number) {
  if (size < 1024 * 1024) {
    return `${Math.max(1, Math.round(size / 1024))} KB`;
  }
  return `${(size / 1024 / 1024).toFixed(1)} MB`;
}

export function PdfFileList({ files, onRemoveFile }: PdfFileListProps) {
  if (!files.length) {
    return (
      <div className="pdf-panel-empty">
        <strong>还没有文件</strong>
        <span>上传 PDF 后会显示文件、页数和大小。</span>
      </div>
    );
  }

  return (
    <div className="pdf-file-list">
      {files.map((file) => (
        <div className="pdf-file-row" key={file.id}>
          <div>
            <strong>{file.name}</strong>
            <span>
              {file.pageCount} 页 · {formatFileSize(file.size)}
            </span>
          </div>
          <button onClick={() => onRemoveFile(file.id)} type="button">
            移除
          </button>
        </div>
      ))}
    </div>
  );
}
