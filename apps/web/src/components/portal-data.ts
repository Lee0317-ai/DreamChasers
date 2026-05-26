export type PortalItem = {
  id: string;
  title: string;
  description: string;
  icon: string;
  href?: string;
  tags: string[];
  categories: string[];
  status?: "ready" | "coming";
  detailsTitle: string;
  details: string[];
  footnote?: string;
};

export const toolItems: PortalItem[] = [
  {
    id: "pdf",
    title: "PDF 工具箱",
    description: "合并、拆分、旋转、转图片、转 Word、添加水印与签名、基础压缩。全部免费，浏览器内完成。",
    icon: "PDF",
    tags: ["免费", "文档处理"],
    categories: ["doc"],
    detailsTitle: "PDF 工具箱",
    href: "/tools/pdf-toolbox",
    details: [
      "PDF 预览、合并、拆分",
      "删除页面、页面排序、页面旋转",
      "PDF 转图片、图片转 PDF",
      "PDF 转 Word（Beta）",
      "添加水印、添加签名",
      "基础压缩"
    ],
    footnote: "扫描版 PDF 转 Word 需要 OCR，后续归入 AI 能力支持限次免费。"
  },
  {
    id: "photo",
    title: "AI 修图工具",
    description: "亮度、对比度、饱和度、裁剪、滤镜、加贴纸与文字。AI 能力限次免费：美颜、换背景、细节修复。",
    icon: "IMG",
    href: "/tools/ai-photo-editor",
    tags: ["免费", "AI 能力", "图像处理"],
    categories: ["img", "ai"],
    detailsTitle: "AI 修图工具",
    details: [
      "亮度、对比度、饱和度、色温",
      "裁剪、旋转、缩放",
      "滤镜、加边框、加贴纸、加文字",
      "马赛克、手动处理自己图片中的遮挡、瑕疵或不需要的局部元素",
      "AI 美颜、细节修复、局部重绘",
      "AI 换背景、高清增强、批量 AI 处理"
    ]
  },
  {
    id: "converter",
    title: "格式转换器",
    description: "Word、Excel、PPT、图片、PDF 互相转换，批量处理。",
    icon: "CVT",
    tags: ["敬请期待", "文档处理"],
    categories: ["doc", "convert"],
    status: "coming",
    detailsTitle: "敬请期待",
    details: ["该工具正在开发中，即将上线。", "你可以先体验已上线的 PDF 工具箱和 AI 修图工具。"]
  },
  {
    id: "chart",
    title: "图表生成器",
    description: "粘贴数据快速生成柱状图、折线图、饼图，支持导出图片和 PPT。",
    icon: "DAT",
    tags: ["敬请期待", "文档处理"],
    categories: ["doc"],
    status: "coming",
    detailsTitle: "敬请期待",
    details: ["该工具正在开发中，即将上线。", "后续会围绕办公场景补充更多轻量工具。"]
  },
  {
    id: "qr",
    title: "二维码工具",
    description: "生成网址、文本、名片、Wi-Fi 二维码，支持自定义颜色和 Logo。",
    icon: "QR",
    tags: ["敬请期待", "文档处理"],
    categories: ["doc"],
    status: "coming",
    detailsTitle: "敬请期待",
    details: ["该工具正在开发中，即将上线。", "你可以先使用 AI 搜索描述当前需求。"]
  },
  {
    id: "gif",
    title: "GIF 制作器",
    description: "视频转 GIF、图片合成 GIF、调整帧率与尺寸、添加文字贴纸。",
    icon: "GIF",
    tags: ["敬请期待", "图像处理"],
    categories: ["img"],
    status: "coming",
    detailsTitle: "敬请期待",
    details: ["该工具正在开发中，即将上线。", "图像工具会优先补齐轻量编辑和浏览器内处理。"]
  }
];

export const gameItems: PortalItem[] = [
  {
    id: "mahjong",
    title: "麻将 Roguelike 消除",
    description: "堆叠麻将、点击进槽、碰吃杠消除。每过一关选一个 Roguelike 奖励，20 关等你挑战。",
    icon: "M",
    tags: ["免费", "益智", "策略"],
    categories: ["puzzle", "strategy"],
    detailsTitle: "麻将 Roguelike 消除",
    details: [
      "点击可选麻将牌进入下方槽位",
      "三张相同（碰）、同花色连续三张（吃）、四张相同（杠）即可消除",
      "槽位满了则失败，清空牌面过关",
      "每关从 3 个 Roguelike 奖励中选择 1 个",
      "第一阶段规划 20 关和 20 个奖励"
    ],
    footnote: "Web 试玩会先接入站内入口，正式小游戏发布优先走 Cocos Creator。"
  },
  {
    id: "sudoku",
    title: "数独大师",
    description: "经典数独，每日新题，4 种难度。支持笔记模式和提示功能。",
    icon: "9",
    tags: ["敬请期待", "益智"],
    categories: ["puzzle"],
    status: "coming",
    detailsTitle: "敬请期待",
    details: ["该游戏正在开发中，即将上线。", "你可以先体验麻将 Roguelike 消除。"]
  },
  {
    id: "connect",
    title: "连连看",
    description: "经典连连看玩法，多种主题和关卡，支持限时挑战和无尽模式。",
    icon: "LL",
    tags: ["敬请期待", "休闲"],
    categories: ["casual"],
    status: "coming",
    detailsTitle: "敬请期待",
    details: ["该游戏正在开发中，即将上线。", "后续会补充更多碎片时间轻量玩法。"]
  },
  {
    id: "tower",
    title: "极简塔防",
    description: "布置防御塔抵御敌人，多种塔型和升级路线，策略深度十足。",
    icon: "TD",
    tags: ["敬请期待", "策略"],
    categories: ["strategy"],
    status: "coming",
    detailsTitle: "敬请期待",
    details: ["该游戏正在开发中，即将上线。", "游戏频道会优先保证 Web 试玩体验。"]
  },
  {
    id: "story",
    title: "文字冒险",
    description: "选择决定命运，多分支剧情，轻松有趣的短篇互动故事。",
    icon: "TXT",
    tags: ["敬请期待", "休闲"],
    categories: ["casual"],
    status: "coming",
    detailsTitle: "敬请期待",
    details: ["该游戏正在开发中，即将上线。", "短篇互动内容会作为后续候选方向。"]
  }
];

export const searchItems = [
  {
    href: "/tools/pdf-toolbox",
    icon: "PDF",
    title: "PDF 工具箱",
    description: "合并、拆分、转 Word、加水印",
    tag: "工具"
  },
  {
    href: "/tools/ai-photo-editor",
    icon: "IMG",
    title: "AI 修图工具",
    description: "亮度、对比度、滤镜、AI 美颜",
    tag: "工具"
  },
  {
    href: "/games#mahjong",
    icon: "M",
    title: "麻将 Roguelike 消除",
    description: "组合消除、局内奖励、轻策略",
    tag: "游戏"
  }
];
