# 配置导入占位

后续需要把以下配置导入 Cocos `assets/resources/config/`：

- `levels.json`
- `rewards.json`
- `tiles.json`

源文件在：

- `apps/game/mahjong-roguelike/config/levels.json`
- `apps/game/mahjong-roguelike/config/rewards.json`
- `apps/game/mahjong-roguelike/config/tiles.json`

当前任务不复制正式配置，避免 Cocos 工程和共享配置出现双份事实来源。下一步可做一个小脚本，把共享配置构建或同步到 Creator 的 `resources/config` 目录。
