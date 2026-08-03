# T238：胡了卜 Cocos 中央堆叠牌山模板

- 优先级：P1
- 默认负责人：Lee
- 状态：已完成
- 依赖：T237
- 主要文件范围：`apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/config/**`, `packages/shared/src/mahjong-cocos-project.test.ts`, `docs/tasks/**`, `docs/modules/mahjong-roguelike/**`, `docs/progress/**`, `docs/completion/**`
- 禁止修改范围：`apps/web/**`, 非胡了卜 Cocos 模块、数据库和账号系统、PDF 工具箱、AI 修图工具
- 验证方式：`npm run test -w packages/shared -- mahjong-cocos-project`; `npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`; Cocos Web Mobile 非 debug 构建和 Playwright 截图检查；`npm run docs:sync`; `git diff --check`
- 背景：T237 后 HUD 更干净，但首局牌山仍是散点式分布，不像目标图的中央堆叠麻将山，导致画面缺少“麻将堆”的直觉。
- 目标：
  - 新增中央堆叠 `pyramid` 牌山模板。
  - 前几关优先使用 `pyramid`，让首屏更接近目标概念图。
  - 保持现有 runtime 玩法和遮挡关系，不在渲染层硬挪牌。
- 不做：不改组合规则、不改奖励和关卡经济、不替换牌面资源。
- 完成记录：
  - 新增 `pyramid` 中央堆叠牌山模板，前 5 关优先使用该模板，后续关卡继续轮换原有 Graph 模板。
  - 调整 HUD 顶部布局：记牌器保留在关卡牌匾下方，余牌进度拆成独立牌匾，避免文字压在记牌器贴图上。
  - 更新 Cocos 牌山测试断言，覆盖集中牌山跨度、遮挡关系、前 5 关模板和后续模板轮换。
  - 已通过共享测试、Cocos TypeScript 检查、Cocos Web Mobile 构建产物截图检查。
