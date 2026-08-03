# T051 胡了卜麻将牌面 UI 参考图完成记录

- 任务编号：T051
- 负责人：Codex / 开发 B
- 完成时间：2026-06-21
- 状态：已完成

## 修改文件

- `output/hulebu-ui-assets/scripts/build_master_tile_pack_fixed_grid.py`
- `output/hulebu-ui-assets/scripts/build_master_tile_pack_green_base_v3.py`
- `output/hulebu-ui-assets/scripts/build_master_tile_pack_standard_body_v4.py`
- `output/hulebu-ui-assets/scripts/build_master_tile_pack_dot_fused_v5.py`
- `output/hulebu-ui-assets/scripts/build_master_tile_pack_dot_clean_v6.py`
- `output/hulebu-ui-assets/scripts/build_master_tile_pack_dot_clean_template_v7.py`
- `output/hulebu-ui-assets/scripts/validate_master_tile_pack.py`
- `output/hulebu-ui-assets/hulebu-master-tile-pack-v2-fixed-grid/`
- `output/hulebu-ui-assets/hulebu-master-tile-pack-v3-retained-green-base/`
- `output/hulebu-ui-assets/hulebu-master-tile-pack-v4-standard-body/`
- `output/hulebu-ui-assets/hulebu-master-tile-pack-v5-fused-dots/`
- `output/hulebu-ui-assets/hulebu-master-tile-pack-v6-clean-dots/`
- `output/hulebu-ui-assets/hulebu-master-tile-pack-v7-clean-template-dots/`
- `docs/tasks/items/T051-hulebu-tile-ui-references.md`
- `docs/tasks/claims/T051-codex.md`
- `docs/tasks/TASK_BOARD.md`
- `docs/tasks/CLAIMS.md`
- `docs/status/CURRENT_STATUS.md`
- `docs/progress/2026-06-21-lee.md`
- `docs/completion/2026-06-21-task-051-hulebu-tile-ui-references.md`

## 实现内容

- 基于用户补入的 master source sheet 生成胡了卜麻将牌资源包，覆盖 35 张基础牌、4 张状态覆盖层、manifest、crop-report、raw-crops、debug 源图和 contact sheet 预览。
- v2 使用固定网格/手工坐标重切，确认 `1-9万 / 东南西北` 可用。
- v3 修复筒/条/中发白/牌背绿底缺失和裁切不准问题。
- v4 让 `1-9筒 / 1-9条` 共用标准底板，只转描符号，统一绿底和牌体。
- v7 在用户指出筒子贴片感后，改用严格颜色蒙版、羽化融合、底缘碎片清理和完整清洁标准底板，解决 `1-9筒` 切上去的观感问题。
- 用户已确认 v7 “可以”，当前可交付目录为 `output/hulebu-ui-assets/hulebu-master-tile-pack-v7-clean-template-dots/`。
- 本任务只产出资源和文档，未接入或修改 `apps/web/**`、`packages/shared/**`、`apps/game/mahjong-roguelike/**`。

## 验证命令

- `/Users/lee/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3 -m py_compile output/hulebu-ui-assets/scripts/build_master_tile_pack_fixed_grid.py output/hulebu-ui-assets/scripts/build_master_tile_pack_green_base_v3.py output/hulebu-ui-assets/scripts/build_master_tile_pack_standard_body_v4.py output/hulebu-ui-assets/scripts/build_master_tile_pack_dot_fused_v5.py output/hulebu-ui-assets/scripts/build_master_tile_pack_dot_clean_v6.py output/hulebu-ui-assets/scripts/build_master_tile_pack_dot_clean_template_v7.py output/hulebu-ui-assets/scripts/validate_master_tile_pack.py`
- `/Users/lee/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3 output/hulebu-ui-assets/scripts/validate_master_tile_pack.py output/hulebu-ui-assets/hulebu-master-tile-pack-v7-clean-template-dots --require-green-base --require-standard-body --require-fused-dots --require-clean-dot-edges`
- `npm run docs:sync`
- `git diff --check -- output/hulebu-ui-assets/scripts docs/tasks/items/T051-hulebu-tile-ui-references.md docs/tasks/claims/T051-codex.md docs/tasks/TASK_BOARD.md docs/tasks/CLAIMS.md docs/status/CURRENT_STATUS.md docs/progress/2026-06-21-lee.md docs/completion/2026-06-21-task-051-hulebu-tile-ui-references.md`
- `git diff --check`
- 人工验收：用户确认 v7 “可以”。

## 验证结果

- Python 脚本编译通过。
- v7 资源包通过绿底、标准牌体、筒子融合和筒子边缘清洁校验。
- 文档同步通过。
- T051 相关脚本和文档的 scoped `git diff --check` 通过。
- 全局 `git diff --check` 已执行，但失败项位于 `apps/web/src/generated/prisma/browser.ts` 和 `apps/web/src/generated/prisma/client.ts` 的既有/无关 trailing whitespace；这些文件属于 T051 禁止修改范围，本任务未处理。
- 用户已验收 v7 清底融合版。

## 遗留问题

- v5 / v6 为定位筒子贴片感和底缘红色碎片的中间诊断输出，不作为推荐交付版本。
- 后续如要接入 Web 或 Cocos/GDevelop 工程，应以 v7 的 `manifest.json` 和 `base/` 目录为准，并另开接入任务。
