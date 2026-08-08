# 胡了卜 Cocos 正式 UI 重制实施计划

> **供代理执行：** 必须逐任务执行本计划；每个任务使用测试驱动开发，在提交前运行验证技能要求的命令。步骤使用复选框跟踪。

**目标：** 以用户提供的参考图为唯一视觉基准，交付固定 `390×844` 竖屏的胡了卜正式 UI 资源，并接入 Cocos 生产包。

**架构：** 资源生成层输出带 manifest 和校验报告的 RGBA PNG；Cocos 接入层通过语义 `FormalUiKey` 映射 SpriteFrame，不让 Binder 依赖具体文件路径。背景、HUD、牌槽、动作栏、工具栏、弹窗和奖励卡分层管理，运行时只消费状态和语义 key，不修改玩法规则、存档或 App Flow。

**技术栈：** Python/Pillow 资源脚本、PNG/RGBA、JSON manifest、Cocos Creator 3.8.8、TypeScript、Vitest 共享工程测试、Cocos Web Mobile production build、`390×844` 浏览器验收。

## 全局约束

- 只验收 `390×844` 竖屏，不实现横屏排版。
- 参考图约束主色、材质、构图、信息层级和相对比例；运行时必须使用独立可交互 SpriteFrame，不能把参考图整张当作交互层。
- 资源交付目录是 `output/hulebu-ui-assets/hulebu-formal-ui-v1/`；不得写入 Cocos `library/`、`temp/`、`build/`。
- 资源 manifest 必须记录 `key`、`path`、`width`、`height`、`anchor`、`state`、`nineSlice`。
- 普通、按下、禁用三态必须使用相同画布尺寸、锚点和命中几何范围。
- 交付目录不得包含 `.DS_Store`、`__pycache__`、缓存或调试截图。
- 不修改 M2 App Flow、GameSession、存档协议、玩法数值、音频系统、Web 试玩版或微信小游戏 SDK。
- 每个批次开始前读取 `NEXT_ID.md` 并创建独立任务/领取记录；不得预占后续批次文件。
- 每个批次结束运行 `npm run docs:sync`、`git diff --check` 和 UTF-8 无 BOM 检查。

---

## Task 1：视觉 Token、资源脚本和 Manifest

**文件：**

- 创建：`output/hulebu-ui-assets/scripts/build_formal_ui_v1.py`
- 创建：`output/hulebu-ui-assets/scripts/validate_formal_ui_v1.py`
- 创建：`output/hulebu-ui-assets/hulebu-formal-ui-v1/manifest.json`
- 创建：`output/hulebu-ui-assets/hulebu-formal-ui-v1/previews/token-board.png`
- 测试：`packages/shared/src/hulebu-formal-ui-assets.test.ts`
- 文档：当前批次对应的 `docs/tasks/items/TXXX-*.md`、`docs/tasks/claims/TXXX-lee.md`、`docs/progress/2026-08-08-lee.md`

**接口：**

- `build_formal_ui_v1.py` 提供 `build_pack(output_root: Path) -> dict`，输出 token、manifest 和预览板。
- `validate_formal_ui_v1.py` 提供 `validate_pack(pack_root: Path) -> dict`，返回 `errors: list[str]`、`warnings: list[str]`、`assetCount: int`。
- `manifest.json` 顶层字段固定为 `schemaVersion: 1`、`canvas: {width: 390, height: 844}`、`tokens`、`assets`。

- [ ] **步骤 1：登记当前批次并写失败测试。**

  在 `hulebu-formal-ui-assets.test.ts` 中检查 manifest 画布为 `390×844`、每个 key 唯一、三态资源几何字段一致、所有引用 PNG 存在、交付目录没有 `.DS_Store` 或 `__pycache__`。

- [ ] **步骤 2：运行失败测试。**

  运行：`npm run test -w packages/shared -- hulebu-formal-ui-assets`

  预期：因 `hulebu-formal-ui-v1` 和 manifest 尚不存在而失败。

- [ ] **步骤 3：实现 token 和 manifest 生成。**

  固定青绿背景、暖米色牌面、深木托盘、低饱和金线、暖橙火焰反馈五组 token；脚本使用统一的 `asset(key, path, width, height, anchor, state, nineSlice)` 构造 manifest，禁止把绝对路径写入 manifest。

