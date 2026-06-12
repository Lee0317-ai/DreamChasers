# T160：工具站冰视频背景延展

- 优先级：P1
- 负责人：Lee
- 状态：已完成
- 依赖：T159
- 创建日期：2026-06-12
- 来源：Lee 确认首页冰火视频效果后，希望进入工具站也沿用冰视频作为整页背景
- 涉及模块：工具频道页 / 公开门户入口 / Naturecore 视觉系统
- 主要文件范围：`apps/web/src/components/ChannelPage.tsx`, `apps/web/src/app/globals.css`, `docs/tasks/**`, `docs/progress/2026-06-12-lee.md`, `docs/completion/**`
- 验证方式：`npm run typecheck -w apps/web`; `npm run build -w apps/web`; `npm run docs:sync`; `git diff --check`; 桌面端和移动端浏览器检查 `/tools`

## 目标

- `/tools` 频道页沿用 T159 的冰视频作为整页背景。
- 工具卡片、筛选、搜索和页头在视频背景上保持清晰可读。
- 只影响工具频道聚合页，不改工具工作台、游戏频道或业务逻辑。

## 不做

- 不修改 `/games`、账号中心、认证页或工具工作台内部页面。
- 不新增工具数据或改工具业务逻辑。
- 不引入新的远程素材。

## 实现记录

- `ChannelPage` 在 `variant="tools"` 时渲染 `station-video-bg` 视频层，引用 T159 已引入的 `/videos/home/ice-portal.mp4`。
- 工具频道页的视频层使用 `autoplay`、`muted`、`loop`、`playsInline`，作为固定整页背景。
- `.tools-station` 增加暗色遮罩和冷色光感，确保页头、搜索框、筛选和工具卡片在视频背景上保持可读。
- 未修改游戏频道、工具工作台或工具业务逻辑。

## 验证结果

- `npm run typecheck -w apps/web`：通过。
- `npm run build -w apps/web`：通过。
- 右侧内置浏览器检查 `/tools`：
  - 默认视口：1 个冰视频背景自动播放，7 张工具卡片正常渲染，无横向溢出；
  - 1280 x 820：视频自动播放，页头和卡片区正常，无横向溢出；
  - 390 x 844：视频自动播放，首张卡片和页头正常，无横向溢出。
- `npm run docs:sync`：通过。
- T160 相关文件限定 `git diff --check`：通过。
