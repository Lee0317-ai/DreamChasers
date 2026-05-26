export type PhotoFilterId = "natural" | "clear" | "warm" | "film" | "mono" | "vintage" | "cool" | "vivid";

export type PhotoFilter = {
  id: PhotoFilterId;
  name: string;
  previewClass: string;
  sampleValue: number;
};

export type FilterTuning = {
  brightness?: number;
  contrast?: number;
  hueRotate?: number;
  saturate?: number;
  sepia?: number;
};

export const photoFilters: PhotoFilter[] = [
  { id: "natural", name: "自然", previewClass: "filterThumb1", sampleValue: 38 },
  { id: "clear", name: "清透", previewClass: "filterThumb2", sampleValue: 24 },
  { id: "warm", name: "暖调日常", previewClass: "filterThumb3", sampleValue: 16 },
  { id: "film", name: "胶片感", previewClass: "filterThumb4", sampleValue: 31 },
  { id: "mono", name: "黑白", previewClass: "filterThumb5", sampleValue: 52 },
  { id: "vintage", name: "复古", previewClass: "filterThumb6", sampleValue: 44 },
  { id: "cool", name: "冷调", previewClass: "filterThumb7", sampleValue: 28 },
  { id: "vivid", name: "鲜艳", previewClass: "filterThumb8", sampleValue: 63 }
];

const filterTunings: Record<PhotoFilterId, FilterTuning> = {
  natural: {
    brightness: 0,
    contrast: 0,
    saturate: 0
  },
  clear: {
    brightness: 18,
    contrast: 14,
    saturate: -30
  },
  warm: {
    brightness: 8,
    contrast: 12,
    hueRotate: -8,
    saturate: 22,
    sepia: 38
  },
  film: {
    brightness: -4,
    contrast: 28,
    hueRotate: 18,
    saturate: 34,
    sepia: 24
  },
  mono: {
    contrast: 22,
    saturate: -100
  },
  vintage: {
    brightness: -6,
    contrast: 18,
    hueRotate: -12,
    saturate: -18,
    sepia: 52
  },
  cool: {
    brightness: 2,
    contrast: 12,
    hueRotate: 28,
    saturate: -8
  },
  vivid: {
    brightness: 6,
    contrast: 22,
    saturate: 56
  }
};

function mix(base: number, delta: number | undefined, strength: number) {
  return base + (delta ?? 0) * (strength / 100);
}

export function buildFilterCss(filterId: PhotoFilterId, strength: number) {
  const tuning = getFilterTuning(filterId, strength);

  return [
    `brightness(${tuning.brightness}%)`,
    `contrast(${tuning.contrast}%)`,
    `saturate(${tuning.saturate}%)`,
    `sepia(${tuning.sepia}%)`,
    `hue-rotate(${tuning.hueRotate}deg)`
  ].join(" ");
}

export function getFilterTuning(filterId: PhotoFilterId, strength: number): Required<FilterTuning> {
  const tuning = filterTunings[filterId];
  const safeStrength = Math.min(Math.max(strength, 0), 100);

  return {
    brightness: mix(100, tuning.brightness, safeStrength),
    contrast: mix(100, tuning.contrast, safeStrength),
    hueRotate: mix(0, tuning.hueRotate, safeStrength),
    saturate: mix(100, tuning.saturate, safeStrength),
    sepia: mix(0, tuning.sepia, safeStrength)
  };
}