- [ ] **步骤 4：实现资源校验器。**

  校验 RGBA、文件存在、尺寸为正、anchor 在 `0..1`、状态集合合法、三态尺寸/anchor 相同、目录无临时文件；任何 error 以非零退出码结束。

- [ ] **步骤 5：运行测试并提交。**

  运行：`npm run test -w packages/shared -- hulebu-formal-ui-assets`、`python3 output/hulebu-ui-assets/scripts/validate_formal_ui_v1.py output/hulebu-ui-assets/hulebu-formal-ui-v1`、`git diff --check`。

  提交：`git add output/hulebu-ui-assets/scripts output/hulebu-ui-assets/hulebu-formal-ui-v1 packages/shared/src/hulebu-formal-ui-assets.test.ts docs && git commit -m "feat(hulebu): establish formal UI asset contract"`

## Task 2：青绿主场景和基础局内结构

**文件：**

- 修改：`output/hulebu-ui-assets/scripts/build_formal_ui_v1.py`
- 创建：`output/hulebu-ui-assets/hulebu-formal-ui-v1/background/scene_teal_main.png`
- 创建：`output/hulebu-ui-assets/hulebu-formal-ui-v1/board/board_surface.png`
- 创建：`output/hulebu-ui-assets/hulebu-formal-ui-v1/board/discard_slots.png`
- 创建：`output/hulebu-ui-assets/hulebu-formal-ui-v1/board/hand_slots_8.png`
- 创建：`output/hulebu-ui-assets/hulebu-formal-ui-v1/hud/level_badge.png`
- 创建：`output/hulebu-ui-assets/hulebu-formal-ui-v1/hud/score_badge.png`
- 创建：`output/hulebu-ui-assets/hulebu-formal-ui-v1/hud/tile_counter.png`
- 测试：`packages/shared/src/hulebu-formal-ui-assets.test.ts`

**接口：**

- 生成器消费 Task 1 的 `tokens` 和 `asset(...)`，新增 key 必须追加到同一 manifest。
- 主场景安全区固定为 `{left: 12, top: 14, right: 12, bottom: 12}` 设计像素；牌山区域固定在画布中部，底部动作区不侵入牌山命中区。

- [ ] **步骤 1：为主场景和结构资源写失败断言。**

  测试固定 key、尺寸、透明边界和层级元数据；检查 `scene_teal_main` 不包含按钮文字，牌槽和牌河拥有独立 key。

- [ ] **步骤 2：运行失败测试并记录基线。**

  运行：`npm run test -w packages/shared -- hulebu-formal-ui-assets`

- [ ] **步骤 3：生成主场景和结构资源。**

  以参考图的青绿玉石/漆面、云纹、植物边饰和深木托盘重制背景；背景只负责装饰和安全区，牌山、牌河、手槽保持透明独立资源。

- [ ] **步骤 4：运行 alpha、尺寸和视觉预览检查。**

  运行：`python3 output/hulebu-ui-assets/scripts/validate_formal_ui_v1.py output/hulebu-ui-assets/hulebu-formal-ui-v1`，并查看 `previews/scene-board.png`，确认结构没有被背景烘焙死。

- [ ] **步骤 5：提交主场景批次。**

  提交：`git add output/hulebu-ui-assets packages/shared/src/hulebu-formal-ui-assets.test.ts docs && git commit -m "feat(hulebu): add formal teal playfield skin"`

## Task 3：动作栏、工具栏和麻将牌面三态

**文件：**

- 修改：`output/hulebu-ui-assets/scripts/build_formal_ui_v1.py`
- 创建：`output/hulebu-ui-assets/hulebu-formal-ui-v1/actions/{chi,peng,gang,bugang,hu}_{normal,active,disabled}.png`
- 创建：`output/hulebu-ui-assets/hulebu-formal-ui-v1/tools/{shuffle,undo,hint,buff,counter}_{normal,active,disabled}.png`
- 创建：`output/hulebu-ui-assets/hulebu-formal-ui-v1/tiles/mahjong/` 下 34 张正面和 1 张背面
- 测试：`packages/shared/src/hulebu-formal-ui-assets.test.ts`

**接口：**

- 动作 key 形如 `actions.chi.normal`、`actions.chi.active`、`actions.chi.disabled`。
- 工具 key 形如 `tools.shuffle.normal`、`tools.shuffle.active`、`tools.shuffle.disabled`。
- 牌面 key 形如 `tiles.mahjong.bamboo.01`、`tiles.mahjong.honor.red`、`tiles.mahjong.back.default`。

