# T096：胡了卜玩家页布局、牌面放大和模板随机调参

- 优先级：P1
- 负责人：Lee
- 默认负责人：Lee
- 状态：待验收
- 依赖：T092, T093, T095
- 提出来源：IDEA-20260601-05
- 涉及模块：胡了卜 / 配置驱动试玩原型 / 玩家页 HUD / 密集牌山模板
- 主要文件范围：`apps/game/mahjong-roguelike/prototypes/config-playable/index.html`, `packages/shared/src/mahjong-config-playable-prototype.test.ts`, `packages/shared/src/mahjong-config.test.ts`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/items/T096-hulebu-play-layout-larger-random-template.md`, `docs/tasks/claims/T096-lee.md`, `docs/tasks/NEXT_ID.md`, `docs/modules/mahjong-roguelike/README.md`, `docs/modules/mahjong-roguelike/PROGRESS.md`, `docs/modules/mahjong-roguelike/HANDOFF.md`, `docs/progress/2026-06-01-lee.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/completion/**`
- 验证方式：`npm run test -w packages/shared -- mahjong-config-playable-prototype`; `npm run test -w packages/shared -- mahjong-config`; `perl -0ne 'print $1 if /<script>([\s\S]*?)<\/script>/' apps/game/mahjong-roguelike/prototypes/config-playable/index.html > /tmp/hulebu-config-playable-script.js && node --check /tmp/hulebu-config-playable-script.js`; 通过 Kimi WebBridge 或 Codex App 内置浏览器打开默认玩家页检查桌面布局、第 5 关牌面大小、首轮可点和模板随机；390px 移动视口检查无横向溢出；`npm run docs:sync`; `rg -n "T[B]D|T[O]DO|待[补]" docs/tasks/items/T096-hulebu-play-layout-larger-random-template.md docs/tasks/claims/T096-lee.md docs/modules/mahjong-roguelike/README.md docs/modules/mahjong-roguelike/PROGRESS.md docs/modules/mahjong-roguelike/HANDOFF.md docs/progress/2026-06-01-lee.md`; `git diff --check`

## 背景

T095 修正了顺序答案问题后，Lee 继续试玩默认玩家页，反馈当前页面整体布局仍不舒服，牌面仍偏小，且牌山模板需要随机，避免每关模板固定导致重复感强。

## 目标

- 默认玩家页收敛为更明确的竖屏游戏面板。
- 放大密集牌山规则牌面和点击热区。
- 保持顶部 HUD、牌桌、卡槽/组合区和道具栏不互相挤压。
- 默认玩家页普通密集关的 `auto` 模板按 seed/重开随机选择。
- 调牌器继续允许手动指定模板。
- 首轮可点仍控制在 3-8 张。

## 不做

- 不实现 T094 的残局收官、牌引、牌河。
- 不实现记牌器和丢弃选择。
- 不修改 Cocos 工程。
- 不修改共享 Graph-based 生成器。
- 不修改正式关卡 JSON 或最终 UI 美术。
- 不扩大到 Web 站、PDF、AI 修图或部署范围。

## 验收标准

- 默认玩家页桌面和 390px 移动视口不横向溢出。
- 顶部 HUD、牌桌、卡槽/组合区和道具栏在首屏结构中不互相覆盖。
- 密集牌山规则牌尺寸大于 T095 的 `45x60`。
- 普通密集关默认 `auto` 模板在同一关不同 seed/重开下能出现不同模板。
- 调牌器指定 `template=ring` 等仍生效。
- 第 5 关首轮可点仍保持 3-8 张。
- 共享测试、HTML 脚本语法检查、浏览器检查、文档同步和 diff 检查通过。

## 进展

- 2026-06-01：已创建任务并领取，开始复现默认玩家页布局、牌面大小和模板固定问题。

## 完成内容

- 默认玩家页进一步收紧为一屏试玩布局：玩家页主栏 `480px`，右侧道具栏 `72px`，顶部 HUD、牌桌、卡槽和道具栏在 1512x682 桌面视口下不再产生横向或纵向溢出。
- 密集牌山规则牌尺寸从 `45x60` 放大到 `52x70`，玩家页实测牌面约 `37x49`，可读性和点击热区比 T095 更大。
- 默认普通密集关 `auto` 模板改为按 seed/重开随机选择，并增加 auto 候选回退：如果候选模板生成失败或首轮可点超过 8，会按确定顺序尝试下一个安全模板。
- 调牌器仍保留完整 8 个模板手动指定能力；玩家页 auto 当前使用经过试玩边界验证的 `ring / islands / canyon` 候选池。
- 牌山主堆权重从 `1.8` 提高到 `2.45`，让多数牌更集中在几个主牌山中，减少空旷感。

## 验证结果

- `npm run test -w packages/shared -- mahjong-config-playable-prototype` 通过。
- `npm run test -w packages/shared -- mahjong-config` 通过，2 个测试文件 28 个测试通过。
- HTML 脚本 `node --check` 通过。
- Kimi WebBridge 打开第 5 关 `seed=epsilon` 验证通过：1512x682 视口无横向/纵向溢出，牌桌约 `396x452`，牌面约 `37x49`，生成 240 张、实际可见 43 张、首轮可点 8 张，标题显示随机后的 `环形` 模板。
