# T229 领取记录：胡了卜 Cocos 预览跨工作区生成器导入修复

- 任务编号：T229
- 任务名称：胡了卜 Cocos 预览跨工作区生成器导入修复
- 负责人：Lee
- 领取时间：2026-06-29
- 状态：已完成

## 文件范围

允许修改：

- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/config/HulebuLevelConfig.ts`
- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/config/HulebuMountainGenerator.ts`
- `packages/shared/src/mahjong-cocos-project.test.ts`
- `docs/tasks/**`
- `docs/modules/mahjong-roguelike/**`
- `docs/progress/2026-06-29-lee.md`
- `docs/completion/**`

禁止修改：

- `apps/web/**`
- `apps/game/mahjong-roguelike/prototypes/**`
- `apps/web/public/games/hulebu-demo/**`
- `apps/web/prisma/**`
- PDF、AI 修图、TimePick、部署相关文件

## 验证命令

```bash
npm run test -w packages/shared -- mahjong-cocos-project
npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json
npm run docs:sync
git diff --check
```

## 当前记录

- 已确认 Cocos Web Preview 报错来自 `HulebuLevelConfig.ts` 对工程外 `packages/shared/src/mahjong-mountain-generator` 的直接 import。
- 已新增 Cocos 本地生成器模块、改配置导入、补共享静态测试和文档收口。
- 验证通过：`npm run test -w packages/shared -- mahjong-cocos-project`
- 验证通过：`npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`
