# 胡了卜麻将 UI 图片资源

本目录归档 T068 整理后的麻将图片，并在 T074/T075 追加透明无边框派生图和运行时放大归一图，供后续 Cocos prefab、sprite atlas 和 UI 绑定使用。原始生成图仍保留在 `output/imagegen/`。

## 分类

- `tiles/numbered/wan/`：万子带牌体单牌，文件名 `wan-01.png` 到 `wan-09.png`。
- `tiles/numbered/tiao/`：条子带牌体单牌，文件名 `tiao-01.png` 到 `tiao-09.png`。
- `tiles/numbered/tong/`：筒子带牌体单牌，文件名 `tong-01.png` 到 `tong-09.png`。
- `tiles/honors/`：带牌体字牌单牌，从字牌参考图切出。
- `tiles/borderless/numbered/`：透明无边框数牌，只保留牌面符号，给 Cocos 自绘牌体叠加使用。
- `tiles/borderless/honors/`：透明无边框字牌，只保留字牌符号，给 Cocos 自绘牌体叠加使用。
- `tiles/refreshed/numbered/`：运行时数牌，由无边框图按 alpha 内容边界放大归一，当前 Cocos 牌山优先加载。
- `tiles/refreshed/honors/`：运行时字牌，由无边框图按 alpha 内容边界放大归一，当前 Cocos 牌山优先加载。
- `references/`：目标图和整张参考图。
- `drafts/`：中间稿、候选稿和备用生成图。

## 绑定口径

`manifest.json` 记录每张图的来源、分类、尺寸和 `tileKey`。Cocos 当前应优先使用 `manifest.refreshedNumberedTiles` 和 `manifest.refreshedHonorTiles`；`borderlessNumberedTiles` 和 `borderlessHonorTiles` 保留为透明来源图；`numberedTiles` 和 `honorTiles` 保留为原始带框版本，方便回退和美术复核；`drafts` 只做人工复核和替换候选。

T075 已为 `tiles/refreshed/` PNG 写入 Cocos texture meta，使 `resources.load(.../spriteFrame)` 可以直接读取。后续如果在 Cocos Creator 中重新导入或调整压缩，请以编辑器生成的 meta 为准。
