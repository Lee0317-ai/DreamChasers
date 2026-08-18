# T285 胡了卜弃牌交互 UI 设计资源完成记录

- 完成时间：2026-08-13
- 负责人：Lee
- 状态：已完成

## 修改文件

- `output/hulebu-ui-assets/hulebu-discard-ui-v1/**`
- `docs/tasks/CHANGE_INTAKE.md`
- `docs/tasks/NEXT_ID.md`
- `docs/tasks/items/T285-hulebu-discard-ui-design.md`
- `docs/tasks/claims/T285-lee.md`
- `docs/modules/mahjong-roguelike/PROGRESS.md`
- `docs/progress/2026-08-13-lee.md`

## 实现内容

- 设计轻量弃牌流程，不使用遮挡牌山的全屏确认框。
- 交付弃牌入口 normal/active/disabled 三态、选中描边、操作提示条、确认条、两格牌河面板和成功提示。
- 完整效果图复用 formal-v1 的正式场景、HUD、手牌槽和麻将牌，保持当前视觉一致。
- 所有中文继续由 Cocos `Label` 运行时绘制，透明组件不烧字。
- 依据用户提供的实机截图追加 `previews/discard-flow-reference-v2.png`，校正弃牌入口、牌河、动作栏和手牌槽的真实相对位置。

## 验证结果

- 8/8 组件为 RGBA PNG，四角透明。
- manifest 的 8 个 key 全部唯一，文件齐全，锚点统一为 `(0.5, 0.5)`。
- `Simple` / `Sliced` 类型与九宫格边距合法。
- 完整状态稿与透明联系表人工检查通过。
- API Key 未写入输出资源、脚本或文档。
- `git diff --check` 通过。
- v2 参考稿人工检查通过：不再使用独立大面积底部确认条，牌河最多两格且位于动作栏上方。

## 遗留问题

- 本任务只交付 UI 设计与组件，不修改 Cocos runtime；正式接线需另立任务并与仍在进行中的 T284 文件边界错开。
