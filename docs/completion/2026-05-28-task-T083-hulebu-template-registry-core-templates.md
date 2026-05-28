# T083：胡了卜模板注册表和 8 个核心模板共享实现完成记录

- 完成时间：2026-05-28
- 负责人：Lee
- 修改文件：`packages/shared/src/mahjong-mountain-generator.ts`, `packages/shared/src/mahjong-mountain-generator.test.ts`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/items/T083-hulebu-template-registry-core-templates.md`, `docs/tasks/claims/T083-lee.md`, `docs/tasks/NEXT_ID.md`, `docs/modules/mahjong-roguelike/GENERATOR_FOUNDATION.md`, `docs/modules/mahjong-roguelike/README.md`, `docs/modules/mahjong-roguelike/IMPLEMENTATION_PLAN.md`, `docs/modules/mahjong-roguelike/PROGRESS.md`, `docs/modules/mahjong-roguelike/HANDOFF.md`, `docs/progress/2026-05-28.md`, `docs/completion/2026-05-28-task-T083-hulebu-template-registry-core-templates.md`
- 实现内容：完成模板 definition、模板注册表、参数默认值、参数边界、参数归一化、未知模板错误、8 个核心模板、通用校验器和 ExperienceReport 模板字段；保留 `SolutionTrace`、`FaceAssignment`、5% 遮挡图和 `levelTiles` 输出。
- 验证命令：`npm run test -w packages/shared -- mahjong-mountain-generator`; `npm run typecheck -w packages/shared`; `npm run docs:sync`; `rg -n "T[B]D|T[O]DO|待[补]" docs/tasks/items/T083-hulebu-template-registry-core-templates.md docs/tasks/claims/T083-lee.md docs/modules/mahjong-roguelike/GENERATOR_FOUNDATION.md`; `git diff --check`
- 验证结果：生成器测试通过，1 个测试文件、15 个测试；共享包类型检查通过；文档同步通过，已同步 50 个任务分片和 49 个领取分片；占位符扫描无匹配；diff 空白检查通过。
- 遗留问题：Cocos 默认关卡仍未消费 Graph-based 生成器输出；后续需要另起任务把 `levelTiles` 转成现有 Cocos 关卡配置并做手机视口目检。
