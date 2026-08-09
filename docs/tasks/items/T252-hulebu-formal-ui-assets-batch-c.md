# T252：胡了卜正式 UI 资源 Batch C

- 优先级：P0
- 负责人：Lee
- 状态：已完成
- 依赖：T248 规格；T249 视觉基线；T251 Batch A+B 已完成
- 阻塞：无
- 允许修改文件：`output/hulebu-ui-assets/hulebu-formal-ui-v1/cards/**`、`modals/**`、`tiles/mahjong/**`、`master-sources/**`、`previews/**`、正式包 `manifest.json`/`validation-report.json`、`output/hulebu-ui-assets/scripts/build_formal_ui_batch_c.py`、T248/T252 任务与领取分片、麻将模块文档、当天进展/完成记录及 `npm run docs:sync` 自动生成主文档
- 禁止修改范围：Cocos 工程、Batch A+B 已通过资源、玩法规则、Web 试玩版、M2 App Flow/存档、横屏、微信小游戏 SDK、PDF、AI 修图和其他游戏模块
- 验证方式：PNG 数量/尺寸/mode/alpha/透明角检查；麻将牌统一画布检查；manifest key 唯一性和已有 Batch A+B key 保留检查；预览板人工审阅；`npm run docs:sync`；UTF-8 无 BOM；密钥残留扫描；`git diff --check`

## 目标

完成正式 UI 资源包的内容层：

1. 奖励卡模板 3 张：组合强化、得分加成、槽位扩展。
2. 风场卡模板 1 张，运行时替换缩略图、标题和锁定状态。
3. 教学、多候选、暂停、设置、结算弹窗底板各 1 张。
4. 34 张麻将正面和 1 张背面，统一 `272×384` 画布与透明边界。
5. 扩展 formal v1 manifest、validation report，并生成卡片/弹窗与牌面预览。

## 实现方式

- 使用已授权原始参考图和 PPTOKEN 新站生成无文字卡片/弹窗母版，统一青绿玉石、暖米色纸面、深木和低饱和金边。
- 卡片和弹窗只承载材质、边框、插图槽和按钮槽；标题、正文、数值和选项由 Cocos Label/节点渲染。
- 麻将牌复用已完成多轮清理的 `hulebu-master-tile-pack-v7-clean-template-dots`，复制到正式包并改为稳定语义 key，不重新生成字形。

## 不做

- 不接入 Cocos。
- 不修改 Batch A+B 资源内容。
- 不把不可控的模型中文文字写入最终卡片或弹窗。
- 不保存或提交真实 API Key。

## 完成结果

- 通过 PPTOKEN 新站生成 4 张无文字正式卡片和 5 个无文字弹窗母版，完成洋红隔离底抠图与边缘溢色清理。
- 复用 v7 统一牌体输出 34 张正面和 1 张背面；八条从旧字母状图案修正为 2×4 标准竹节。
- formal v1 manifest 从 36 项扩展到 80 项，保留全部 Batch A+B key。
- 卡片统一 `236×501`，弹窗统一 `478×309`，麻将牌统一 `272×384`。
- 新增卡片/弹窗透明预览和 35 张牌面透明预览；validation report 状态为 `passed`。
- 本批未修改 Cocos 工程；下一步进入 SpriteFrame/Prefab 接入批次。
