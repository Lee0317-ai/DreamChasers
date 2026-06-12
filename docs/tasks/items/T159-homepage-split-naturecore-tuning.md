# T159：首页 Naturecore 左右分区回调

- 优先级：P1
- 负责人：Lee
- 状态：已完成
- 依赖：T158
- 创建日期：2026-06-12
- 来源：Lee 反馈 T158 内页还行，但首页需要回到斜线左右分区，并强化冰与火对比
- 涉及模块：首页 / 公开门户入口 / Naturecore 视觉系统
- 主要文件范围：`apps/web/src/components/HomeExperience.tsx`, `apps/web/src/app/globals.css`, `apps/web/public/videos/home/**`, `docs/tasks/**`, `docs/progress/2026-06-12-lee.md`, `docs/completion/**`
- 验证方式：`npm run typecheck -w apps/web`; `npm run build -w apps/web`; `npm run docs:sync`; `git diff --check`; 桌面端和移动端浏览器检查 `/`

## 目标

- 保留 T158 的全站内页 Naturecore 控制台风格。
- 将首页从中央双卡片入口调整回左右分区入口。
- 左侧明确代表工具站，右侧明确代表游戏馆。
- 去掉中间 `OR`，以冰与火真实视频背景形成更强视觉对比。
- 保留深色质感、玻璃按钮、斜线切割和 hover 动效。

## 不做

- 不修改 `/tools`、`/games`、账号中心、认证页或工具工作台内页风格。
- 不改 AI Gateway、Prisma、TimePick 外部仓库或工具业务逻辑。
- 不重新走全站视觉方案选择。

## 实现记录

- 首页已从 T158 的中央双入口卡片调整为斜线切割左右分区结构：
  - 左侧为 `效率工具箱`，链接 `/tools`；
  - 右侧为 `休闲游戏馆`，链接 `/games`；
- 中间 `OR` 已移除，左右分区直接碰撞。
- 新增 Lee 提供的首页视频背景：
  - `apps/web/public/videos/home/ice-portal.mp4`；
  - `apps/web/public/videos/home/fire-portal.mp4`。
- 两侧使用 `video` 作为真实动态背景，配置 `autoplay`、`muted`、`loop`、`playsInline`，只保留暗色遮罩和冷暖光感。
- 保留玻璃按钮和 hover 光扫，但去掉复杂中心标题与背景装饰。
- 移动端保持上下堆叠，避免横向挤压。
- 未修改内页、账号中心、认证页、工具工作台或业务逻辑。

## 验证结果

- `npm run typecheck -w apps/web`：通过。
- `npm run build -w apps/web`：通过。
- 右侧内置浏览器检查 `/`：
  - 默认右侧浏览器：斜线首页存在，2 个入口，使用本地冰/火视频，无 `OR`，两个视频自动播放，无横向溢出；
  - 1280 x 820：左工具、右游戏，斜线切割，两个视频自动播放，无横向溢出；
  - 390 x 844：上下堆叠，火焰主体可见，无横向溢出。
- `npm run docs:sync`：待补充。
- `git diff --check`：待补充。
