# 胡了卜 Cocos Creator 正式运行时

本项目是胡了卜 v1 正式发布的唯一正式运行时。玩法、平衡、存档、UI 与发布修复必须在这里按编号任务实现和验证；HTML 原型和 Web Demo 只保留为 Legacy Reference。

- 编辑器版本：Cocos Creator 3.8.8
- 本机编辑器路径：`/Applications/Cocos/Creator/3.8.8/CocosCreator.app`
- 当前场景与运行时入口：`assets/scripts/GameSceneController.ts`
- 项目目录：`apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8`

## 在编辑器中打开

1. 打开 Cocos Dashboard。
2. 进入“项目”，选择“添加”或“打开其他项目”。
3. 指向 `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8`。
4. 使用 Cocos Creator 3.8.8 打开并运行项目。

默认构建程序是 `/Applications/Cocos/Creator/3.8.8/CocosCreator.app/Contents/MacOS/CocosCreator`。需要诊断其他安装时，可以用环境变量 `COCOS_CREATOR_BIN` 或命令参数 `--creator <path>` 覆盖；两者同时提供时，`--creator` 优先。

## 正式构建与验证

在仓库根目录执行：

```bash
npm run game:hulebu:build
npm run game:hulebu:verify-build
```

- `npm run game:hulebu:build` 构建正式 Web Mobile 产物。它只删除所选 `<outputRoot>/web-mobile`，随后以 `platform=web-mobile;debug=false` 调用 Creator，并依次执行产物校验、Creator 结果判定、HTTP smoke，最后写入发布清单。
- `npm run game:hulebu:verify-build` 校验已经存在的默认正式产物。verify-only 不启动 Creator，也不会创建、删除或改写 Creator 日志与发布清单；它只校验现有产物、执行 HTTP smoke，并输出 JSON 摘要。
- `--output-root <path>` 可以覆盖诊断或输出目录。默认 output root 是本项目的 `build/production`，其直接子目录 `web-mobile` 才是正式产物根目录。

默认生成证据位于：

- 产物根目录：`build/production/web-mobile/`
- Creator 合并日志：`build/production/hulebu-cocos-build.log`
- 发布清单：`build/production/web-mobile/hulebu-build.json`

历史目录 `build/web-mobile` 不是默认正式生产输出，不能用来替代上述发布证据。

## Creator 退出码保护

退出码 `0` 是常规成功结果。退出码 36 只有同时满足以下条件才允许被包装脚本规范化为成功：

1. 必需产物的校验错误数为零。
2. Creator 合并日志包含精确标记 `build Task (web-mobile) Finished`。
3. 全部 HTTP smoke 检查通过。

退出码 36 本身不是成功证据。任何其他非零退出码都会使构建失败；HTTP smoke 未通过时也不会写入发布清单。允许规范化时，原始退出码与规范化标记仍会记录在 `hulebu-build.json` 中。

## 源文件与生成目录

正式源代码和配置位于 `assets/`、`settings/`、项目配置文件及受版本控制的必要编辑器配置中。以下目录属于忽略、生成或编辑器本地状态，不是正式源代码：

- `library/`
- `temp/`
- `local/`
- `build/`
- `profiles/`
- `node_modules/`

`profiles/` 包含本地项目可用性所需的编辑器状态，不应笼统视为可安全删除。禁止手工修改 `build/**`；需要改变正式产物时，应修改 Cocos 正式源代码或配置后重新构建。
