# 胡了卜麻将 UI 图片资源

本目录归档 T068 整理后的麻将图片，供后续 Cocos prefab、sprite atlas 和 UI 绑定使用。原始生成图仍保留在 `output/imagegen/`。

## 分类

- `tiles/numbered/wan/`：万子单牌，文件名 `wan-01.png` 到 `wan-09.png`。
- `tiles/numbered/tiao/`：条子单牌，文件名 `tiao-01.png` 到 `tiao-09.png`。
- `tiles/numbered/tong/`：筒子单牌，文件名 `tong-01.png` 到 `tong-09.png`。
- `tiles/honors/`：字牌单牌，从字牌参考图切出。
- `references/`：目标图和整张参考图。
- `drafts/`：中间稿、候选稿和备用生成图。

## 绑定口径

`manifest.json` 记录每张图的来源、分类、尺寸和 `tileKey`。后续 Cocos 绑定建议优先使用 `manifest.numberedTiles` 和 `manifest.honorTiles`，`drafts` 只做人工复核和替换候选。

当前不手写 PNG 的 Cocos texture meta，避免伪造编辑器导入状态；打开 Cocos Creator 后让编辑器生成权威 `.png.meta`。
