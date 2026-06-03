"use client";

/* eslint-disable @next/next/no-img-element -- Local blob previews cannot be handled by the Next image optimizer. */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  aiSuggestions,
  photoTools,
  toolGroups,
  type PhotoTool,
  type PhotoToolId
} from "@/lib/tools/photo/photo-editor-data";
import {
  photoStickerCategories,
  photoStickerGroups,
  photoStickerPresets,
  type PhotoStickerPreset
} from "@/lib/tools/photo/photo-stickers";
import { buildAppliedCropStyle, buildPhotoPreviewStyle } from "@/lib/tools/photo/preview-style";
import { getFilterTuning, photoFilters, type PhotoFilterId } from "@/lib/tools/photo/photo-filters";
import { photoBorderPresets, type PhotoBorderId, type PhotoBorderPreset } from "@/lib/tools/photo/photo-borders";
import styles from "./PhotoEditorWorkspace.module.css";
import { type CropRatio, type CropResizeHandle, useCropBox } from "./useCropBox";
import { useCanvasPan } from "./useCanvasPan";

type SliderState = {
  brightness: number;
  contrast: number;
  saturation: number;
  temperature: number;
  filterStrength: number;
  rotate: number;
  zoom: number;
  fontSize: number;
  opacity: number;
  borderWidth: number;
  radius: number;
  natural: number;
  detail: number;
};

const initialSliders: SliderState = {
  brightness: 0,
  contrast: 0,
  saturation: 0,
  temperature: 0,
  filterStrength: 0,
  rotate: 0,
  zoom: 100,
  fontSize: 32,
  opacity: 100,
  borderWidth: 0,
  radius: 0,
  natural: 80,
  detail: 90
};

const AI_UNAVAILABLE_MESSAGE = "AI 功能暂未开放，敬请期待！";
const cropRatios: CropRatio[] = ["自由", "1:1", "4:3", "16:9", "3:4", "9:16"];
const cropHandles: CropResizeHandle[] = ["nw", "n", "ne", "e", "se", "s", "sw", "w"];

type UploadedPhoto = {
  name: string;
  aspectRatio: string;
  file: File;
  sizeLabel: string;
  dimensions: string;
  objectUrl: string;
};

type TextElement = {
  color: string;
  content: string;
  fontFamily: string;
  fontSize: number;
  id: string;
  isBold: boolean;
  isItalic: boolean;
  opacity: number;
  rotation: number;
  x: number;
  y: number;
};

type TextOverlayStyle = React.CSSProperties & {
  "--text-overlay-x": string;
  "--text-overlay-y": string;
};

type TextOption = {
  label: string;
  value: string;
};

type StickerElement = {
  aspectRatio: number;
  id: string;
  name: string;
  rotation: number;
  size: number;
  src: string;
  x: number;
  y: number;
};

type StickerCategory = (typeof photoStickerCategories)[number];
type StickerCategoryList = readonly StickerCategory[];
type StickerGroup = (typeof photoStickerGroups)[number];
type StickerGroupList = readonly StickerGroup[];
type PhotoFrameStyle = React.CSSProperties & {
  "--photo-frame-color": string;
  "--photo-frame-radius": string;
  "--photo-frame-inner-radius": string;
  "--photo-frame-width": string;
  "--photo-frame-bottom-width": string;
};

type EditorSnapshot = {
  appliedCrop: ReturnType<typeof useCropBox>["rect"] | null;
  borderColor: string;
  pan: { x: number; y: number };
  photo: UploadedPhoto | null;
  selectedBorderId: PhotoBorderId;
  selectedFilterId: PhotoFilterId;
  selectedStickerId: string | null;
  selectedTextId: string | null;
  sliders: SliderState;
  stickerElements: StickerElement[];
  textBold: boolean;
  textColor: string;
  textDraft: string;
  textElements: TextElement[];
  textFont: string;
  textItalic: boolean;
};

type ExportState = {
  appliedCrop: ReturnType<typeof useCropBox>["rect"] | null;
  borderColor: string;
  pan: { x: number; y: number };
  selectedBorderId: PhotoBorderId;
  selectedFilterId: PhotoFilterId;
  sliders: SliderState;
  stickerElements: StickerElement[];
  textElements: TextElement[];
};

type ToolParameterProps = {
  activeTool: PhotoTool;
  borderColor: string;
  cropRatio: CropRatio;
  onAddSticker: (preset: PhotoStickerPreset) => void;
  onAddText: () => void;
  onApplyCrop: () => void;
  onBorderColorChange: (color: string) => void;
  onCropRatioChange: (ratio: CropRatio) => void;
  onDeleteSelectedText: () => void;
  onResetCrop: () => void;
  onRunBeauty: () => void;
  onSelectBorder: (preset: PhotoBorderPreset) => void;
  onSelectFilter: (filterId: PhotoFilterId) => void;
  onTextBoldChange: (isBold: boolean) => void;
  onTextColorChange: (color: string) => void;
  onTextContentChange: (content: string) => void;
  onTextFontChange: (fontFamily: string) => void;
  onTextItalicChange: (isItalic: boolean) => void;
  onUploadCustomSticker: () => void;
  selectedBorderId: PhotoBorderId;
  selectedFilterId: PhotoFilterId;
  selectedSticker: StickerElement | null;
  selectedText: TextElement | null;
  beautyError: string | null;
  beautyStatusMessage: string | null;
  isBeautyRunning: boolean;
  sliders: SliderState;
  stickerCategories: StickerCategoryList;
  stickerPresets: PhotoStickerPreset[];
  textBold: boolean;
  textColor: string;
  textFont: string;
  textItalic: boolean;
  textValue: string;
  updateSlider: (key: keyof SliderState, value: number) => void;
};

const rainbowTextColor = "rainbow-gradient";
const rainbowTextGradient = "linear-gradient(90deg, #ef4444, #f97316, #facc15, #22c55e, #06b6d4, #2563eb, #9333ea)";
const defaultStickerSize = 36;
const minStickerSize = 32;
const maxStickerSize = 180;
const customStickerAccept = "image/png,image/jpeg,image/webp,image/svg+xml";
const photoFileInputId = "photo-editor-file-input";
const customStickerInputId = "photo-editor-custom-sticker-input";

const textColors: TextOption[] = [
  { label: "黑", value: "#111111" },
  { label: "白", value: "#ffffff" },
  { label: "赤", value: "#dc2626" },
  { label: "橙", value: "#f97316" },
  { label: "黄", value: "#facc15" },
  { label: "绿", value: "#16a34a" },
  { label: "青", value: "#06b6d4" },
  { label: "蓝", value: "#2563eb" },
  { label: "紫", value: "#9333ea" },
  { label: "五颜六色", value: rainbowTextColor }
];

const textFonts: TextOption[] = [
  { label: "默认", value: "var(--font-display)" },
  { label: "黑体", value: "SimHei, Microsoft YaHei, PingFang SC, sans-serif" },
  { label: "宋体", value: "SimSun, Songti SC, serif" },
  { label: "楷体", value: "KaiTi, Kaiti SC, serif" },
  { label: "草书", value: "\"Kaiti SC\", \"STKaiti\", \"KouzanBrushFontKanji\", cursive" },
  { label: "圆体", value: "Yuanti SC, Microsoft YaHei, PingFang SC, sans-serif" },
  { label: "等宽", value: "SFMono-Regular, Consolas, Liberation Mono, monospace" },
  { label: "衬线", value: "Georgia, Times New Roman, serif" }
];

const defaultTextContent = "DreamChasers";
const defaultBorderColor = "#ffffff";
const defaultPolaroidColor = "#fffaf0";
const maxHistorySize = 50;
const beautyPollingIntervalMs = 2000;
const aiDrawingLoaderSrc = "/images/photo-editor/ai-drawing-loader.webp";

type BeautyTaskResponse = {
  error?: string;
  message?: string;
  status?: "queued" | "processing" | "succeeded" | "failed";
  taskId?: string;
};

