# T062 胡了卜 Cocos Creator 3.8.8 工程接入完成记录

- 完成时间：2026-05-25
- 负责人：Codex / 开发 B
- 任务编号：T062
- 任务名称：胡了卜 Cocos Creator 3.8.8 工程接入

## 修改文件

- `packages/shared/src/mahjong-cocos-project.test.ts`
- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/**`
- `apps/game/mahjong-roguelike/cocos/README.md`
- `apps/game/mahjong-roguelike/docs/formal-presentation-bridge.md`
- `apps/game/mahjong-roguelike/README.md`
- `docs/modules/mahjong-roguelike/**`
- `docs/tasks/CHANGE_INTAKE.md`
- `docs/tasks/items/T062-hulebu-cocos-creator-project.md`
- `docs/tasks/claims/T062-codex.md`
- `docs/progress/2026-05-25.md`

## 实现内容

- 确认本机 Cocos Creator 3.8.8 安装路径为 `/Applications/Cocos/Creator/3.8.8/CocosCreator.app`。
- 参考 Creator 3.8.8 自带 `empty-2d` 模板创建 `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/` 工程壳。
- 新增 Cocos 首场景脚本边界：`GameSceneController`、`BoardLayerBinder`、`SlotLayerBinder`、`ComboBarBinder`、`HudBinder` 和 `HulebuSceneModel` DTO。
- 新增场景占位说明和配置导入说明，明确真实 `.scene`、prefab 和资源 atlas 后续由 Cocos Creator 编辑器维护。
- 新增 `mahjong-cocos-project` 测试，保护工程壳关键文件。

## 验证命令

```bash
npm run test -w packages/shared -- mahjong-cocos-project
npm run test -w packages/shared -- mahjong
npm run typecheck -w packages/shared
npm run docs:sync
git diff --check
```

## 验证结果

- `npm run test -w packages/shared -- mahjong-cocos-project` 通过，3 个测试全部通过。
- `npm run test -w packages/shared -- mahjong` 通过，5 个测试文件、34 个测试全部通过。
- `npm run typecheck -w packages/shared` 通过。
- `npm run docs:sync` 通过。
- `git diff --check` 通过。

## 遗留问题

- 尚未在 Cocos Creator 编辑器内创建真实 `HulebuGameScene.scene`。
- 尚未导入最终青瓷牌面、Tile prefab、动画、音效、配置同步脚本或发布构建配置。
