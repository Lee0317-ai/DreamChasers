import { buildFilterCss, type PhotoFilterId } from "./photo-filters";

export type PhotoPreviewAdjustment = {
  brightness: number;
  contrast: number;
  saturation: number;
  temperature: number;
  rotate: number;
  zoom: number;
};

export type PhotoPreviewPan = {
  x: number;
  y: number;
};

export type PhotoPreviewFilter = {
  id: PhotoFilterId;
  strength: number;
};

export type PhotoCropRect = {
  height: number;
  left: number;
  top: number;
  width: number;
};

export function buildPhotoPreviewStyle(adjustment: PhotoPreviewAdjustment, pan: PhotoPreviewPan, filter: PhotoPreviewFilter) {
  const temperatureFilter =
    adjustment.temperature === 0
      ? ""
      : ` sepia(${Math.abs(adjustment.temperature) * 0.18}%) hue-rotate(${adjustment.temperature > 0 ? "-8deg" : "8deg"})`;
  const filterCss = buildFilterCss(filter.id, filter.strength);

  return {
    filter: `brightness(${100 + adjustment.brightness}%) contrast(${100 + adjustment.contrast}%) saturate(${100 + adjustment.saturation}%)${temperatureFilter} ${filterCss}`,
    transform: `translate(${pan.x}px, ${pan.y}px) scale(${adjustment.zoom / 100}) rotate(${adjustment.rotate}deg)`
  };
}

export function buildAppliedCropStyle(crop: PhotoCropRect | null) {
  if (!crop) {
    return {
      imageStyle: {},
      shellStyle: {}
    };
  }

  return {
    imageStyle: {
      height: `${10000 / crop.height}%`,
      left: `${(-crop.left / crop.width) * 100}%`,
      top: `${(-crop.top / crop.height) * 100}%`,
      width: `${10000 / crop.width}%`
    },
    shellStyle: {
      aspectRatio: `${crop.width} / ${crop.height}`
    }
  };
}