export function PhotoEditorWorkspace() {
  const [activeToolId, setActiveToolId] = useState<PhotoToolId | null>("adjust");
  const [sliders, setSliders] = useState<SliderState>(initialSliders);
  const [aiCollapsed] = useState(true);
  const [appliedCrop, setAppliedCrop] = useState<ReturnType<typeof useCropBox>["rect"] | null>(null);
  const [isOriginalCompare, setIsOriginalCompare] = useState(false);
  const [selectedFilterId, setSelectedFilterId] = useState<PhotoFilterId>("natural");
  const [selectedBorderId, setSelectedBorderId] = useState<PhotoBorderId>("none");
  const [borderColor, setBorderColor] = useState(defaultBorderColor);
  const [photo, setPhoto] = useState<UploadedPhoto | null>(null);
  const [isBeautyRunning, setIsBeautyRunning] = useState(false);
  const [beautyError, setBeautyError] = useState<string | null>(null);
  const [beautyStatusMessage, setBeautyStatusMessage] = useState<string | null>(null);
  const [textDraft, setTextDraft] = useState(defaultTextContent);
  const [textElements, setTextElements] = useState<TextElement[]>([]);
  const [selectedTextId, setSelectedTextId] = useState<string | null>(null);
  const [textColor, setTextColor] = useState(textColors[0].value);
  const [textFont, setTextFont] = useState(textFonts[0].value);
  const [textBold, setTextBold] = useState(false);
  const [textItalic, setTextItalic] = useState(false);
  const [stickerElements, setStickerElements] = useState<StickerElement[]>([]);
  const [selectedStickerId, setSelectedStickerId] = useState<string | null>(null);
  const [undoStack, setUndoStack] = useState<EditorSnapshot[]>([]);
  const [redoStack, setRedoStack] = useState<EditorSnapshot[]>([]);
  const customStickerUrlsRef = useRef<string[]>([]);
  const photoObjectUrlsRef = useRef<string[]>([]);
  const photoCanvasRef = useRef<HTMLDivElement>(null);
  const { isDragging, pan, panHandlers, resetPan, setCanvasPan } = useCanvasPan();
  const cropBox = useCropBox();

  useEffect(() => {
    return () => {
      customStickerUrlsRef.current.forEach((objectUrl) => URL.revokeObjectURL(objectUrl));
      customStickerUrlsRef.current = [];
      photoObjectUrlsRef.current.forEach((objectUrl) => URL.revokeObjectURL(objectUrl));
      photoObjectUrlsRef.current = [];
    };
  }, []);

  const activeTool = useMemo(
    () => photoTools.find((tool) => tool.id === activeToolId) ?? null,
    [activeToolId]
  );

  const applyCrop = () => {
    setAppliedCrop(cropBox.rect);
  };

  const changeCropRatio = (ratio: CropRatio) => {
    cropBox.setRatio(ratio);
  };

  const resetCrop = () => {
    setAppliedCrop(null);
    cropBox.reset();
    setSliders((current) => ({ ...current, rotate: 0 }));
  };

  const addSticker = (preset: PhotoStickerPreset) => {
    const id = `sticker-${Date.now()}`;
    setStickerElements((current) => [
      ...current,
      {
        aspectRatio: 1,
        id,
        name: preset.name,
        rotation: 0,
        size: defaultStickerSize,
        src: preset.src,
        x: 50,
        y: 50
      }
    ]);
    setSelectedStickerId(id);
  };

  const selectFilter = (filterId: PhotoFilterId) => {
    setSelectedFilterId(filterId);
  };

  const addText = () => {
    const content = textDraft.trim();

    if (!content) {
      return;
    }
    const id = `text-${Date.now()}`;
    setTextElements((current) => [
      ...current,
      {
        color: textColor,
        content,
        fontFamily: textFont,
        fontSize: sliders.fontSize,
        id,
        isBold: textBold,
        isItalic: textItalic,
        opacity: sliders.opacity,
        rotation: 0,
        x: 50,
        y: 50
      }
    ]);
    setSelectedTextId(id);
  };

  const deleteSelectedText = () => {
    if (!selectedTextId) {
      return;
    }
    setTextElements((current) => current.filter((element) => element.id !== selectedTextId));
    setSelectedTextId(null);
  };

  const changeTextColor = (color: string) => {
    setTextColor(color);
    if (selectedTextId) {
      setTextElements((current) =>
        current.map((element) => (element.id === selectedTextId ? { ...element, color } : element))
      );
    }
  };

  const changeTextBold = (isBold: boolean) => {
    setTextBold(isBold);
    if (selectedTextId) {
      setTextElements((current) =>
        current.map((element) => (element.id === selectedTextId ? { ...element, isBold } : element))
      );
    }
  };

  const changeTextFont = (fontFamily: string) => {
    setTextFont(fontFamily);
    if (selectedTextId) {
      setTextElements((current) =>
        current.map((element) => (element.id === selectedTextId ? { ...element, fontFamily } : element))
      );
    }
  };

  const changeTextItalic = (isItalic: boolean) => {
    setTextItalic(isItalic);
    if (selectedTextId) {
      setTextElements((current) =>
        current.map((element) => (element.id === selectedTextId ? { ...element, isItalic } : element))
      );
    }
  };

  const changeTextContent = (content: string) => {
    setTextDraft(content);
    if (selectedTextId) {
      setTextElements((current) =>
        current.map((element) => (element.id === selectedTextId ? { ...element, content } : element))
      );
    }
  };

  const createSnapshot = (): EditorSnapshot => ({
    appliedCrop,
    borderColor,
    pan,
    photo,
    selectedBorderId,
    selectedFilterId,
    selectedStickerId,
    selectedTextId,
    sliders,
    stickerElements,
    textBold,
    textColor,
    textDraft,
    textElements,
    textFont,
    textItalic
  });

  const restoreSnapshot = (snapshot: EditorSnapshot) => {
    setAppliedCrop(snapshot.appliedCrop);
    setBorderColor(snapshot.borderColor);
    setCanvasPan(snapshot.pan);
    setPhoto(snapshot.photo);
    setSelectedBorderId(snapshot.selectedBorderId);
    setSelectedFilterId(snapshot.selectedFilterId);
    setSelectedStickerId(snapshot.selectedStickerId);
    setSelectedTextId(snapshot.selectedTextId);
    setSliders(snapshot.sliders);
    setStickerElements(snapshot.stickerElements);
    setTextBold(snapshot.textBold);
    setTextColor(snapshot.textColor);
    setTextDraft(snapshot.textDraft);
    setTextElements(snapshot.textElements);
    setTextFont(snapshot.textFont);
    setTextItalic(snapshot.textItalic);
  };

  const commitHistory = () => {
    setUndoStack((current) => [...current.slice(-maxHistorySize + 1), createSnapshot()]);
    setRedoStack([]);
  };

  const handleUndo = () => {
    const snapshot = undoStack.at(-1);

    if (!snapshot) {
      return;
    }

    setRedoStack((current) => [...current.slice(-maxHistorySize + 1), createSnapshot()]);
    setUndoStack((current) => current.slice(0, -1));
    restoreSnapshot(snapshot);
  };

  const handleRedo = () => {
    const snapshot = redoStack.at(-1);

    if (!snapshot) {
      return;
    }

    setUndoStack((current) => [...current.slice(-maxHistorySize + 1), createSnapshot()]);
    setRedoStack((current) => current.slice(0, -1));
    restoreSnapshot(snapshot);
  };

  const handleExportImage = async () => {
    if (!photo || !photoCanvasRef.current) {
      return;
    }

    try {
      await exportPreviewElement(photoCanvasRef.current, photo.name, {
        appliedCrop,
        borderColor,
        selectedBorderId,
        selectedFilterId,
        sliders,
        textElements,
        stickerElements,
        pan
      });
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "导出失败，请稍后再试。");
    }
  };

  const updateSlider = (key: keyof SliderState, value: number) => {
    commitHistory();
    setSliders((current) => ({ ...current, [key]: value }));

    if ((key === "fontSize" || key === "opacity") && selectedTextId) {
      setTextElements((current) =>
        current.map((element) => (element.id === selectedTextId ? { ...element, [key]: value } : element))
      );
    }
  };

  const handleSelectBorder = (preset: PhotoBorderPreset) => {
    commitHistory();
    setSelectedBorderId(preset.id);
    setBorderColor(preset.id === "polaroid" ? defaultPolaroidColor : preset.color === "transparent" ? defaultBorderColor : preset.color);
    setSliders((current) => ({
      ...current,
      borderWidth: preset.width,
      radius: preset.radius
    }));
  };

  const openFilePicker = useCallback(() => {
    document.getElementById(photoFileInputId)?.click();
  }, []);

  const openCustomStickerPicker = useCallback(() => {
    document.getElementById(customStickerInputId)?.click();
  }, []);

  const clearCustomStickers = () => {
    customStickerUrlsRef.current.forEach((objectUrl) => URL.revokeObjectURL(objectUrl));
    customStickerUrlsRef.current = [];
  };

  const clearPhotoObjectUrls = () => {
    photoObjectUrlsRef.current.forEach((objectUrl) => URL.revokeObjectURL(objectUrl));
    photoObjectUrlsRef.current = [];
  };

  const handleSelectTool = (tool: PhotoToolId) => {
    if (photoTools.find((item) => item.id === tool)?.group === "ai" && tool !== "beauty") {
      notifyAiUnavailable();
      return;
    }

    setActiveToolId((current) => (current === tool ? null : tool));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file || !file.type.startsWith("image/")) {
      event.target.value = "";
      return;
    }

    void createUploadedPhoto(file).then((uploadedPhoto) => {
      clearPhotoObjectUrls();
      photoObjectUrlsRef.current.push(uploadedPhoto.objectUrl);
      setUndoStack([]);
      setRedoStack([]);
      setPhoto(uploadedPhoto);
      setBeautyError(null);
      setBeautyStatusMessage(null);
      resetPan();
      setAppliedCrop(null);
      setIsOriginalCompare(false);
      setSelectedFilterId("natural");
      setSelectedTextId(null);
      setTextElements([]);
      setTextDraft(defaultTextContent);
      setTextColor(textColors[0].value);
      setTextFont(textFonts[0].value);
      setTextBold(false);
      setTextItalic(false);
      clearCustomStickers();
      setStickerElements([]);
      setSelectedStickerId(null);
      setSliders(initialSliders);
      cropBox.reset();
    })
      .catch(() => {
        window.alert("图片加载失败，请重新选择。");
      });
    event.target.value = "";
  };

  const handleRunBeauty = async () => {
    if (!photo || isBeautyRunning) {
      return;
    }

    setIsBeautyRunning(true);
    setBeautyError(null);

    try {
      const formData = new FormData();
      formData.set("image", photo.file, photo.file.name || photo.name);
      formData.set("beautyType", "natural_portrait");

      const response = await fetch("/api/tools/photo/beauty", {
        body: formData,
        method: "POST"
      });

      const task = (await response.json()) as BeautyTaskResponse;

      if (!response.ok || !task.taskId) {
        throw new Error(task.error || "AI 美颜任务创建失败，请稍后再试。");
      }

      setBeautyStatusMessage(task.message || "AI 美颜任务已提交。");
      const completedTask = await waitForBeautyTask(task.taskId, setBeautyStatusMessage);

      if (completedTask.status === "failed") {
        throw new Error(completedTask.error || "AI 美颜生成失败，请稍后再试。");
      }

      const resultResponse = await fetch(`/api/tools/photo/beauty/tasks/${task.taskId}/result`, {
        method: "GET"
      });

      if (!resultResponse.ok) {
        throw new Error(await readBeautyError(resultResponse));
      }

      const resultBlob = await resultResponse.blob();
      const resultFile = new File([resultBlob], `${photo.name.replace(/\.[^.]+$/, "") || "portrait"}-beauty.png`, {
        type: resultBlob.type || "image/png"
      });
      const uploadedPhoto = await createUploadedPhoto(resultFile);
      photoObjectUrlsRef.current.push(uploadedPhoto.objectUrl);
      commitHistory();
      setPhoto(uploadedPhoto);
      resetPan();
      setAppliedCrop(null);
      setIsOriginalCompare(false);
      setSelectedFilterId("natural");
      setSliders((current) => ({
        ...current,
        brightness: 0,
        contrast: 0,
        filterStrength: 0,
        rotate: 0,
        saturation: 0,
        temperature: 0,
        zoom: 100
      }));
      cropBox.reset();
    } catch (error) {
      setBeautyError(error instanceof Error ? error.message : "AI 美颜生成失败，请稍后再试。");
    } finally {
      setIsBeautyRunning(false);
      setBeautyStatusMessage(null);
    }
  };

  const handleCustomStickerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file || !file.type.startsWith("image/")) {
      event.target.value = "";
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    event.target.value = "";

    const addCustomSticker = (aspectRatio: number) => {
      customStickerUrlsRef.current.push(objectUrl);
      const id = `custom-sticker-${Date.now()}`;
      setStickerElements((current) => [
        ...current,
        {
          aspectRatio,
          id,
          name: file.name.replace(/\.[^.]+$/, "") || "自定义贴纸",
          rotation: 0,
          size: defaultStickerSize,
          src: objectUrl,
          x: 50,
          y: 50
        }
      ]);
      setSelectedStickerId(id);
    };

    if (file.type === "image/svg+xml") {
      addCustomSticker(1);
      return;
    }

    const image = new Image();
    image.onload = () => {
      addCustomSticker(image.naturalWidth && image.naturalHeight ? image.naturalWidth / image.naturalHeight : 1);
    };
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
    };
    image.src = objectUrl;
  };

  return (
    <div className={`${styles.page} ${!activeTool ? styles.paramsCollapsed : ""} ${aiCollapsed ? styles.aiCollapsed : ""}`}>
      <input
        accept="image/*"
        className={styles.fileInput}
        id={photoFileInputId}
        onChange={handleFileChange}
        type="file"
      />
      <input
        accept={customStickerAccept}
        className={styles.fileInput}
        id={customStickerInputId}
        onChange={handleCustomStickerChange}
        type="file"
      />
      <div className={styles.workspace} onClick={() => setSelectedTextId(null)}>
        <TopBar
          canRedo={redoStack.length > 0}
          canUndo={undoStack.length > 0}
          onRedo={handleRedo}
          onExport={() => {
            void handleExportImage();
          }}
          onUndo={handleUndo}
          photo={photo}
        />
        <ToolRail
          activeToolId={activeToolId}
          beautyError={beautyError}
          beautyStatusMessage={beautyStatusMessage}
          borderColor={borderColor}
          cropRatio={cropBox.ratio}
          isBeautyRunning={isBeautyRunning}
          onAddSticker={addSticker}
          onAddText={addText}
          onApplyCrop={applyCrop}
          onBorderColorChange={setBorderColor}
          onCropRatioChange={changeCropRatio}
          onDeleteSelectedText={deleteSelectedText}
          onResetCrop={resetCrop}
          onRunBeauty={handleRunBeauty}
          onSelectBorder={handleSelectBorder}
          onSelectFilter={selectFilter}
          onSelectTool={handleSelectTool}
          onTextBoldChange={changeTextBold}
          onTextColorChange={changeTextColor}
          onTextContentChange={changeTextContent}
          onTextFontChange={changeTextFont}
          onTextItalicChange={changeTextItalic}
          onUploadClick={openFilePicker}
          onUploadCustomSticker={openCustomStickerPicker}
          photo={photo}
          selectedBorderId={selectedBorderId}
          selectedFilterId={selectedFilterId}
          selectedSticker={stickerElements.find((element) => element.id === selectedStickerId) ?? null}
          selectedText={textElements.find((element) => element.id === selectedTextId) ?? null}
          sliders={sliders}
          textBold={textBold}
          textColor={textColor}
          textFont={textFont}
          textItalic={textItalic}
          textValue={textElements.find((element) => element.id === selectedTextId)?.content ?? textDraft}
          updateSlider={updateSlider}
        />
        {activeTool ? (
          <ParameterPanel
            activeTool={activeTool}
            beautyError={beautyError}
            beautyStatusMessage={beautyStatusMessage}
            borderColor={borderColor}
            cropRatio={cropBox.ratio}
            isBeautyRunning={isBeautyRunning}
            onAddSticker={addSticker}
            onAddText={addText}
            onApplyCrop={applyCrop}
            onBorderColorChange={setBorderColor}
            onCropRatioChange={changeCropRatio}
            onDeleteSelectedText={deleteSelectedText}
            onResetCrop={resetCrop}
            onRunBeauty={handleRunBeauty}
            onSelectBorder={handleSelectBorder}
            onSelectFilter={selectFilter}
            onTextBoldChange={changeTextBold}
            onTextColorChange={changeTextColor}
            onTextContentChange={changeTextContent}
            onTextFontChange={changeTextFont}
            onTextItalicChange={changeTextItalic}
            onUploadCustomSticker={openCustomStickerPicker}
            selectedBorderId={selectedBorderId}
            selectedFilterId={selectedFilterId}
            selectedSticker={stickerElements.find((element) => element.id === selectedStickerId) ?? null}
            selectedText={textElements.find((element) => element.id === selectedTextId) ?? null}
            sliders={sliders}
            stickerCategories={photoStickerCategories}
            stickerPresets={photoStickerPresets}
            textBold={textBold}
            textColor={textColor}
            textFont={textFont}
            textItalic={textItalic}
            textValue={textElements.find((element) => element.id === selectedTextId)?.content ?? textDraft}
            updateSlider={updateSlider}
            onPointerDown={(event) => {
              if (activeTool.id === "text") {
                event.stopPropagation();
              }
            }}
            onClick={(event) => {
              if (activeTool.id === "text") {
                event.stopPropagation();
              }
            }}
          />
        ) : null}
        <Stage
          activeTool={activeTool}
          appliedCrop={appliedCrop}
          beautyStatusMessage={beautyStatusMessage}
          cropBox={cropBox}
          cropRatio={cropBox.ratio}
          isBeautyRunning={isBeautyRunning}
          isOriginalCompare={isOriginalCompare}
          isDragging={isDragging}
          onToggleOriginalCompare={() => setIsOriginalCompare((current) => !current)}
          onUploadClick={openFilePicker}
          pan={pan}
          panHandlers={panHandlers}
          photo={photo}
          photoCanvasRef={photoCanvasRef}
          selectedStickerId={selectedStickerId}
          selectedTextId={selectedTextId}
          selectedFilterId={selectedFilterId}
          selectedBorderId={selectedBorderId}
          borderColor={borderColor}
          sliders={sliders}
          stickerElements={stickerElements}
          textElements={textElements}
          onDeleteStickerElement={(id) => {
            setStickerElements((current) => current.filter((element) => element.id !== id));
            setSelectedStickerId((current) => (current === id ? null : current));
          }}
          onDeleteTextElement={(id) => {
            setTextElements((current) => current.filter((element) => element.id !== id));
            setSelectedTextId((current) => (current === id ? null : current));
          }}
          onDeselectStickerElement={() => setSelectedStickerId(null)}
          onDeselectTextElement={() => setSelectedTextId(null)}
          onMoveStickerElement={(id, position) => {
            setStickerElements((current) =>
              current.map((element) => (element.id === id ? { ...element, ...position } : element))
            );
          }}
          onResizeStickerElement={(id, size) => {
            setStickerElements((current) =>
              current.map((element) => (element.id === id ? { ...element, size } : element))
            );
          }}
          onRotateStickerElement={(id, rotation) => {
            setStickerElements((current) =>
              current.map((element) => (element.id === id ? { ...element, rotation } : element))
            );
          }}
          onMoveTextElement={(id, position) => {
            setTextElements((current) =>
              current.map((element) => (element.id === id ? { ...element, ...position } : element))
            );
          }}
          onSelectStickerElement={(element) => {
            setSelectedStickerId(element.id);
          }}
          onRotateTextElement={(id, rotation) => {
            setTextElements((current) =>
              current.map((element) => (element.id === id ? { ...element, rotation } : element))
            );
          }}
          onSelectTextElement={(element) => {
            setSelectedTextId(element.id);
            setTextDraft(element.content);
            setTextColor(element.color);
            setTextFont(element.fontFamily);
            setTextBold(element.isBold);
            setTextItalic(element.isItalic);
            setSliders((current) => ({
              ...current,
              fontSize: element.fontSize,
              opacity: element.opacity
            }));
          }}
        />
      </div>

      {aiCollapsed ? (
        <button
          className={`${styles.floatingAiButton} ${styles.aiUnavailable}`}
          onClick={notifyAiUnavailable}
          title={AI_UNAVAILABLE_MESSAGE}
          type="button"
        >
          <span className={styles.floatingAiMark}>AI</span>
          <span className={styles.floatingAiQuota}>0</span>
        </button>
      ) : null}
    </div>
  );
}

