# T161：游戏站火视频背景延展

- 优先级：P1
- 负责人：Lee
- 状态：已完成
- 依赖：T159, T160
- 创建日期：2026-06-12
- 来源：Lee 希望游戏站也沿用首页火视频作为整页背景
- 涉及模块：游戏频道页 / 公开门户入口 / Naturecore 视觉系统
- 主要文件范围：`apps/web/src/components/ChannelPage.tsx`, `apps/web/src/app/globals.css`, `docs/tasks/**`, `docs/progress/2026-06-12-lee.md`, `docs/completion/**`
- 验证方式：`npm run typecheck -w apps/web`; `npm run build -w apps/web`; `npm run docs:sync`; `git diff --check`; 桌面端和移动端浏览器检查 `/games`

## 目标

- `/games` 频道页沿用 T159 的火视频作为整页背景。
- 游戏卡片、筛选、搜索和页头在火焰背景上保持清晰可读。
- 只影响游戏频道聚合页，不改具体游戏页或业务逻辑。

## 不做

- 不修改 `/tools` 之外的工具工作台内部页面。
- 不修改具体游戏页面或游戏逻辑。
- 不引入新的远程素材。

## 实现记录

- `ChannelPage` 根据 `variant` 选择频道背景视频：工具站使用冰视频，游戏站使用火视频。
- `/games` 频道页渲染 `/videos/home/fire-portal.mp4` 作为固定整页背景。
- 游戏频道增加火色视频专属遮罩，确保页头、搜索框、筛选和游戏卡片在火焰背景上保持可读。
- 未修改具体游戏页或游戏逻辑。

## 验证结果

- `npm run typecheck -w apps/web`：通过。
- `npm run build -w apps/web`：通过。
- 右侧内置浏览器检查 `/games`：
  - 默认视口：1 个火视频背景自动播放，5 张游戏卡片正常渲染，无横向溢出；
  - 1280 x 820：视频自动播放，页头和卡片区正常，无横向溢出；
  - 390 x 844：视频自动播放，首张卡片和页头正常，无横向溢出。
- `npm run docs:sync`：通过。
- T161 相关文件限定 `git diff --check`：通过。
