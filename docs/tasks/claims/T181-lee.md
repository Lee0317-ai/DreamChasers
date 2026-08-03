# T181：胡了卜 HUD 和按钮透明切图包

- 领取人：Lee
- 领取时间：2026-06-21
- 状态：待验收
- 预计完成：2026-06-21
- 允许修改文件：`output/hulebu-ui-assets/**`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/NEXT_ID.md`, `docs/tasks/items/T181-hulebu-ui-component-transparent-assets.md`, `docs/tasks/claims/T181-lee.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-06-21-lee.md`, `docs/progress/2026-06-22-lee.md`, `docs/completion/**`
- 禁止修改文件：`apps/web/**`, `apps/game/**`, `packages/shared/**`, `apps/web/prisma/**`, `docker-compose.yml`, `docker-compose.prod.yml`, `deploy/**`, `package.json`, `package-lock.json`
- 依赖任务：T051
- 验证命令：`/Users/lee/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3 -m py_compile output/hulebu-ui-assets/scripts/build_ui_component_pack_v1.py output/hulebu-ui-assets/scripts/build_ui_component_pack_v2.py output/hulebu-ui-assets/scripts/build_ui_component_pack_v3.py output/hulebu-ui-assets/scripts/build_ui_component_pack_redesign_v4.py output/hulebu-ui-assets/scripts/build_ui_component_pack_source_faithful_v5.py output/hulebu-ui-assets/scripts/build_ui_component_pack_source_faithful_v6.py output/hulebu-ui-assets/scripts/validate_ui_component_pack.py`; `/Users/lee/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3 output/hulebu-ui-assets/scripts/validate_ui_component_pack.py output/hulebu-ui-assets/hulebu-ui-component-pack-v6-source-faithful-transparent-tiles`; `npm run docs:sync`; `git diff --check -- output/hulebu-ui-assets/scripts output/hulebu-ui-assets/hulebu-ui-component-pack-v6-source-faithful-transparent-tiles docs/tasks/items/T181-hulebu-ui-component-transparent-assets.md docs/tasks/claims/T181-lee.md docs/tasks/TASK_BOARD.md docs/tasks/CLAIMS.md docs/status/CURRENT_STATUS.md docs/progress/2026-06-21-lee.md docs/progress/2026-06-22-lee.md`
- 当前风险：v6 是基于参考图和 T051 v7 牌面的源图质感修正版，不是重新绘制的最终商用品质 UI；后续如需最终投产，还需要美术补动态图标、九宫格切片、图集打包和多状态适配。
- 当前阻塞：无。
- 备注：已生成 `output/hulebu-ui-assets/hulebu-ui-component-pack-v6-source-faithful-transparent-tiles/`；组合选择弹层按“空底板 + T051 v7 真实麻将小图”生成预览，不再使用文字牌名；新增 `tiles/mahjong/` 透明麻将牌面，含 34 张正面和 1 张背面；本任务未接入工程代码。v1/v2 保留为诊断和中间输出，v3 保留为干净裁切版，v4 保留为重绘试验版，v5 保留为无牌面增量版，v6 作为当前交付候选。