function notifyAiUnavailable() {
  window.alert(AI_UNAVAILABLE_MESSAGE);
}

function formatFileSize(size: number) {
  if (size < 1024 * 1024) {
    return `${Math.max(1, Math.round(size / 1024))} KB`;
  }

  return `${(size / 1024 / 1024).toFixed(1)} MB`;
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("图片加载失败，无法导出。"));
    image.src = src;
  });
}

function createUploadedPhoto(file: File) {
  const objectUrl = URL.createObjectURL(file);

  return new Promise<UploadedPhoto>((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      resolve({
        name: file.name,
        aspectRatio: `${image.naturalWidth} / ${image.naturalHeight}`,
        dimensions: `${image.naturalWidth} x ${image.naturalHeight}`,
        file,
        objectUrl,
        sizeLabel: formatFileSize(file.size)
      });
    };
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("图片加载失败。"));
    };
    image.src = objectUrl;
  });
}

async function readBeautyError(response: Response) {
  try {
    const payload = (await response.json()) as unknown;

    if (payload && typeof payload === "object" && "error" in payload && typeof payload.error === "string") {
      return payload.error;
    }
  } catch {
    return "AI 美颜生成失败，请稍后再试。";
  }

  return "AI 美颜生成失败，请稍后再试。";
}

async function waitForBeautyTask(taskId: string, onStatus: (message: string) => void) {
  while (true) {
    await delay(beautyPollingIntervalMs);

    const response = await fetch(`/api/tools/photo/beauty/tasks/${taskId}`, {
      method: "GET"
    });
    const task = (await response.json()) as BeautyTaskResponse;

    if (!response.ok) {
      throw new Error(task.error || "AI 美颜任务查询失败，请稍后再试。");
    }

    if (task.message) {
      onStatus(task.message);
    }

    if (task.status === "succeeded" || task.status === "failed") {
      return task;
    }
  }
}

function delay(milliseconds: number) {
  return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
}

function drawRoundedRect(context: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) {
  const safeRadius = Math.min(Math.max(radius, 0), width / 2, height / 2);

  context.beginPath();
  context.moveTo(x + safeRadius, y);
  context.lineTo(x + width - safeRadius, y);
  context.quadraticCurveTo(x + width, y, x + width, y + safeRadius);
  context.lineTo(x + width, y + height - safeRadius);
  context.quadraticCurveTo(x + width, y + height, x + width - safeRadius, y + height);
  context.lineTo(x + safeRadius, y + height);
  context.quadraticCurveTo(x, y + height, x, y + height - safeRadius);
  context.lineTo(x, y + safeRadius);
  context.quadraticCurveTo(x, y, x + safeRadius, y);
  context.closePath();
}

function drawPreviewImage(context: CanvasRenderingContext2D, image: HTMLImageElement, state: ExportState, width: number, height: number) {
  const imageRatio = image.naturalWidth / image.naturalHeight;
  const targetRatio = width / height;
  let drawWidth = width;
  let drawHeight = height;

  if (imageRatio > targetRatio) {
    drawHeight = width / imageRatio;
  } else {
    drawWidth = height * imageRatio;
  }

  if (state.appliedCrop) {
    const sourceX = (state.appliedCrop.left / 100) * image.naturalWidth;
    const sourceY = (state.appliedCrop.top / 100) * image.naturalHeight;
    const sourceWidth = (state.appliedCrop.width / 100) * image.naturalWidth;
    const sourceHeight = (state.appliedCrop.height / 100) * image.naturalHeight;
    const sourceRatio = sourceWidth / sourceHeight;

    drawWidth = width;
    drawHeight = height;

    if (sourceRatio > targetRatio) {
      drawHeight = width / sourceRatio;
    } else {
      drawWidth = height * sourceRatio;
    }

    context.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
    return;
  }

  context.drawImage(image, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
}

function clampColor(value: number) {
  return Math.min(255, Math.max(0, Math.round(value)));
}

function applyBrightness(red: number, green: number, blue: number, amount: number) {
  return {
    blue: blue * amount,
    green: green * amount,
    red: red * amount
  };
}

function applyContrast(red: number, green: number, blue: number, amount: number) {
  return {
    blue: (blue - 128) * amount + 128,
    green: (green - 128) * amount + 128,
    red: (red - 128) * amount + 128
  };
}

function applySaturation(red: number, green: number, blue: number, amount: number) {
  const gray = red * 0.2126 + green * 0.7152 + blue * 0.0722;

  return {
    blue: gray + (blue - gray) * amount,
    green: gray + (green - gray) * amount,
    red: gray + (red - gray) * amount
  };
}

function applySepia(red: number, green: number, blue: number, amount: number) {
  if (amount === 0) {
    return { blue, green, red };
  }

  const sepiaRed = red * 0.393 + green * 0.769 + blue * 0.189;
  const sepiaGreen = red * 0.349 + green * 0.686 + blue * 0.168;
  const sepiaBlue = red * 0.272 + green * 0.534 + blue * 0.131;

  return {
    blue: blue + (sepiaBlue - blue) * amount,
    green: green + (sepiaGreen - green) * amount,
    red: red + (sepiaRed - red) * amount
  };
}

function applyHueRotate(red: number, green: number, blue: number, angle: number) {
  if (angle === 0) {
    return { blue, green, red };
  }

  const radians = (angle * Math.PI) / 180;
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);

  return {
    blue: red * (0.072 - 0.072 * cos + 0.928 * sin) + green * (0.715 - 0.715 * cos - 0.715 * sin) + blue * (0.213 + 0.787 * cos - 0.213 * sin),
    green: red * (0.072 - 0.072 * cos - 0.283 * sin) + green * (0.715 + 0.285 * cos + 0.14 * sin) + blue * (0.213 - 0.213 * cos + 0.143 * sin),
    red: red * (0.213 + 0.787 * cos - 0.213 * sin) + green * (0.715 - 0.715 * cos - 0.715 * sin) + blue * (0.072 - 0.072 * cos + 0.928 * sin)
  };
}