- [ ] **步骤 1：增加三态和牌面 RED 断言。**

  测试每个动作/工具都有三态、三态尺寸和 anchor 完全一致；测试 34+1 牌面 key 完整且透明边界通过。

- [ ] **步骤 2：运行失败测试。**

  运行：`npm run test -w packages/shared -- hulebu-formal-ui-assets`

- [ ] **步骤 3：生成动作和工具三态。**

  普通态使用青绿/米色/金线；按下态增加暖橙火焰和内发光；禁用态降低亮度/饱和度但保留文字和边框位置。工具按钮的数字角标不烘焙进主图，由 Cocos 文本节点显示。

- [ ] **步骤 4：生成统一牌面。**

  牌体统一底色、厚度、阴影、符号基线和透明边界；不再混用 v1-v7 不同牌体。使用 manifest 的逻辑牌面 key，不按中文文件名做运行时映射。

- [ ] **步骤 5：运行并提交。**

  运行：`npm run test -w packages/shared -- hulebu-formal-ui-assets`、资源校验器、`git diff --check`。

  提交：`git add output/hulebu-ui-assets packages/shared/src/hulebu-formal-ui-assets.test.ts docs && git commit -m "feat(hulebu): add formal action and tile states"`

## Task 4：奖励、教学、多候选和结算卡片

**文件：**

- 修改：`output/hulebu-ui-assets/scripts/build_formal_ui_v1.py`
- 创建：`output/hulebu-ui-assets/hulebu-formal-ui-v1/cards/reward_template.png`
- 创建：`output/hulebu-ui-assets/hulebu-formal-ui-v1/cards/wind_field_template.png`
- 创建：`output/hulebu-ui-assets/hulebu-formal-ui-v1/modals/{tutorial,chi_choice,pause,settings,result}_panel.png`
- 创建：`output/hulebu-ui-assets/hulebu-formal-ui-v1/modals/{tutorial,chi_choice,pause,settings,result}_title.png`
- 测试：`packages/shared/src/hulebu-formal-ui-assets.test.ts`

**接口：**

- 卡片模板只包含稳定装饰和插槽；标题、描述、锁定态、奖励数值和按钮文字由 Cocos 文本/图标节点提供。
- 多候选弹窗提供 `choiceSlotRect[]`，每个候选的点击区域独立且不与关闭按钮重叠。

- [ ] **步骤 1：写卡片和弹窗失败断言。**

  测试五类弹窗 key、奖励/风场卡模板 key、标题插槽和九宫格字段存在；测试弹窗底板不烘焙临时文案。

- [ ] **步骤 2：运行失败测试。**

  运行：`npm run test -w packages/shared -- hulebu-formal-ui-assets`

- [ ] **步骤 3：生成模板。**

  复用参考图的纸面、金线和风场色彩；每个模板预留可读文字区、图标区、状态角标区和主按钮区，保证长中文标题不会撞边。

- [ ] **步骤 4：运行预览检查。**

  生成 `previews/modal-board.png` 和 `previews/reward-board.png`，人工检查标题、卡片、关闭按钮和候选槽之间的视觉层级。

- [ ] **步骤 5：提交卡片批次。**

  提交：`git add output/hulebu-ui-assets packages/shared/src/hulebu-formal-ui-assets.test.ts docs && git commit -m "feat(hulebu): add formal modal and reward cards"`

## Task 5：Cocos SpriteFrame 映射与正式 UI Prefab 接线

**文件：**

- 创建：`apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/assets/FormalUiAssetCatalog.ts`
- 创建：`apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/presentation/FormalUiViewModel.ts`
- 修改：`apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/HudBinder.ts`
- 修改：`apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/SlotLayerBinder.ts`
- 修改：`apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/ComboBarBinder.ts`
- 修改：`apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/BoardLayerBinder.ts`
- 创建/修改：`apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scenes/**` 和 `assets/prefabs/**` 中 T248 批次明确领取的 UI 文件
- 测试：`packages/shared/src/mahjong-cocos-project.test.ts`、`packages/shared/src/hulebu-formal-ui-assets.test.ts`

**接口：**

