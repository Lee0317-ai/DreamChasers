export type PdfSourceFile = {
  id: string;
  name: string;
  size: number;
  data: ArrayBuffer;
  pageCount: number;
};

export type PdfPageItem = {
  id: string;
  fileId: string;
  fileName: string;
  pageIndex: number;
  pageNumber: number;
  rotation: number;
  selected: boolean;
  deleted: boolean;
};

export type PdfActionResult = {
  fileName: string;
  bytes: Uint8Array;
  mimeType?: string;
};

export type PdfBuildPage = {
  fileId: string;
  pageIndex: number;
  rotation?: number;
};

export type PdfBuildSource = {
  id: string;
  data: ArrayBuffer | Uint8Array;
};

export type PdfWatermarkOptions = {
  text: string;
  opacity?: number;
};

export type PdfSignatureOptions = {
  imageBytes: ArrayBuffer | Uint8Array;
  imageType: "png" | "jpg";
};

export type PdfCoverAreaOptions = {
  position: "top-right" | "top-left" | "bottom-right" | "bottom-left" | "center";
  widthRatio?: number;
  heightRatio?: number;
};

export type ImageToPdfInput = {
  bytes: ArrayBuffer | Uint8Array;
  imageType: "png" | "jpg";
};