function applyExportColorEffects(context: CanvasRenderingContext2D, state: ExportState, width: number, height: number) {
  const filterTuning = getFilterTuning(state.selectedFilterId, state.sliders.filterStrength);
  const brightness = (100 + state.sliders.brightness) / 100;
  const contrast = (100 + state.sliders.contrast) / 100;
  const saturation = (100 + state.sliders.saturation) / 100;
  const filterBrightness = filterTuning.brightness / 100;
  const filterContrast = filterTuning.contrast / 100;
  const filterSaturation = filterTuning.saturate / 100;
  const temperatureSepia = Math.abs(state.sliders.temperature) * 0.18;
  const temperatureHueRotate = state.sliders.temperature > 0 ? -8 : state.sliders.temperature < 0 ? 8 : 0;
  const filterSepia = filterTuning.sepia / 100;
  const filterHueRotate = filterTuning.hueRotate;

  if (
    brightness === 1 &&
    contrast === 1 &&
    saturation === 1 &&
    temperatureSepia === 0 &&
    temperatureHueRotate === 0 &&
    filterBrightness === 1 &&
    filterContrast === 1 &&
    filterSaturation === 1 &&
    filterSepia === 0 &&
    filterHueRotate === 0
  ) {
    return;
  }

  const imageData = context.getImageData(0, 0, width, height);
  const { data } = imageData;

  for (let index = 0; index < data.length; index += 4) {
    if (data[index + 3] === 0) {
      continue;
    }

    let red = data[index];
    let green = data[index + 1];
    let blue = data[index + 2];
    let next = applyBrightness(red, green, blue, brightness);
    next = applyContrast(next.red, next.green, next.blue, contrast);
    next = applySaturation(next.red, next.green, next.blue, saturation);
    next = applySepia(next.red, next.green, next.blue, temperatureSepia / 100);
    next = applyHueRotate(next.red, next.green, next.blue, temperatureHueRotate);
    next = applyBrightness(next.red, next.green, next.blue, filterBrightness);
    next = applyContrast(next.red, next.green, next.blue, filterContrast);
    next = applySaturation(next.red, next.green, next.blue, filterSaturation);
    next = applySepia(next.red, next.green, next.blue, filterSepia);
    next = applyHueRotate(next.red, next.green, next.blue, filterHueRotate);
    red = next.red;
    green = next.green;
    blue = next.blue;

    data[index] = clampColor(red);
    data[index + 1] = clampColor(green);
    data[index + 2] = clampColor(blue);
  }

  context.putImageData(imageData, 0, 0);
}

async function exportPreviewElement(element: HTMLElement, fileName: string, state: ExportState) {
  const rect = element.getBoundingClientRect();
  const exportScale = Math.min(3, Math.max(1, 1800 / Math.max(rect.width, rect.height)));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(rect.width * exportScale);
  canvas.height = Math.round(rect.height * exportScale);
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("当前浏览器不支持图片导出。");
  }

  const frameRadius = state.sliders.radius * exportScale;
  const photoImage = element.querySelector<HTMLImageElement>(`.${styles.photoPreview}`);
  const imageFrame = element.querySelector<HTMLElement>(`.${styles.photoImageFrame}`);

  if (!photoImage || !imageFrame) {
    throw new Error("没有找到可导出的图片内容。");
  }

  const image = await loadImage(photoImage.src);
  const activeBorder = photoBorderPresets.find((preset) => preset.id === state.selectedBorderId) ?? photoBorderPresets[0];
  context.fillStyle = activeBorder.id === "none" ? "#ffffff" : state.borderColor;
  drawRoundedRect(context, 0, 0, canvas.width, canvas.height, frameRadius);
  context.fill();

  const frameRect = imageFrame.getBoundingClientRect();
  const imageRect = {
    height: frameRect.height * exportScale,
    width: frameRect.width * exportScale,
    x: (frameRect.left - rect.left) * exportScale,
    y: (frameRect.top - rect.top) * exportScale
  };

  context.save();
  drawRoundedRect(context, imageRect.x, imageRect.y, imageRect.width, imageRect.height, Math.max(frameRadius - state.sliders.borderWidth * exportScale, 0));
  context.clip();
  context.translate(imageRect.x + imageRect.width / 2 + state.pan.x * exportScale, imageRect.y + imageRect.height / 2 + state.pan.y * exportScale);
  context.scale(state.sliders.zoom / 100, state.sliders.zoom / 100);
  context.rotate((state.sliders.rotate * Math.PI) / 180);
  drawPreviewImage(context, image, state, imageRect.width, imageRect.height);
  context.restore();

  for (const text of state.textElements) {
    context.save();
    context.globalAlpha = text.opacity / 100;
    context.translate((text.x / 100) * canvas.width, (text.y / 100) * canvas.height);
    context.rotate((text.rotation * Math.PI) / 180);
    context.font = `${text.isItalic ? "italic " : ""}${text.isBold ? "800 " : "400 "}${text.fontSize * exportScale}px ${text.fontFamily}`;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.shadowColor = "rgba(0,0,0,0.26)";
    context.shadowBlur = 3 * exportScale;
    context.shadowOffsetY = exportScale;
    if (text.color === rainbowTextColor) {
      const gradient = context.createLinearGradient((-text.content.length * text.fontSize * exportScale) / 4, 0, (text.content.length * text.fontSize * exportScale) / 4, 0);
      gradient.addColorStop(0, "#ef4444");
      gradient.addColorStop(0.16, "#f97316");
      gradient.addColorStop(0.32, "#facc15");
      gradient.addColorStop(0.5, "#22c55e");
      gradient.addColorStop(0.66, "#06b6d4");
      gradient.addColorStop(0.82, "#2563eb");
      gradient.addColorStop(1, "#9333ea");
      context.fillStyle = gradient;
    } else {
      context.fillStyle = text.color;
    }
    context.fillText(text.content, 0, 0);
    context.restore();
  }

  for (const sticker of state.stickerElements) {
    const stickerImage = await loadImage(sticker.src);
    const stickerWidth = (sticker.aspectRatio >= 1 ? sticker.size : Math.max(minStickerSize, Math.round(sticker.size * sticker.aspectRatio))) * exportScale;
    const stickerHeight = (sticker.aspectRatio >= 1 ? Math.max(minStickerSize, Math.round(sticker.size / sticker.aspectRatio)) : sticker.size) * exportScale;
    context.save();
    context.translate((sticker.x / 100) * canvas.width, (sticker.y / 100) * canvas.height);
    context.rotate((sticker.rotation * Math.PI) / 180);
    context.drawImage(stickerImage, -stickerWidth / 2, -stickerHeight / 2, stickerWidth, stickerHeight);
    context.restore();
  }

  applyExportColorEffects(context, state, canvas.width, canvas.height);

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));

  if (!blob) {
    throw new Error("导出失败，请稍后再试。");
  }

  const link = document.createElement("a");
  const objectUrl = URL.createObjectURL(blob);
  link.href = objectUrl;
  link.download = `${fileName.replace(/\.[^.]+$/, "") || "dreamchasers-photo"}-edited.png`;
  link.click();
  URL.revokeObjectURL(objectUrl);
}

function TopBar({
  canRedo,
  canUndo,
  onRedo,
  onExport,
  onUndo,
  photo
}: {
  canRedo: boolean;
  canUndo: boolean;
  onRedo: () => void;
  onExport: () => void;
  onUndo: () => void;
  photo: UploadedPhoto | null;
}) {
  return (
    <header className={styles.topbar}>
      <div className={styles.brand}>
        <div className={styles.mark} aria-hidden="true" />
        <div>
          <div className={styles.brandTitle}>DreamChasers</div>
          <div className={styles.brandSub}>单图 AI 修图</div>
        </div>
      </div>

      <div className={styles.filePill}>
        <span>当前图片</span>
        <strong>{photo?.name ?? "portrait-042.jpg"}</strong>
        <span>{photo ? `${photo.dimensions} · ${photo.sizeLabel}` : "单张上传"}</span>
      </div>

      <div className={styles.topActions}>
        <div className={styles.usageChip}>
          <span className={styles.usageDot} />
          AI 免费额度 0 / 0
        </div>
        <button className={styles.ghostButton} disabled={!canUndo} onClick={onUndo} type="button">
          撤销
        </button>
        <button className={styles.ghostButton} disabled={!canRedo} onClick={onRedo} type="button">
          重做
        </button>
        <button className={styles.primaryButton} disabled={!photo} onClick={onExport} type="button">
          导出图片
        </button>
      </div>
    </header>
  );
}

