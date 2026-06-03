# T104：胡了卜悬台窄腰模板调牌器实现

- 优先级：P1
- 负责人：Lee
- 默认负责人：Lee
- 状态：待验收
- 依赖：T095, T096, T101, T102, T103
- 提出来源：IDEA-20260602-08
- 涉及模块：胡了卜 / 配置驱动试玩原型 / 调牌器 / Web 静态发布副本 / 密集牌山模板
- 主要文件范围：`apps/game/mahjong-roguelike/prototypes/config-playable/index.html`, `apps/web/public/games/hulebu-demo/index.html`, `apps/web/public/games/hulebu-demo/tuner.html`, `packages/shared/src/mahjong-config-playable-prototype.test.ts`, `packages/shared/src/mahjong-config.test.ts`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/items/T104-hulebu-suspended-waist-template.md`, `docs/tasks/claims/T104-lee.md`, `docs/tasks/NEXT_ID.md`, `docs/superpowers/plans/2026-06-02-hulebu-suspended-waist-template.md`, `docs/modules/mahjong-roguelike/README.md`, `docs/modules/mahjong-roguelike/PROGRESS.md`, `docs/modules/mahjong-roguelike/HANDOFF.md`, `docs/progress/2026-06-02-lee.md`, `docs/completion/**`
- 禁止修改文件：`apps/game/mahjong-roguelike/cocos/**`, `apps/game/mahjong-roguelike/config/**`, `packages/shared/src/mahjong-mountain-generator.ts`, `apps/web/src/app/tools/**`, `apps/web/src/modules/tools/**`, `apps/web/src/components/tools/**`, `apps/web/src/lib/ai/**`, `apps/web/src/lib/analytics/**`, `deploy/**`, `docker-compose.yml`, `docker-compose.prod.yml`
- 验证方式：`npm run test -w packages/shared -- mahjong-config-playable-prototype`; `npm run test -w packages/shared -- mahjong-config`; `perl -0ne 'print $1 if /<script>([\s\S]*?)<\/script>/' apps/game/mahjong-roguelike/prototypes/config-playable/index.html > /tmp/hulebu-config-playable-script.js && node --check /tmp/hulebu-config-playable-script.js`; `npm run test -w apps/web -- hulebu`; 通过 Kimi WebBridge 或 Codex App 内置浏览器打开 `/games/hulebu-demo/tuner.html?template=suspended-waist` 检查调牌器可渲染；390px 移动端截图检查牌面、记牌器、动作栏、卡槽和底部道具不遮挡；`npm run docs:sync`; `rg -n "T[B]D|T[O]DO|待[补]" docs/tasks/items/T104-hulebu-suspended-waist-template.md docs/tasks/claims/T104-lee.md docs/superpowers/plans/2026-06-02-hulebu-suspended-waist-template.md docs/modules/mahjong-roguelike/README.md docs/modules/mahjong-roguelike/PROGRESS.md docs/modules/mahjong-roguelike/HANDOFF.md docs/progress/2026-06-02-lee.md`; `git diff --check`

## 背景

T103 已确认高堆叠参考图可以抽象成胡了卜自己的 `悬台窄腰 / suspended-waist` 模板。当前任务进入第一步实现：只把模板接入 HTML 原型和站内调牌器，不把它加入默认朋友试玩 auto 随机池。

## 目标

- 新增 `suspended-waist` 模板 ID 和中文名 `悬台窄腰`。
- 调牌器下拉和 URL 参数支持 `template=suspended-waist`。
- 模板锚点包含顶部平台、窄腰、支撑柱和侧向散牌四类结构。
- 指定模板生成后仍保持首轮可点 3-8 张，同组首轮最多露出 2 张。
- 默认玩家页 auto 模板池暂不包含该模板，避免影响当前发布试玩版。
- 同步站内静态副本，让 `/games/hulebu-demo/tuner.html?template=suspended-waist` 可用于验证。

## 不做

- 不修改 Cocos 正式工程。
- 不修改共享 Graph-based 生成器。
- 不把 `suspended-waist` 加入默认玩家页 auto 随机池。
- 不修改牌河、补杠、杠/胡震落数量、记牌器或动作栏。
- 不重做最终美术、动画、音效或牌面资源。

## 验收标准

- 静态测试锁定 `suspended-waist` 模板 ID、中文名和结构区域字段。
- VM 测试指定 `template=suspended-waist` 能生成密集牌山。
- 生成结果首轮可点 3-8 张，首轮没有完整 `solutionGroup` 直接露出。
- 默认玩家页 auto 终局随机模板测试不包含 `suspended-waist`。
- 站内静态副本已同步，并保留 `/games/hulebu-demo/config/*.json` 绝对 fetch 路径。
- 浏览器可打开调牌器并渲染该模板，移动端无横向溢出。
- 测试、脚本语法、文档同步、占位符扫描和 diff 检查通过。

## 进展

- 2026-06-02：已创建任务并领取，准备按 TDD 新增 `悬台窄腰 / suspended-waist` 调牌器模板。
- 2026-06-02：已按 TDD 接入 `suspended-waist` 模板，调牌器和 URL 参数可选；默认玩家页 auto 随机池仍不包含该模板。
- 2026-06-02：模板包含 `top-platform / waist / support-column / side-scatter` 四类结构区域，生成后首轮可点 8 张、同一 `solutionGroup` 最多露出 2 张。
- 2026-06-02：已同步 `/games/hulebu-demo/` 静态副本并保留发布配置绝对路径；Kimi WebBridge 与 390px 截图验证通过，等待 Lee 验收。
