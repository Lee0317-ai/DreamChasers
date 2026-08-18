# T274 胡了卜模式与主线地图透明组件资源包完成记录

- 完成时间：2026-08-11
- 负责人：Lee
- 任务编号：T274
- 状态：已完成

## 修改文件

- `output/hulebu-ui-assets/hulebu-mode-map-components-v1/**`
- `docs/tasks/CHANGE_INTAKE.md`
- `docs/tasks/NEXT_ID.md`
- `docs/tasks/items/T274-hulebu-mode-map-transparent-components.md`
- `docs/tasks/claims/T274-lee.md`
- `docs/progress/2026-08-11-lee.md`
- `docs/modules/mahjong-roguelike/PROGRESS.md`
- docs:sync 生成的主文档

## 实现内容

- 使用 PPTOKEN 生成模式面板、模式徽章、地图长板/路径和地图节点/星级四张无文字品红键控源表。
- 交付 17 个透明 RGBA PNG，覆盖模式入口长卡、状态牌、五枚模式徽章、章节牌匾、星级牌匾、章节切换、曲线路径、普通/当前/锁定/Boss 节点和空/实星。
- 新增可重复构建脚本，固定记录源表裁切框并执行品红去底、边缘去色、透明收边、正方形补边和联系表生成。
- 新增 manifest 和 Cocos 导入说明，记录 SpriteFrame key、尺寸、锚点、九宫格、运行时状态、alpha 统计与 SHA-256。

## 验证命令与结果

- PNG 文件类型检查：通过，17 个运行时候选均为 RGBA PNG；四张源表为 RGB PNG。
- 像素级 alpha 检查：通过，17/17 四角透明、主体外至少保留 17px 安全边距，未检测到强品红残留。
- 正方形检查：通过，五枚模式徽章、四类关卡节点和空/实星保持等宽等高画布。
- manifest Node 校验：通过，17 个 key/路径唯一、文件齐全、锚点为 `(0.5, 0.5)`，所有九宫格边距合法。
- 联系表人工视觉检查：通过，五种模式语义清楚，四类节点和空/实星可区分，曲线路径保持独立可拼接。
- API Key 检查：通过，资源包与 T274 文档未写入 key。
- `npm run docs:sync`：通过。
- UTF-8 无 BOM：通过。
- `git diff --check`：通过。

## 遗留问题

- 本任务不修改 Cocos Scene、Prefab、runtime 或关卡配置；正式导入、地图节点布局和动效需要单独任务。
- 胜利/失败结算仍需拆成透明组件；教程、提示、暂停、设置和奖励继续复用 formal-v1 已有正式资源。