function ToolRail({
  activeToolId,
  beautyError,
  beautyStatusMessage,
  borderColor,
  cropRatio,
  isBeautyRunning,
  onAddSticker,
  onAddText,
  onApplyCrop,
  onBorderColorChange,
  onCropRatioChange,
  onDeleteSelectedText,
  onResetCrop,
  onRunBeauty,
  onSelectBorder,
  onSelectFilter,
  onSelectTool,
  onTextBoldChange,
  onTextColorChange,
  onTextContentChange,
  onTextFontChange,
  onTextItalicChange,
  onUploadClick,
  onUploadCustomSticker,
  photo,
  selectedBorderId,
  selectedFilterId,
  selectedSticker,
  selectedText,
  sliders,
  textBold,
  textColor,
  textFont,
  textItalic,
  textValue,
  updateSlider
}: {
  activeToolId: PhotoToolId | null;
  beautyError: string | null;
  beautyStatusMessage: string | null;
  borderColor: string;
  cropRatio: CropRatio;
  isBeautyRunning: boolean;
  onAddSticker: (preset: PhotoStickerPreset) => void;
  onAddText: () => void;
  onApplyCrop: () => void;
  onBorderColorChange: (color: string) => void;
  onCropRatioChange: (ratio: CropRatio) => void;
  onDeleteSelectedText: () => void;
  onResetCrop: () => void;
  onRunBeauty: () => void;
  onSelectBorder: (preset: PhotoBorderPreset) => void;
  onSelectFilter: (filterId: PhotoFilterId) => void;
  onSelectTool: (tool: PhotoToolId) => void;
  onTextBoldChange: (isBold: boolean) => void;
  onTextColorChange: (color: string) => void;
  onTextContentChange: (content: string) => void;
  onTextFontChange: (fontFamily: string) => void;
  onTextItalicChange: (isItalic: boolean) => void;
  onUploadClick: () => void;
  onUploadCustomSticker: () => void;
  photo: UploadedPhoto | null;
  selectedBorderId: PhotoBorderId;
  selectedFilterId: PhotoFilterId;
  selectedSticker: StickerElement | null;
  selectedText: TextElement | null;
  sliders: SliderState;
  textBold: boolean;
  textColor: string;
  textFont: string;
  textItalic: boolean;
  textValue: string;
  updateSlider: (key: keyof SliderState, value: number) => void;
}) {
  return (
    <aside className={styles.toolsPanel} aria-label="修图工具">
      {photo ? (
        <div className={styles.uploadCard}>
          <div className={styles.uploadTop}>
            <img alt="" className={styles.fileAvatarImage} src={photo.objectUrl} />
            <div className={styles.uploadCopy}>
              <strong>{photo.name}</strong>
              <small>{`${photo.dimensions} · ${photo.sizeLabel}`}</small>
            </div>
          </div>
          <div className={styles.uploadActions}>
            <button onClick={onUploadClick} type="button">
              替换
            </button>
          </div>
        </div>
      ) : null}

      <div className={styles.toolScroll}>
        {toolGroups.map((group) => (
          <section className={styles.toolGroup} key={group.id}>
            <p className={styles.groupLabel}>
              <span>{group.title}</span>
              {group.aside ? <span>{group.aside}</span> : null}
            </p>
            <div className={styles.toolList}>
              {photoTools
                .filter((tool) => tool.group === group.id)
                .map((tool) => {
                  const isActive = activeToolId === tool.id;
                  const isUnavailableAiTool = tool.group === "ai" && tool.id !== "beauty";
                  return (
                    <div className={styles.toolItem} key={tool.id}>
                      <button
                        className={`${styles.navTool} ${isActive ? styles.active : ""} ${isUnavailableAiTool ? styles.disabledTool : ""}`}
                        aria-disabled={isUnavailableAiTool}
                        aria-expanded={isUnavailableAiTool ? undefined : isActive}
                        onClick={() => onSelectTool(tool.id)}
                        type="button"
                      >
                        <span className={styles.toolIcon}>{tool.icon}</span>
                        <span className={styles.toolText}>
                          <strong>{tool.name}</strong>
                          <small>{tool.description}</small>
                        </span>
                        {tool.cost ? <span className={styles.aiCost}>{tool.id === "beauty" ? "1 次" : "未开放"}</span> : <span className={styles.chev}>›</span>}
                      </button>
                      {isActive ? (
                        <ParameterInlinePanel
                          activeTool={tool}
                          beautyError={beautyError}
                          beautyStatusMessage={beautyStatusMessage}
                          borderColor={borderColor}
                          cropRatio={cropRatio}
                          isBeautyRunning={isBeautyRunning}
                          onAddSticker={onAddSticker}
                          onAddText={onAddText}
                          onApplyCrop={onApplyCrop}
                          onBorderColorChange={onBorderColorChange}
                          onCropRatioChange={onCropRatioChange}
                          onDeleteSelectedText={onDeleteSelectedText}
                          onResetCrop={onResetCrop}
                          onRunBeauty={onRunBeauty}
                          onSelectBorder={onSelectBorder}
                          onSelectFilter={onSelectFilter}
                          onTextBoldChange={onTextBoldChange}
                          onTextColorChange={onTextColorChange}
                          onTextContentChange={onTextContentChange}
                          onTextFontChange={onTextFontChange}
                          onTextItalicChange={onTextItalicChange}
                          onUploadCustomSticker={onUploadCustomSticker}
                          selectedBorderId={selectedBorderId}
                          selectedFilterId={selectedFilterId}
                          selectedSticker={selectedSticker}
                          selectedText={selectedText}
                          sliders={sliders}
                          stickerCategories={photoStickerCategories}
                          stickerPresets={photoStickerPresets}
                          textBold={textBold}
                          textColor={textColor}
                          textFont={textFont}
                          textItalic={textItalic}
                          textValue={textValue}
                          updateSlider={updateSlider}
                        />
                      ) : null}
                    </div>
                  );
                })}
            </div>
          </section>
        ))}
      </div>
    </aside>
  );
}

function ParameterInlinePanel(props: ToolParameterProps) {
  return (
    <div className={styles.mobileParamPanel} onClick={(event) => event.stopPropagation()} onPointerDown={(event) => event.stopPropagation()}>
      <div className={styles.mobileParamHead}>
        <strong>{props.activeTool.name}</strong>
        <span>{props.activeTool.panelDescription}</span>
      </div>
      <div className={styles.mobileParamBody}>
        <ToolParameterContent {...props} />
      </div>
    </div>
  );
}

function ParameterPanel({
  activeTool,
  cropRatio,
  onAddSticker,
  onAddText,
  onApplyCrop,
  onCropRatioChange,
  onDeleteSelectedText,
  onResetCrop,
  onRunBeauty,
  onBorderColorChange,
  onSelectBorder,
  onSelectFilter,
  onTextColorChange,
  onTextBoldChange,
  onTextContentChange,
  onTextItalicChange,
  onTextFontChange,
  onUploadCustomSticker,
  selectedFilterId,
  selectedBorderId,
  selectedSticker,
  selectedText,
  beautyError,
  beautyStatusMessage,
  isBeautyRunning,
  stickerCategories,
  stickerPresets,
  textColor,
  textBold,
  textFont,
  textItalic,
  textValue,
  borderColor,
  sliders,
  updateSlider,
  onClick,
  onPointerDown
}: {
  activeTool: PhotoTool;
  cropRatio: CropRatio;
  onAddSticker: (preset: PhotoStickerPreset) => void;
  onAddText: () => void;
  onApplyCrop: () => void;
  onCropRatioChange: (ratio: CropRatio) => void;
  onDeleteSelectedText: () => void;
  onResetCrop: () => void;
  onRunBeauty: () => void;
  onBorderColorChange: (color: string) => void;
  onSelectBorder: (preset: PhotoBorderPreset) => void;
  onSelectFilter: (filterId: PhotoFilterId) => void;
  onTextColorChange: (color: string) => void;
  onTextBoldChange: (isBold: boolean) => void;
  onTextContentChange: (content: string) => void;
  onTextItalicChange: (isItalic: boolean) => void;
  onTextFontChange: (fontFamily: string) => void;
  onUploadCustomSticker: () => void;
  selectedFilterId: PhotoFilterId;
  selectedBorderId: PhotoBorderId;
  selectedSticker: StickerElement | null;
  selectedText: TextElement | null;
  beautyError: string | null;
  beautyStatusMessage: string | null;
  isBeautyRunning: boolean;
  stickerCategories: StickerCategoryList;
  stickerPresets: PhotoStickerPreset[];
  textColor: string;
  textBold: boolean;
  textFont: string;
  textItalic: boolean;
  textValue: string;
  borderColor: string;
  sliders: SliderState;
  updateSlider: (key: keyof SliderState, value: number) => void;
  onClick?: React.MouseEventHandler<HTMLElement>;
  onPointerDown?: React.PointerEventHandler<HTMLElement>;
}) {
  return (
    <aside className={styles.paramsPanel} aria-label="功能参数" onClick={onClick} onPointerDown={onPointerDown}>
      <div className={styles.paramHead}>
        <p className={styles.paramKicker}>{activeTool.group === "ai" ? "AI 工具" : activeTool.group === "creative" ? "创意元素" : "基础编辑"}</p>
        <h2 className={styles.paramTitle}>{activeTool.name}</h2>
        <p className={styles.paramDesc}>{activeTool.panelDescription}</p>
      </div>

      <div className={styles.paramBody}>
        <ToolParameterContent
          activeTool={activeTool}
          borderColor={borderColor}
          cropRatio={cropRatio}
          onAddSticker={onAddSticker}
          onAddText={onAddText}
          onApplyCrop={onApplyCrop}
          onBorderColorChange={onBorderColorChange}
          onCropRatioChange={onCropRatioChange}
          onDeleteSelectedText={onDeleteSelectedText}
          onResetCrop={onResetCrop}
          onRunBeauty={onRunBeauty}
          onSelectBorder={onSelectBorder}
          onSelectFilter={onSelectFilter}
          onTextBoldChange={onTextBoldChange}
          onTextColorChange={onTextColorChange}
          onTextContentChange={onTextContentChange}
          onTextFontChange={onTextFontChange}
          onTextItalicChange={onTextItalicChange}
          onUploadCustomSticker={onUploadCustomSticker}
          selectedBorderId={selectedBorderId}
          selectedFilterId={selectedFilterId}
          selectedSticker={selectedSticker}
          selectedText={selectedText}
          beautyError={beautyError}
          beautyStatusMessage={beautyStatusMessage}
          isBeautyRunning={isBeautyRunning}
          sliders={sliders}
          stickerCategories={stickerCategories}
          stickerPresets={stickerPresets}
          textBold={textBold}
          textColor={textColor}
          textFont={textFont}
          textItalic={textItalic}
          textValue={textValue}
          updateSlider={updateSlider}
        />
      </div>
    </aside>
  );
}

function ToolParameterContent({
  activeTool,
  borderColor,
  cropRatio,
  onAddSticker,
  onAddText,
  onApplyCrop,
  onBorderColorChange,
  onCropRatioChange,
  onDeleteSelectedText,
  onResetCrop,
  onRunBeauty,
  onSelectBorder,
  onSelectFilter,
  onTextBoldChange,
  onTextColorChange,
  onTextContentChange,
  onTextFontChange,
  onTextItalicChange,
  onUploadCustomSticker,
  selectedBorderId,
  selectedFilterId,
  selectedSticker,
  selectedText,
  beautyError,
  beautyStatusMessage,
  isBeautyRunning,
  sliders,
  stickerCategories,
  stickerPresets,
  textBold,
  textColor,
  textFont,
  textItalic,
  textValue,
  updateSlider
}: ToolParameterProps) {
  return (
    <>
      {activeTool.id === "adjust" ? (
        <AdjustPanel sliders={sliders} updateSlider={updateSlider} />
      ) : null}
      {activeTool.id === "crop" ? (
        <CropPanel
          cropRatio={cropRatio}
          onApplyCrop={onApplyCrop}
          onCropRatioChange={onCropRatioChange}
          onResetCrop={onResetCrop}
          sliders={sliders}
          updateSlider={updateSlider}
        />
      ) : null}
      {activeTool.id === "filter" ? (
        <FilterPanel
          selectedFilterId={selectedFilterId}
          onSelectFilter={onSelectFilter}
          sliders={sliders}
          updateSlider={updateSlider}
        />
      ) : null}
      {activeTool.id === "text" ? (
        <TextPanel
          onAddText={onAddText}
          onDeleteSelectedText={onDeleteSelectedText}
          onTextColorChange={onTextColorChange}
          onTextBoldChange={onTextBoldChange}
          onTextContentChange={onTextContentChange}
          onTextItalicChange={onTextItalicChange}
          onTextFontChange={onTextFontChange}
          selectedText={selectedText}
          sliders={sliders}
          textColor={textColor}
          textBold={textBold}
          textFont={textFont}
          textItalic={textItalic}
          textValue={textValue}
          updateSlider={updateSlider}
        />
      ) : null}
      {activeTool.id === "sticker" ? (
        <StickerPanel
          onAddSticker={onAddSticker}
          onUploadCustomSticker={onUploadCustomSticker}
          selectedSticker={selectedSticker}
          stickerCategories={stickerCategories}
          stickerGroups={photoStickerGroups}
          stickerPresets={stickerPresets}
        />
      ) : null}
      {activeTool.id === "border" ? (
        <BorderPanel
          borderColor={borderColor}
          onBorderColorChange={onBorderColorChange}
          onSelectBorder={onSelectBorder}
          selectedBorderId={selectedBorderId}
          sliders={sliders}
          updateSlider={updateSlider}
        />
      ) : null}
      {activeTool.id === "beauty" ? (
        <BeautyPanel
          beautyError={beautyError}
          beautyStatusMessage={beautyStatusMessage}
          isBeautyRunning={isBeautyRunning}
          onRunBeauty={onRunBeauty}
        />
      ) : null}
      {activeTool.id === "background" ? <BackgroundPanel /> : null}
      {activeTool.id === "repair" ? <RepairPanel /> : null}
      {activeTool.id === "enhance" ? <EnhancePanel /> : null}
    </>
  );
}

