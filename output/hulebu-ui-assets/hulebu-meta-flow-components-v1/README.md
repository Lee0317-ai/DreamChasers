# 胡了卜局外流程透明组件资源包 v1

本资源包是 T271 局外流程视觉母稿的第一批可落地拆件，覆盖标题/登录页和大厅页，共 14 个透明 PNG。成品用于后续 Cocos Creator 导入与节点组合，不包含运行时文案。

## 目录

```text
hulebu-meta-flow-components-v1/
  components/
    common/       主按钮、次按钮、说明底板
    title/        品牌牌匾、玉印
    lobby/        头像框、资产牌匾、继续面板、进度轨、入口徽章、底部导航
  master-sources/ 三张品红键控源表，仅供追溯和重建
  preview/        透明棋盘联系表
  manifest.json   Cocos key、尺寸、锚点、九宫格、状态和 alpha 统计
  build_component_pack.py
```

## 使用规则

- 运行时只使用 `components/**/*.png`，不要直接导入 `master-sources/*.png`。
- 所有标题、按钮字、数值、入口名称和状态提示均由 Cocos `Label` 或独立图标节点渲染。
- `manifest.json` 中 `spriteMode` 为 `sliced` 的资源必须按 `nineSlice` 设置边距；圆形头像框和入口徽章使用 `simple`。
- 主/次按钮的 `pressed`、`disabled` 状态采用运行时缩放和颜色变化，不重复存储近似 PNG。
- 大厅入口的 `notice`、`claimable`、`affordable` 状态采用独立角标或高亮层，不烧录到基础徽章。
- 设计基准画布继续沿用 `390 × 844`，具体显示尺寸由场景节点控制，不按 PNG 原始像素直接铺满。

## 重建

脚本依赖 Pillow，执行后会覆盖 `components/`、`manifest.json` 和联系表中的同名成品：

```bash
python3 build_component_pack.py
```

源表裁切框已经固定记录在脚本中。若更换源表，必须重新检查裁切框、透明边缘和九宫格边距，不能只替换图片文件。

## 验收入口

- 联系表：`preview/contact-sheet-v1.png`
- 机器清单：`manifest.json`
- Cocos 导入说明：`COCOS_IMPORT.md`
