export type PhotoToolId =
  | "adjust"
  | "crop"
  | "filter"
  | "text"
  | "sticker"
  | "border"
  | "beauty"
  | "background"
  | "repair"
  | "enhance";

export type PhotoTool = {
  id: PhotoToolId;
  name: string;
  description: string;
  group: "basic" | "creative" | "ai";
  icon: string;
  cost?: number;
  modeLabel: string;
  panelDescription: string;
};

export type ToolGroup = {
  id: PhotoTool["group"];
  title: string;
  aside?: string;
};

export const toolGroups: ToolGroup[] = [
  { id: "basic", title: "基础编辑" },
  { id: "creative", title: "创意元素" },
  { id: "ai", title: "AI 工具", aside: "消耗额度" }
];

export const photoTools: PhotoTool[] = [
  {
    id: "adjust",
    name: "调整",
    description: "亮度、对比、饱和、色温",
    group: "basic",
    icon: "AD",
    modeLabel: "手动参数",
    panelDescription: "控制图片的亮度、对比度、饱和度与色温。所有改动都可以撤销。"
  },
  {
    id: "crop",
    name: "裁剪与旋转",
    description: "比例、旋转构图",
    group: "basic",
    icon: "CR",
    modeLabel: "裁剪模式",
    panelDescription: "设置画面比例和旋转角度，重新组织构图。"
  },
  {
    id: "filter",
    name: "滤镜",
    description: "自然、清透、胶片感",
    group: "basic",
    icon: "FI",
    modeLabel: "滤镜预览",
    panelDescription: "选择滤镜并控制强度，快速确定图片的整体氛围。"
  },
  {
    id: "text",
    name: "文字",
    description: "标题、说明、日期水印",
    group: "creative",
    icon: "TX",
    modeLabel: "文字编辑",
    panelDescription: "添加标题、说明、日期或水印文字，并调整字号与颜色。"
  },
  {
    id: "sticker",
    name: "贴纸",
    description: "表情、标注、装饰元素",
    group: "creative",
    icon: "ST",
    modeLabel: "贴纸",
    panelDescription: "添加标注、箭头和装饰贴纸，让图片表达更清楚。"
  },
  {
    id: "border",
    name: "边框",
    description: "白边、相框、胶片边",
    group: "creative",
    icon: "BD",
    modeLabel: "边框",
    panelDescription: "为图片添加白边、相框或胶片边框。"
  },
  {
    id: "beauty",
    name: "AI 美颜",
    description: "自然肤色、细节保留",
    group: "ai",
    icon: "BE",
    cost: 1,
    modeLabel: "AI 结果对比",
    panelDescription: "自然优化肤色与细节，消耗 1 次 AI 免费额度。"
  },
  {
    id: "background",
    name: "AI 换背景",
    description: "浅色、自然、纯色背景",
    group: "ai",
    icon: "BG",
    cost: 1,
    modeLabel: "AI 结果对比",
    panelDescription: "通过描述生成新背景，消耗 1 次 AI 免费额度。"
  },
  {
    id: "repair",
    name: "AI 细节修复",
    description: "瑕疵、遮挡、纹理补全",
    group: "ai",
    icon: "RP",
    cost: 1,
    modeLabel: "AI 结果对比",
    panelDescription: "选择区域后智能修复遮挡、瑕疵、水印或不需要的局部元素，消耗 1 次 AI 免费额度。"
  },
  {
    id: "enhance",
    name: "高清增强",
    description: "提高清晰度与分辨率",
    group: "ai",
    icon: "HD",
    cost: 1,
    modeLabel: "AI 结果对比",
    panelDescription: "提升图片清晰度和分辨率，消耗 1 次 AI 免费额度。"
  }
];

export const aiSuggestions = [
  {
    title: "让画面更明亮清透，但不要过曝",
    detail: "使用手动参数即可，不消耗 AI 额度"
  },
  {
    title: "修复右下角局部遮挡，并保持纹理自然",
    detail: "消耗 1 次 AI 免费额度"
  },
  {
    title: "把背景换成干净的浅灰色",
    detail: "消耗 1 次 AI 免费额度"
  }
];