function Slider({
  label,
  max,
  min,
  suffix = "",
  value,
  onChange,
  signed = false
}: {
  label: string;
  max: number;
  min: number;
  suffix?: string;
  value: number;
  onChange: (value: number) => void;
  signed?: boolean;
}) {
  const display = signed && value > 0 ? `+${value}${suffix}` : `${value}${suffix}`;

  return (
    <label className={styles.slider}>
      <span className={styles.sliderRow}>
        <span>{label}</span>
        <b>{display}</b>
      </span>
      <input
        max={max}
        min={min}
        onChange={(event) => onChange(Number(event.target.value))}
        type="range"
        value={value}
      />
    </label>
  );
}

function AdjustPanel({
  sliders,
  updateSlider
}: {
  sliders: SliderState;
  updateSlider: (key: keyof SliderState, value: number) => void;
}) {
  return (
    <>
      <p className={styles.sectionLabel}>基础参数</p>
      <div className={styles.controlCard}>
        <Slider label="亮度" max={100} min={-100} signed value={sliders.brightness} onChange={(value) => updateSlider("brightness", value)} />
        <Slider label="对比度" max={100} min={-100} signed value={sliders.contrast} onChange={(value) => updateSlider("contrast", value)} />
        <Slider label="饱和度" max={100} min={-100} signed value={sliders.saturation} onChange={(value) => updateSlider("saturation", value)} />
        <Slider label="色温" max={100} min={-100} signed value={sliders.temperature} onChange={(value) => updateSlider("temperature", value)} />
        <Slider label="缩放" max={200} min={50} suffix="%" value={sliders.zoom} onChange={(value) => updateSlider("zoom", value)} />
      </div>
    </>
  );
}

function CropPanel({
  cropRatio,
  onApplyCrop,
  onCropRatioChange,
  onResetCrop,
  sliders,
  updateSlider
}: {
  cropRatio: CropRatio;
  onApplyCrop: () => void;
  onCropRatioChange: (ratio: CropRatio) => void;
  onResetCrop: () => void;
  sliders: SliderState;
  updateSlider: (key: keyof SliderState, value: number) => void;
}) {
  return (
    <>
      <p className={styles.sectionLabel}>裁剪比例</p>
      <OptionGrid<CropRatio> activeOption={cropRatio} onChange={onCropRatioChange} options={cropRatios} />
      <p className={styles.sectionLabel}>变换</p>
      <div className={styles.controlCard}>
        <Slider label="旋转" max={180} min={-180} suffix=" deg" value={sliders.rotate} onChange={(value) => updateSlider("rotate", value)} />
      </div>
      <div className={styles.actionRow}>
        <button className={styles.runButton} onClick={onApplyCrop} type="button">
          应用裁剪
        </button>
        <button className={styles.secondaryButton} onClick={onResetCrop} type="button">
          还原
        </button>
      </div>
    </>
  );
}

function FilterPanel({
  onSelectFilter,
  selectedFilterId,
  sliders,
  updateSlider
}: {
  onSelectFilter: (filterId: PhotoFilterId) => void;
  selectedFilterId: PhotoFilterId;
  sliders: SliderState;
  updateSlider: (key: keyof SliderState, value: number) => void;
}) {
  return (
    <>
      <p className={styles.sectionLabel}>滤镜</p>
      <div className={styles.filterGrid}>
        {photoFilters.map((filter) => (
          <button
            className={`${styles.filterCard} ${selectedFilterId === filter.id ? styles.active : ""}`}
            key={filter.id}
            onClick={() => onSelectFilter(filter.id)}
            type="button"
          >
            <div className={`${styles.filterThumb} ${styles[filter.previewClass]}`} />
            <div className={styles.filterName}>
              <span>{filter.name}</span>
              <span>{filter.sampleValue}</span>
            </div>
          </button>
        ))}
      </div>
      <div className={styles.controlCard}>
        <Slider label="滤镜强度" max={100} min={0} suffix="%" value={sliders.filterStrength} onChange={(value) => updateSlider("filterStrength", value)} />
      </div>
    </>
  );
}

function TextPanel({
  onAddText,
  onDeleteSelectedText,
  onTextColorChange,
  onTextBoldChange,
  onTextContentChange,
  onTextItalicChange,
  onTextFontChange,
  selectedText,
  sliders,
  textColor,
  textBold,
  textFont,
  textItalic,
  textValue,
  updateSlider
}: {
  onAddText: () => void;
  onDeleteSelectedText: () => void;
  onTextColorChange: (color: string) => void;
  onTextBoldChange: (isBold: boolean) => void;
  onTextContentChange: (content: string) => void;
  onTextItalicChange: (isItalic: boolean) => void;
  onTextFontChange: (fontFamily: string) => void;
  selectedText: TextElement | null;
  sliders: SliderState;
  textColor: string;
  textBold: boolean;
  textFont: string;
  textItalic: boolean;
  textValue: string;
  updateSlider: (key: keyof SliderState, value: number) => void;
}) {
  return (
    <>
      <p className={styles.sectionLabel}>{selectedText ? "编辑文字" : "添加文字"}</p>
      <input
        className={styles.textInput}
        onChange={(event) => onTextContentChange(event.target.value)}
        placeholder="输入要添加的文字"
        value={textValue}
      />
      <div className={styles.controlCard}>
        <Slider label="字号" max={96} min={12} suffix="px" value={sliders.fontSize} onChange={(value) => updateSlider("fontSize", value)} />
        <Slider label="透明度" max={100} min={0} suffix="%" value={sliders.opacity} onChange={(value) => updateSlider("opacity", value)} />
      </div>
      <p className={styles.sectionLabel}>颜色</p>
      <div className={styles.colorRow}>
        {textColors.map((color) => (
          <button
            aria-label={`选择${color.label}色`}
            className={`${styles.swatch} ${textColor === color.value ? styles.active : ""}`}
            key={color.label}
            onClick={() => onTextColorChange(color.value)}
            style={{ background: color.value === rainbowTextColor ? rainbowTextGradient : color.value }}
            type="button"
          />
        ))}
      </div>
      <p className={styles.sectionLabel}>字体</p>
      <div className={styles.fontGrid}>
        {textFonts.map((font) => (
          <button
            className={`${styles.fontOption} ${textFont === font.value ? styles.active : ""}`}
            key={font.label}
            onClick={() => onTextFontChange(font.value)}
            style={{ fontFamily: font.value }}
            type="button"
          >
            {font.label}
          </button>
        ))}
      </div>
      <p className={styles.sectionLabel}>字形</p>
      <div className={styles.styleRow}>
        <button
          className={`${styles.styleButton} ${textBold ? styles.active : ""}`}
          aria-pressed={textBold}
          onClick={() => onTextBoldChange(!textBold)}
          type="button"
        >
          B
        </button>
        <button
          className={`${styles.styleButton} ${textItalic ? styles.active : ""}`}
          aria-pressed={textItalic}
          onClick={() => onTextItalicChange(!textItalic)}
          type="button"
        >
          I
        </button>
      </div>
      <div className={styles.actionRow}>
        <button className={styles.runButton} disabled={!textValue.trim()} onClick={onAddText} type="button">
          添加文字
        </button>
        <button className={styles.secondaryButton} disabled={!selectedText} onClick={onDeleteSelectedText} type="button">
          删除当前
        </button>
      </div>
    </>
  );
}

