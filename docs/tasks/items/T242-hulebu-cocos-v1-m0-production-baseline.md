# T242：胡了卜 Cocos v1 M0 production build 基线

- 优先级：P0
- 默认负责人：Lee
- 状态：进行中
- 依赖：T241
- 主要文件范围：`apps/game/mahjong-roguelike/release/hulebu-v1.release.json`, `apps/game/mahjong-roguelike/scripts/hulebu-cocos-release.cjs`, `apps/game/mahjong-roguelike/scripts/build-hulebu-cocos.cjs`, `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/README.md`, `apps/game/mahjong-roguelike/prototypes/config-playable/LEGACY.md`, `apps/web/public/games/hulebu-demo/LEGACY.md`, `packages/shared/src/hulebu-cocos-release.test.ts`, `package.json`, `docs/superpowers/plans/2026-07-11-hulebu-cocos-v1-m0-production-baseline.md`, `docs/tasks/items/T242-hulebu-cocos-v1-m0-production-baseline.md`, `docs/tasks/claims/T242-lee.md`, `docs/progress/2026-07-11-lee.md`, `docs/completion/2026-07-11-task-242-hulebu-cocos-v1-m0-production-baseline.md`, 以及 `npm run docs:sync` 自动更新的任务主文档摘要区
- 禁止修改范围：`apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/**`, Cocos `settings/**`, `apps/web/src/modules/games/hulebu/HulebuGamePage.tsx`, `apps/web/src/modules/games/hulebu/HulebuGamePage.module.css`, `apps/web/prisma/**`, 账号 API、PDF 工具箱、AI 修图工具、其他游戏模块
- 验证方式：`npm run test -w packages/shared -- hulebu-cocos-release mahjong-cocos-project`; `npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`; `npm run game:hulebu:build`; `npm run docs:sync`; `git diff --check`

## 目标

- 用版本化 release config 定义 Cocos Creator、平台、非 debug、产物目录、必需文件和 HTTP smoke 路径。
- 建立可单测的产物校验与 HTTP smoke 库，拒绝缺文件、坏 JSON、空资源和路径穿越。
- 建立一条 production build 命令；只有当日志含 Finished、产物完整且 HTTP smoke 通过时，才允许对白名单退出码 36 归一化为成功。
- 写入可追踪的 `hulebu-build.json`，包含 commit、内容版本、存档 schema、原始 Creator 退出码、文件数和字节数。
- 将 Web demo 与 HTML 原型明确标记为 legacy reference，不删除或改写现有试玩代码。

## 不做

- 不切换 `/games/hulebu` 到 Cocos build；M0 只建立可靠产物，正式宿主切换在后续独立任务完成。
- 不移动或删除 `public/games/hulebu-demo/**`，避免当前脏工作树丢失未提交内容。
- 不拆 Controller、不改规则、关卡、UI、音频或存档实现。

## 验收标准

- 发布单测先红后绿，覆盖缺失产物、坏 JSON、exit 36 白名单、manifest 和 HTTP smoke。
- `npm run game:hulebu:build` 在本机生成完整非 debug `web-mobile` 产物并返回 0；报告保留 Creator 原始退出码。
- 构建产物可经本地 HTTP 读取 `/`、`/src/settings.json`、`/src/import-map.json`、`/assets/main/config.json`、`/assets/resources/config.json`。
- 构建脚本不把 36 视为无条件成功，也不触碰 `assets/**` 或现有用户改动。
