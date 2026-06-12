type PdfActionPanelProps = {
  canActOnPages: boolean;
  canBuild: boolean;
  canMoveDown: boolean;
  canMoveUp: boolean;
  isBusy: boolean;
  selectedCount: number;
  watermarkText: string;
  coverPosition: string;
  onClear: () => void;
  onApplySignature: () => void;
  onApplyWatermark: () => void;
  onApplyCoverArea: () => void;
  onCoverPositionChange: (value: string) => void;
  onDeleteSelected: () => void;
  onDownloadCurrent: () => void;
  onGenerateAiSummary: () => void;
  onExportWord: () => void;
  onExtractSelected: () => void;
  onImagesSelected: (files: File[]) => void;
  onImagesToPdf: () => void;
  onMoveDown: () => void;
  onMoveUp: () => void;
  onRotateLeft: () => void;
  onRotateRight: () => void;
  onSelectAll: () => void;
  onSignatureSelected: (file: File | null) => void;
  onWatermarkTextChange: (value: string) => void;
};

export function PdfActionPanel({
  canActOnPages,
  canBuild,
  canMoveDown,
  canMoveUp,
  isBusy,
  selectedCount,
  watermarkText,
  coverPosition,
  onClear,
  onApplySignature,
  onApplyWatermark,
  onApplyCoverArea,
  onCoverPositionChange,
  onDeleteSelected,
  onDownloadCurrent,
  onGenerateAiSummary,
  onExportWord,
  onExtractSelected,
  onImagesSelected,
  onImagesToPdf,
  onMoveDown,
  onMoveUp,
  onRotateLeft,
  onRotateRight,
  onSelectAll,
  onSignatureSelected,
  onWatermarkTextChange
}: PdfActionPanelProps) {
  return (
    <aside className="pdf-action-panel" aria-label="PDF 操作">
      <div>
        <span className="pdf-panel-kicker">Actions</span>
        <h2>页面处理</h2>
        <p>当前选中 {selectedCount} 页。未选中时，下载会使用全部未删除页面。</p>
      </div>

      <div className="pdf-action-grid">
        <button disabled={!canBuild || isBusy} onClick={onSelectAll} type="button">
          全选页面
        </button>
        <button disabled={!canBuild || isBusy} onClick={onClear} type="button">
          清空
        </button>
        <button disabled={!canActOnPages || isBusy} onClick={onRotateLeft} type="button">
          左旋
        </button>
        <button disabled={!canActOnPages || isBusy} onClick={onRotateRight} type="button">
          右旋
        </button>
        <button disabled={!canMoveUp || isBusy} onClick={onMoveUp} type="button">
          上移
        </button>
        <button disabled={!canMoveDown || isBusy} onClick={onMoveDown} type="button">
          下移
        </button>
        <button disabled={!canActOnPages || isBusy} onClick={onDeleteSelected} type="button">
          删除选中
        </button>
        <button disabled={!canActOnPages || isBusy} onClick={onExtractSelected} type="button">
          拆分选中
        </button>
      </div>

      <button
        className="pdf-primary-action"
        disabled={!canBuild || isBusy}
        onClick={onDownloadCurrent}
        type="button"
      >
        {isBusy ? "处理中..." : "下载当前 PDF"}
      </button>

      <div className="pdf-extension-panel">
        <span className="pdf-panel-kicker">Watermark</span>
        <label>
          <span>文字水印</span>
          <input
            disabled={!canBuild || isBusy}
            onChange={(event) => onWatermarkTextChange(event.target.value)}
            placeholder="例如 DreamChasers"
            type="text"
            value={watermarkText}
          />
        </label>
        <button disabled={!canBuild || !watermarkText.trim() || isBusy} onClick={onApplyWatermark} type="button">
          添加文字水印
        </button>
      </div>

      <div className="pdf-extension-panel">
        <span className="pdf-panel-kicker">Signature</span>
        <label>
          <span>签名图片</span>
          <input
            accept="image/png,image/jpeg"
            disabled={!canBuild || isBusy}
            onChange={(event) => onSignatureSelected(event.target.files?.[0] ?? null)}
            type="file"
          />
        </label>
        <button disabled={!canBuild || isBusy} onClick={onApplySignature} type="button">
          添加签名
        </button>
      </div>

      <div className="pdf-extension-panel">
        <span className="pdf-panel-kicker">Cover Area</span>
        <p>用于遮盖自己 PDF 中不需要的水印、遮挡或局部元素，不用于移除他人版权标识。</p>
        <label>
          <span>遮盖位置</span>
          <select
            disabled={!canBuild || isBusy}
            onChange={(event) => onCoverPositionChange(event.target.value)}
            value={coverPosition}
          >
            <option value="top-right">右上角</option>
            <option value="top-left">左上角</option>
            <option value="bottom-right">右下角</option>
            <option value="bottom-left">左下角</option>
            <option value="center">中间</option>
          </select>
        </label>
        <button disabled={!canBuild || isBusy} onClick={onApplyCoverArea} type="button">
          遮盖区域
        </button>
      </div>

      <div className="pdf-extension-panel">
        <span className="pdf-panel-kicker">Scan to PDF</span>
        <p>上传拍照或扫描图片，按 A4 页面合成为 PDF。</p>
        <label>
          <span>图片文件</span>
          <input
            accept="image/png,image/jpeg"
            disabled={isBusy}
            multiple
            onChange={(event) => onImagesSelected(Array.from(event.target.files ?? []))}
            type="file"
          />
        </label>
        <button disabled={isBusy} onClick={onImagesToPdf} type="button">
          图片扫描成 PDF
        </button>
      </div>

      <div className="pdf-extension-panel">
        <span className="pdf-panel-kicker">AI Summary</span>
        <p>抽取当前 PDF 文本后生成简短摘要。扫描件和图片型 PDF 仍需要后续 OCR 能力。</p>
        <button disabled={!canBuild || isBusy} onClick={onGenerateAiSummary} type="button">
          生成 AI 摘要
        </button>
      </div>

      <div className="pdf-extension-panel">
        <span className="pdf-panel-kicker">Word Beta</span>
        <p>仅抽取普通文本 PDF。扫描件需要 OCR，后续归入 AI/OCR 能力。</p>
        <button disabled={!canBuild || isBusy} onClick={onExportWord} type="button">
          导出 Word Beta
        </button>
      </div>
    </aside>
  );
}