function StickerPanel({
  onAddSticker,
  onUploadCustomSticker,
  selectedSticker,
  stickerCategories,
  stickerGroups,
  stickerPresets
}: {
  onAddSticker: (preset: PhotoStickerPreset) => void;
  onUploadCustomSticker: () => void;
  selectedSticker: StickerElement | null;
  stickerCategories: StickerCategoryList;
  stickerGroups: StickerGroupList;
  stickerPresets: PhotoStickerPreset[];
}) {
  const renderStickerGrid = (presets: PhotoStickerPreset[]) => (
    <div className={styles.stickerGrid}>
      {presets.map((preset) => (
        <button
          className={`${styles.stickerPreset} ${selectedSticker?.src === preset.src ? styles.active : ""}`}
          aria-label={`添加贴纸：${preset.name}`}
          key={preset.id}
          onClick={() => onAddSticker(preset)}
          type="button"
        >
          <span className={styles.stickerPresetPreview}>
            <img alt={preset.name} className={styles.stickerPresetImage} src={preset.src} />
          </span>
        </button>
      ))}
    </div>
  );

  return (
    <>
      <p className={styles.sectionLabel}>贴纸分类</p>
      <div className={`${styles.assetList} ${styles.stickerAssetList}`}>
        {stickerCategories.map((category) => {
          const categoryPresets = stickerPresets.filter((preset) => preset.category === category.id);

          if (category.id !== "decor") {
            return (
              <section className={styles.stickerGroup} key={category.id}>
                <p className={styles.stickerGroupTitle}>{category.title}</p>
                {renderStickerGrid(categoryPresets)}
              </section>
            );
          }

          return (
            <section className={styles.stickerGroup} key={category.id}>
              <p className={styles.stickerGroupTitle}>{category.title}</p>
              <div className={styles.stickerBatchList}>
                {stickerGroups.map((group) => {
                  const groupPresets = categoryPresets.filter((preset) => preset.group === group.id);

                  if (groupPresets.length === 0) {
                    return null;
                  }

                  return (
                    <section className={styles.stickerBatchGroup} key={group.id}>
                      <p className={styles.stickerBatchTitle}>{group.title}</p>
                      {renderStickerGrid(groupPresets)}
                    </section>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
      <button className={styles.customStickerButton} onClick={onUploadCustomSticker} type="button">
        <span className={styles.customStickerIcon}>+</span>
        <span>
          <strong>上传自定义贴纸</strong>
          <small>支持 PNG、JPG、WebP、SVG</small>
        </span>
      </button>
    </>
  );
}

function BorderPanel({
  borderColor,
  onBorderColorChange,
  onSelectBorder,
  selectedBorderId,
  sliders,
  updateSlider
}: {
  borderColor: string;
  onBorderColorChange: (color: string) => void;
  onSelectBorder: (preset: PhotoBorderPreset) => void;
  selectedBorderId: PhotoBorderId;
  sliders: SliderState;
  updateSlider: (key: keyof SliderState, value: number) => void;
}) {
  return (
    <>
      <p className={styles.sectionLabel}>边框样式</p>
      <div className={styles.borderPresetGrid}>
        {photoBorderPresets.map((preset) => (
          <button
            className={`${styles.borderPreset} ${selectedBorderId === preset.id ? styles.active : ""}`}
            key={preset.id}
            onClick={() => onSelectBorder(preset)}
            type="button"
          >
            <span className={`${styles.borderPresetPreview} ${styles[`borderPreview${preset.id.replace(/(^|-)([a-z])/g, (_, __, letter: string) => letter.toUpperCase())}`]}`} />
            <span className={styles.assetCopy}>
              <strong>{preset.name}</strong>
              <small>{preset.description}</small>
            </span>
          </button>
        ))}
      </div>
      <div className={styles.controlCard}>
        <Slider label="边框宽度" max={80} min={0} suffix="px" value={sliders.borderWidth} onChange={(value) => updateSlider("borderWidth", value)} />
        <Slider label="圆角" max={48} min={0} suffix="px" value={sliders.radius} onChange={(value) => updateSlider("radius", value)} />
        <label className={styles.colorControl}>
          <span>边框颜色</span>
          <input aria-label="边框颜色" type="color" value={borderColor} onChange={(event) => onBorderColorChange(event.target.value)} />
        </label>
      </div>
    </>
  );
}

function BeautyPanel({
  beautyError,
  beautyStatusMessage,
  isBeautyRunning,
  onRunBeauty
}: {
  beautyError: string | null;
  beautyStatusMessage: string | null;
  isBeautyRunning: boolean;
  onRunBeauty: () => void;
}) {
  return (
    <>
      <AiPanelCard
        detail="自然优化肤色、暗沉与细节，默认保留人物五官和脸型，不做夸张改变。"
        title="AI 美颜 · 消耗 1 次"
      />
      <div className={styles.controlCard}>
        <p className={styles.sectionLabel}>美颜类型</p>
        <OptionGrid activeOption="自然人像增强" options={["自然人像增强"]} />
        <button className={styles.runButton} disabled={isBeautyRunning} onClick={onRunBeauty} type="button">
          {isBeautyRunning ? "生成中..." : "生成自然美颜"}
        </button>
        {beautyStatusMessage ? <p className={styles.statusText}>{beautyStatusMessage}</p> : null}
        {beautyError ? <p className={styles.errorText}>{beautyError}</p> : null}
      </div>
    </>
  );
}

function BackgroundPanel() {
  return (
    <>
      <AiPanelCard detail="描述你想替换成什么背景。系统会尽量保留主体边缘、光影和原始构图。" title="AI 换背景 · 消耗 1 次" />
      <textarea className={styles.textareaInput} defaultValue="换成干净的浅灰色背景，保持自然光影" />
      <button className={styles.runButton} type="button">
        生成新背景
      </button>
    </>
  );
}

function RepairPanel() {
  return (
    <AiPanelCard
      action="选择区域并修复"
      detail="适合处理自己图片中的遮挡、瑕疵、水印或不需要的局部元素。先在画布中框选区域，再生成。"
      title="AI 细节修复 · 消耗 1 次"
    />
  );
}

function EnhancePanel() {
  return (
    <>
      <AiPanelCard detail="提升图片清晰度与细节，适合模糊、压缩或需要高清导出的单张图片。" title="高清增强 · 消耗 1 次" />
      <OptionGrid options={["2x 增强", "4x 增强"]} />
      <button className={styles.runButton} type="button">
        开始高清增强
      </button>
    </>
  );
}

function OptionGrid<T extends string>({
  activeOption,
  onChange,
  options
}: {
  activeOption?: T;
  onChange?: (option: T) => void;
  options: T[];
}) {
  const [localActiveOption, setLocalActiveOption] = useState(options[0]);
  const selectedOption = activeOption ?? localActiveOption;
  const selectOption = (option: T) => {
    setLocalActiveOption(option);
    onChange?.(option);
  };

  return (
    <div className={styles.optionGrid}>
      {options.map((option) => (
        <button
          className={`${styles.option} ${selectedOption === option ? styles.active : ""}`}
          key={option}
          onClick={() => selectOption(option)}
          type="button"
        >
          {option}
        </button>
      ))}
    </div>
  );
}

function AiPanelCard({ action, detail, title }: { action?: string; detail: string; title: string }) {
  return (
    <div className={styles.aiPanelCard}>
      <h3>{title}</h3>
      <p>{detail}</p>
      {action ? (
        <button className={styles.runButton} type="button">
          {action}
        </button>
      ) : null}
    </div>
  );
}

function Stage({
  activeTool,
  appliedCrop,
  beautyStatusMessage,
  cropBox,
  cropRatio,
  isBeautyRunning,
  isOriginalCompare,
  isDragging,
  onToggleOriginalCompare,
  onUploadClick,
  pan,
  panHandlers,
  photo,
  photoCanvasRef,
  selectedStickerId,
  selectedTextId,
  selectedFilterId,
  selectedBorderId,
  borderColor,
  sliders,
  stickerElements,
  textElements,
  onDeleteStickerElement,
  onDeleteTextElement,
  onDeselectStickerElement,
  onDeselectTextElement,
  onMoveStickerElement,
  onMoveTextElement,
  onResizeStickerElement,
  onRotateStickerElement,
  onRotateTextElement,
  onSelectStickerElement,
  onSelectTextElement
}: {
  activeTool: PhotoTool | null;
  appliedCrop: ReturnType<typeof useCropBox>["rect"] | null;
  beautyStatusMessage: string | null;
  cropBox: ReturnType<typeof useCropBox>;
  cropRatio: CropRatio;
  isBeautyRunning: boolean;
  isOriginalCompare: boolean;
  isDragging: boolean;
  onToggleOriginalCompare: () => void;
  onUploadClick: () => void;
  pan: { x: number; y: number };
  panHandlers: {
    onPointerCancel: (event: React.PointerEvent<HTMLElement>) => void;
    onPointerDown: (event: React.PointerEvent<HTMLElement>) => void;
    onPointerLeave: (event: React.PointerEvent<HTMLElement>) => void;
    onPointerMove: (event: React.PointerEvent<HTMLElement>) => void;
    onPointerUp: (event: React.PointerEvent<HTMLElement>) => void;
  };
  photo: UploadedPhoto | null;
  photoCanvasRef: React.RefObject<HTMLDivElement | null>;
  selectedStickerId: string | null;
  selectedTextId: string | null;
  selectedFilterId: PhotoFilterId;
  selectedBorderId: PhotoBorderId;
  borderColor: string;
  sliders: SliderState;
  stickerElements: StickerElement[];
  textElements: TextElement[];
  onDeleteStickerElement: (id: string) => void;
  onDeleteTextElement: (id: string) => void;
  onDeselectStickerElement: () => void;
  onDeselectTextElement: () => void;
  onMoveStickerElement: (id: string, position: { x: number; y: number }) => void;
  onMoveTextElement: (id: string, position: { x: number; y: number }) => void;
  onResizeStickerElement: (id: string, size: number) => void;
  onRotateStickerElement: (id: string, rotation: number) => void;
  onRotateTextElement: (id: string, rotation: number) => void;
  onSelectStickerElement: (element: StickerElement) => void;
  onSelectTextElement: (element: TextElement) => void;
}) {
  const previewStyle = buildPhotoPreviewStyle(sliders, pan, {
    id: selectedFilterId,
    strength: sliders.filterStrength
  });
  const appliedCropStyle = buildAppliedCropStyle(isOriginalCompare ? null : appliedCrop);
  const baseShellStyle = isOriginalCompare ? { transform: previewStyle.transform } : previewStyle;
  const activeBorder = photoBorderPresets.find((preset) => preset.id === selectedBorderId) ?? photoBorderPresets[0];
  const borderWidth = activeBorder.id === "none" ? 0 : sliders.borderWidth;
  const borderBottomWidth = activeBorder.id === "polaroid" ? borderWidth * 2.65 : borderWidth;
  const shellStyle: PhotoFrameStyle = {
    "--photo-frame-color": activeBorder.id === "none" ? "transparent" : borderColor,
    "--photo-frame-bottom-width": `${borderBottomWidth}px`,
    "--photo-frame-inner-radius": `${Math.max(sliders.radius - Math.min(borderWidth, sliders.radius), 0)}px`,
    "--photo-frame-radius": `${sliders.radius}px`,
    "--photo-frame-width": `${borderWidth}px`,
    aspectRatio: photo?.aspectRatio,
    height: "min(100%, 82vh)",
    ...baseShellStyle,
    ...appliedCropStyle.shellStyle
  };
  const showCropBox = activeTool?.id === "crop";
  const canResizeCrop = cropRatio === "自由";
  const borderClassName = activeBorder.id.replace(/(^|-)([a-z])/g, (_, __, letter: string) => letter.toUpperCase());
  const canvasPanHandlers = isBeautyRunning ? {} : panHandlers;

  return (
    <main className={styles.stage}>
      <div className={styles.stageToolbar}>
        <div className={styles.modeTabs}>
          <button className={styles.active} type="button">
            {activeTool?.modeLabel ?? "画布预览"}
          </button>
          <button type="button">AI 结果对比</button>
        </div>
        <div className={styles.canvasTools}>
          <button
            className={`${styles.button} ${isOriginalCompare ? styles.active : ""}`}
            onClick={onToggleOriginalCompare}
            type="button"
          >
            {isOriginalCompare ? "退出对比" : "原图对比"}
          </button>
        </div>
      </div>

      <section
        aria-busy={isBeautyRunning}
        aria-label="图片画布"
        className={`${styles.canvasWrap} ${isBeautyRunning ? styles.lockedCanvas : ""}`}
      >
        {photo ? (
          <div
            className={`${styles.photoShell} ${styles[`photoBorder${borderClassName}`]} ${isDragging ? styles.dragging : ""}`}
            data-photo-canvas
            ref={photoCanvasRef}
            {...canvasPanHandlers}
            onClick={(event) => {
              event.stopPropagation();
              onDeselectStickerElement();
              onDeselectTextElement();
            }}
            style={shellStyle}
          >
            <div className={styles.photoImageFrame}>
              <img
                alt={photo.name}
                className={styles.photoPreview}
                draggable={false}
                onDragStart={(event) => event.preventDefault()}
                src={photo.objectUrl}
                style={appliedCropStyle.imageStyle}
              />
            </div>
            {textElements.map((element) => (
              <DraggableText
                element={element}
                isActive={selectedTextId === element.id}
                key={element.id}
                onDelete={onDeleteTextElement}
                onMove={onMoveTextElement}
                onRotate={onRotateTextElement}
                onSelect={onSelectTextElement}
              />
            ))}
            {stickerElements.map((element) => (
              <DraggableSticker
                element={element}
                isActive={selectedStickerId === element.id}
                key={element.id}
                onDelete={onDeleteStickerElement}
                onMove={onMoveStickerElement}
                onResize={onResizeStickerElement}
                onRotate={onRotateStickerElement}
                onSelect={onSelectStickerElement}
              />
            ))}
            {showCropBox ? (
              <div
                className={`${styles.cropBox} ${canResizeCrop ? styles.resizableCropBox : styles.lockedCropBox}`}
                style={cropBox.cropBoxStyle}
                {...cropBox.moveHandlers}
              >
                <span className={styles.cropV1} />
                <span className={styles.cropV2} />
                {canResizeCrop
                  ? cropHandles.map((handle) => (
                      <span
                        aria-hidden="true"
                        className={`${styles.cropHandle} ${styles[`cropHandle${handle.toUpperCase()}`]}`}
                        key={handle}
                        onPointerDown={cropBox.startResize(handle)}
                      />
                    ))
                  : null}
              </div>
            ) : null}
          </div>
        ) : (
          <button className={styles.canvasUpload} onClick={onUploadClick} type="button">
            <span className={styles.canvasUploadIcon} />
            <strong>上传图片</strong>
            <small>选择一张图片开始编辑</small>
          </button>
        )}
        {photo && isBeautyRunning ? (
          <div className={styles.aiGeneratingOverlay} role="status" aria-live="polite">
            <div className={styles.aiGeneratingPanel}>
              <img alt="" className={styles.aiGeneratingCharacter} draggable={false} src={aiDrawingLoaderSrc} />
              <p>{beautyStatusMessage || "正在进行自然人像增强。"}</p>
            </div>
          </div>
        ) : null}
      </section>
    </main>
  );
}

function DraggableText({
  element,
  isActive,
  onDelete,
  onMove,
  onRotate,
  onSelect
}: {
  element: TextElement;
  isActive: boolean;
  onDelete: (id: string) => void;
  onMove: (id: string, position: { x: number; y: number }) => void;
  onRotate: (id: string, rotation: number) => void;
  onSelect: (element: TextElement) => void;
}) {
  const dragRef = useRef<{ originX: number; originY: number; startX: number; startY: number } | null>(null);
  const rotateRef = useRef<{
    centerX: number;
    centerY: number;
    originAngle: number;
    startRotation: number;
  } | null>(null);

  const handlePointerDown = (event: React.PointerEvent<HTMLSpanElement>) => {
    if (event.button !== 0) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      originX: event.clientX,
      originY: event.clientY,
      startX: element.x,
      startY: element.y
    };
    onSelect(element);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLSpanElement>) => {
    const drag = dragRef.current;

    if (!drag) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    const shell = event.currentTarget.closest<HTMLElement>("[data-photo-canvas]");
    const rect = shell?.getBoundingClientRect();

    if (!rect) {
      return;
    }

    onMove(element.id, {
      x: clamp(drag.startX + ((event.clientX - drag.originX) / rect.width) * 100, 4, 96),
      y: clamp(drag.startY + ((event.clientY - drag.originY) / rect.height) * 100, 4, 96)
    });
  };

  const endDrag = (event: React.PointerEvent<HTMLSpanElement>) => {
    event.stopPropagation();
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    dragRef.current = null;
  };

  const startRotate = (event: React.PointerEvent<HTMLSpanElement>) => {
    if (event.button !== 0) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    const overlay = event.currentTarget.closest<HTMLElement>("[data-text-overlay]");
    const rect = overlay?.getBoundingClientRect();

    if (!rect) {
      return;
    }

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    event.currentTarget.setPointerCapture(event.pointerId);
    rotateRef.current = {
      centerX,
      centerY,
      originAngle: getPointerAngle(event.clientX, event.clientY, centerX, centerY),
      startRotation: element.rotation
    };
    onSelect(element);
  };

  const moveRotate = (event: React.PointerEvent<HTMLSpanElement>) => {
    const rotate = rotateRef.current;

    if (!rotate) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    const currentAngle = getPointerAngle(event.clientX, event.clientY, rotate.centerX, rotate.centerY);
    const delta = normalizeAngle(currentAngle - rotate.originAngle);
    onRotate(element.id, Math.round(rotate.startRotation + delta));
  };

  const endRotate = (event: React.PointerEvent<HTMLSpanElement>) => {
    event.stopPropagation();
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    rotateRef.current = null;
  };
  const isRainbowText = element.color === rainbowTextColor;

  return (
    <div
      className={`${styles.textOverlay} ${isActive ? styles.active : ""}`}
      data-text-overlay
      style={{
        "--text-overlay-x": `${element.x}%`,
        "--text-overlay-y": `${element.y}%`,
        color: isRainbowText ? "transparent" : element.color,
        fontFamily: element.fontFamily,
        fontSize: `${element.fontSize}px`,
        fontStyle: element.isItalic ? "italic" : "normal",
        fontWeight: element.isBold ? 800 : 400,
        opacity: element.opacity / 100,
        rotate: `${element.rotation}deg`,
      } as TextOverlayStyle}
    >
      <span
        className={`${styles.textOverlayContent} ${isActive ? styles.active : ""}`}
        onClick={(event) => {
          event.stopPropagation();
          onSelect(element);
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            event.stopPropagation();
            onSelect(element);
          }
        }}
        onPointerCancel={endDrag}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        role="button"
        tabIndex={0}
      >
        <span
          className={`${styles.textOverlayText} ${isRainbowText ? styles.rainbowText : ""}`}
          style={{ backgroundImage: isRainbowText ? rainbowTextGradient : undefined }}
        >
          {element.content}
        </span>
        {isActive ? (
          <>
            <button
              aria-label="删除文字"
              className={styles.textDeleteButton}
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                onDelete(element.id);
              }}
              onPointerDown={(event) => {
                event.preventDefault();
                event.stopPropagation();
              }}
              type="button"
            >
              ×
            </button>
            <span
              aria-hidden="true"
              className={styles.textRotateHandle}
              onPointerCancel={endRotate}
              onPointerDown={startRotate}
              onPointerMove={moveRotate}
              onPointerUp={endRotate}
            >
              ↻
            </span>
          </>
        ) : null}
      </span>
    </div>
  );
}

function DraggableSticker({
  element,
  isActive,
  onDelete,
  onMove,
  onResize,
  onRotate,
  onSelect
}: {
  element: StickerElement;
  isActive: boolean;
  onDelete: (id: string) => void;
  onMove: (id: string, position: { x: number; y: number }) => void;
  onResize: (id: string, size: number) => void;
  onRotate: (id: string, rotation: number) => void;
  onSelect: (element: StickerElement) => void;
}) {
  const dragRef = useRef<{ originX: number; originY: number; startX: number; startY: number } | null>(null);
  const resizeRef = useRef<{
    originX: number;
    originY: number;
    startSize: number;
  } | null>(null);
  const rotateRef = useRef<{
    centerX: number;
    centerY: number;
    originAngle: number;
    startRotation: number;
  } | null>(null);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      originX: event.clientX,
      originY: event.clientY,
      startX: element.x,
      startY: element.y
    };
    onSelect(element);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;

    if (!drag) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    const shell = event.currentTarget.closest<HTMLElement>("[data-photo-canvas]");
    const rect = shell?.getBoundingClientRect();

    if (!rect) {
      return;
    }

    onMove(element.id, {
      x: clamp(drag.startX + ((event.clientX - drag.originX) / rect.width) * 100, 4, 96),
      y: clamp(drag.startY + ((event.clientY - drag.originY) / rect.height) * 100, 4, 96)
    });
  };

  const endDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    event.stopPropagation();
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    dragRef.current = null;
  };

  const startResize = (event: React.PointerEvent<HTMLSpanElement>) => {
    if (event.button !== 0) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.setPointerCapture(event.pointerId);
    resizeRef.current = {
      originX: event.clientX,
      originY: event.clientY,
      startSize: element.size
    };
    onSelect(element);
  };

  const moveResize = (event: React.PointerEvent<HTMLSpanElement>) => {
    const resize = resizeRef.current;

    if (!resize) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    const delta = Math.max(event.clientX - resize.originX, event.clientY - resize.originY);
    onResize(element.id, clamp(Math.round(resize.startSize + delta), minStickerSize, maxStickerSize));
  };

  const endResize = (event: React.PointerEvent<HTMLSpanElement>) => {
    event.stopPropagation();
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    resizeRef.current = null;
  };

  const overlayWidth = element.aspectRatio >= 1 ? element.size : Math.max(minStickerSize, Math.round(element.size * element.aspectRatio));
  const overlayHeight = element.aspectRatio >= 1 ? Math.max(minStickerSize, Math.round(element.size / element.aspectRatio)) : element.size;

  const startRotate = (event: React.PointerEvent<HTMLSpanElement>) => {
    if (event.button !== 0) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    const overlay = event.currentTarget.closest<HTMLElement>("[data-sticker-overlay]");
    const rect = overlay?.getBoundingClientRect();

    if (!rect) {
      return;
    }

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    event.currentTarget.setPointerCapture(event.pointerId);
    rotateRef.current = {
      centerX,
      centerY,
      originAngle: getPointerAngle(event.clientX, event.clientY, centerX, centerY),
      startRotation: element.rotation
    };
    onSelect(element);
  };

  const moveRotate = (event: React.PointerEvent<HTMLSpanElement>) => {
    const rotate = rotateRef.current;

    if (!rotate) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    const currentAngle = getPointerAngle(event.clientX, event.clientY, rotate.centerX, rotate.centerY);
    const delta = normalizeAngle(currentAngle - rotate.originAngle);
    onRotate(element.id, Math.round(rotate.startRotation + delta));
  };

  const endRotate = (event: React.PointerEvent<HTMLSpanElement>) => {
    event.stopPropagation();
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    rotateRef.current = null;
  };

  return (
    <div
      className={`${styles.stickerOverlay} ${isActive ? styles.active : ""}`}
      data-sticker-overlay
      aria-label={element.name}
      onClick={(event) => {
        event.stopPropagation();
        onSelect(element);
      }}
      onPointerCancel={endDrag}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endDrag}
      style={{
        height: `${overlayHeight}px`,
        left: `${element.x}%`,
        top: `${element.y}%`,
        width: `${overlayWidth}px`,
        rotate: `${element.rotation}deg`
      }}
      role="group"
    >
      <img alt="" className={styles.stickerImage} draggable={false} src={element.src} />
      {isActive ? (
        <>
          <button
            aria-label="删除贴纸"
            className={styles.stickerDeleteButton}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              onDelete(element.id);
            }}
            onPointerDown={(event) => {
              event.preventDefault();
              event.stopPropagation();
            }}
            type="button"
          >
            ×
          </button>
          <span
            aria-hidden="true"
            className={styles.stickerResizeHandle}
            onPointerCancel={endResize}
            onPointerDown={startResize}
            onPointerMove={moveResize}
            onPointerUp={endResize}
          />
          <span
            aria-hidden="true"
            className={styles.stickerRotateHandle}
            onPointerCancel={endRotate}
            onPointerDown={startRotate}
            onPointerMove={moveRotate}
            onPointerUp={endRotate}
          >
            ↻
          </span>
        </>
      ) : null}
    </div>
  );
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function getPointerAngle(pointerX: number, pointerY: number, centerX: number, centerY: number) {
  return (Math.atan2(pointerY - centerY, pointerX - centerX) * 180) / Math.PI;
}