```ts
export type FormalUiState = "normal" | "active" | "disabled";
export type FormalUiKey =
  | "hud.levelBadge" | "hud.scoreBadge" | "hud.tileCounter"
  | "board.discardSlots" | "board.handSlots"
  | `actions.${"chi" | "peng" | "gang" | "bugang" | "hu"}.${FormalUiState}`
  | `tools.${"shuffle" | "undo" | "hint" | "buff" | "counter"}.${FormalUiState}`;

export interface FormalUiAssetCatalog {
  getSpriteFrame(key: FormalUiKey): SpriteFrame | null;
  has(key: FormalUiKey): boolean;
}
```

- [ ] **步骤 1：为映射和节点接线写失败测试。**

  测试 manifest key 可解析、动作/工具状态切换不改变节点尺寸和 anchor、牌山牌面与槽内牌面使用同一逻辑 key、正式 UI 文件存在且没有从 `output/` 运行时读取。

- [ ] **步骤 2：运行失败测试。**

  运行：`npm run test -w packages/shared -- mahjong-cocos-project hulebu-formal-ui-assets`

- [ ] **步骤 3：实现只读资产目录。**

  `FormalUiAssetCatalog` 只负责 manifest key 到 `SpriteFrame` 的映射；缺失 key 返回 `null` 并写入可读诊断，不回退到路径猜测。

- [ ] **步骤 4：接入 Binder。**

  `HudBinder`、`SlotLayerBinder`、`ComboBarBinder` 和 `BoardLayerBinder` 只接收 `FormalUiViewModel`，由 ViewModel 提供资源 key、文本和可见状态；不引入玩法计算或存档读写。

- [ ] **步骤 5：在 Creator 中创建/修改 Prefab 和 Scene。**

  只在已领取的 UI 文件范围内创建正式节点，保持 `SceneBackgroundArt`、`BoardRoot`、`SlotRoot`、`HudRoot`、`ToolOverlayRoot`、`ComboBarRoot` 和 Modal host 的层级，使用 Creator 生成 `.scene/.prefab/.meta`。

- [ ] **步骤 6：运行工程检查。**

  运行：`npm run test -w packages/shared -- mahjong-cocos-project hulebu-formal-ui-assets`、`npx tsc -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.domain.json`、`git diff --check`。

- [ ] **步骤 7：提交接入批次。**

  提交：`git add apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets packages/shared/src/mahjong-cocos-project.test.ts packages/shared/src/hulebu-formal-ui-assets.test.ts docs && git commit -m "feat(hulebu): connect formal UI to Cocos binders"`

## Task 6：Production 视觉验收与交付

**文件：**

- 修改：对应 T248 批次进展、完成记录、模块 `PROGRESS.md`、`HANDOFF.md`、`docs/status/CURRENT_STATUS.md`
- 生成但不提交：`.codex-tmp/**`、Creator `temp/`、`library/`、`build/`、浏览器截图

- [ ] **步骤 1：在精确提交上运行发布构建。**

  运行：`npm run game:hulebu:build`、`npm run game:hulebu:verify-build`；构建必须来自干净精确提交，且 manifest 记录源码、资源和产物摘要。

- [ ] **步骤 2：启动 production 包并做 `390×844` smoke。**

  验证主场景可见、牌山牌面正确、动作按钮普通/按下/禁用切换正确、工具按钮角标不遮挡、牌槽/牌河命中区域对齐、教学/多候选/奖励/结算弹窗层级正确。

- [ ] **步骤 3：检查控制台和资源诊断。**

  记录 0 个未处理 error/warn；缺失资源必须显示 key 和节点路径；截图只放在 `.codex-tmp`。

- [ ] **步骤 4：运行最终验证并更新文档。**

  运行 `npm run docs:sync`、`git diff --check`、UTF-8 无 BOM 检查，并新增 `docs/completion/2026-08-08-task-248-hulebu-cocos-formal-ui-rebuild.md`，记录修改文件、构建 ID、截图位置、验证结果和遗留问题。

- [ ] **步骤 5：提交交付记录。**

  提交：`git add docs && git commit -m "docs(hulebu): record formal UI delivery"`

## 验证总表

- 资源契约：`npm run test -w packages/shared -- hulebu-formal-ui-assets`
- Cocos 工程：`npm run test -w packages/shared -- mahjong-cocos-project`、`npx tsc -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.domain.json`
- 文档：`npm run docs:sync`、`git diff --check`、UTF-8 无 BOM 检查
- 发布：`npm run game:hulebu:build`、`npm run game:hulebu:verify-build`、`390×844` production 浏览器 smoke
