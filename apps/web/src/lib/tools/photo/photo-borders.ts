export type PhotoBorderId =
  | "none"
  | "minimal-white"
  | "thin-black"
  | "polaroid"
  | "film"
  | "rounded-frame"
  | "shadow-card";

export type PhotoBorderPreset = {
  id: PhotoBorderId;
  name: string;
  description: string;
  color: string;
  radius: number;
  width: number;
};

export const photoBorderPresets: PhotoBorderPreset[] = [
  {
    id: "none",
    name: "无边框",
    description: "保留原图边缘",
    color: "transparent",
    radius: 4,
    width: 0
  },
  {
    id: "minimal-white",
    name: "极简白边",
    description: "干净留白",
    color: "#ffffff",
    radius: 8,
    width: 28
  },
  {
    id: "thin-black",
    name: "细黑边",
    description: "清晰描边",
    color: "#111111",
    radius: 4,
    width: 8
  },
  {
    id: "polaroid",
    name: "拍立得",
    description: "底部大留白",
    color: "#fffaf0",
    radius: 6,
    width: 28
  },
  {
    id: "film",
    name: "胶片边",
    description: "复古齿孔",
    color: "#111111",
    radius: 4,
    width: 18
  },
  {
    id: "rounded-frame",
    name: "圆角相框",
    description: "柔和卡片",
    color: "#f8fafc",
    radius: 28,
    width: 22
  },
  {
    id: "shadow-card",
    name: "阴影卡片",
    description: "轻微立体",
    color: "#ffffff",
    radius: 18,
    width: 18
  }
];