function normalizeAngle(angle: number) {
  return ((angle + 540) % 360) - 180;
}

function AiChatPanel({ onToggleCollapsed }: { onToggleCollapsed: () => void }) {
  return (
    <aside className={styles.aiChatPanel} aria-label="AI 对话修图">
      <div className={styles.aiHead}>
        <div className={styles.aiTitleRow}>
          <h2 className={styles.aiTitle}>AI 对话修图</h2>
          <div className={styles.aiHeadActions}>
            <span className={styles.aiBadge}>剩余 0 次</span>
            <button className={styles.panelToggleButton} onClick={onToggleCollapsed} type="button">
              收起
            </button>
          </div>
        </div>
        <p className={styles.aiDesc}>AI 对话修图暂未开放。基础编辑、裁剪、滤镜、文字、贴纸和边框功能可以先使用。</p>
        <div className={styles.aiCapabilities}>
          {["AI 美颜", "换背景", "细节修复", "局部重绘", "高清增强"].map((capability) => (
            <span className={styles.capability} key={capability}>
              {capability}
            </span>
          ))}
        </div>
      </div>

      <div className={styles.chat}>
        <div className={`${styles.message} ${styles.aiMessage}`}>AI 对话修图暂未开放，基础编辑工具可以先使用。</div>
        <div className={styles.suggestions}>
          {aiSuggestions.map((suggestion) => (
            <button className={styles.suggestion} disabled key={suggestion.title} type="button">
              {suggestion.title}
              <small>{suggestion.detail}</small>
            </button>
          ))}
        </div>
      </div>

      <div className={styles.composer}>
        <div className={styles.composerBox}>
          <textarea disabled placeholder="AI 功能暂未开放，敬请期待！" />
          <div className={styles.composerActions}>
            <button className={styles.miniButton} disabled type="button">
              选择区域
            </button>
            <button className={styles.miniButton} disabled type="button">
              上传参考
            </button>
            <button className={styles.sendButton} disabled type="button">
              生成
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
