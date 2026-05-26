---
name: T071 建立任务 ID 与每日进度去冲突规范
description: 解决两人各自独立工作时任务 ID 重复、每日进度文件同名冲突的问题，通过 NEXT_ID.md 分配器和个人进度分片消除冲突。
type: project
---

# T071：建立任务 ID 与每日进度去冲突规范

- 负责人：Lee（开发 A）
- 状态：进行中
- 开始时间：2026-05-26
- 预计完成：2026-05-26

## 背景

当前仓库已经出现以下冲突：

1. **任务 ID 重复**：`docs/tasks/items/` 下同时存在 `T045-ai-photo-editor-mvp.md`（Lee / 开发 A）和 `T045-hulebu-rules-model.md`（Jaspon / 开发 B）。
2. **每日进度同名冲突**：两人同一天工作时会各自创建 `docs/progress/2026-05-26.md`，导致 Git merge 冲突。
3. **无实时同步**：两人异步工作，没有强制机制在创建新任务前获取最新全局 ID。

## 目标

- 消除未来任务 ID 重复。
- 消除每日进度文件同名冲突。
- 最小化对现有流程和文档结构的改动。

## 方案

### 1. 任务 ID 分配器 `docs/tasks/NEXT_ID.md`

新建中心化分配器文件，只记录下一个可用 ID 数字。

**规则**：
- 任何人或 AI 创建新任务前，必须先读取 `docs/tasks/NEXT_ID.md`。
- 使用文件中数字作为新任务 ID（如 `071` → `T071`）。
- 创建完任务分片后，把文件中的数字加 1 写回。
- Git 冲突 trivial（单行文件），冲突时取较大值即可。

**遗留问题**：`T045` 历史重复需要手动修正（见下方）。

### 2. 每日进度改为个人分片

把 `docs/progress/YYYY-MM-DD.md` 改为个人分片：

```
docs/progress/
  2026-05-26-lee.md      # Lee 的当日进度
  2026-05-26-jaspon.md   # Jaspon 的当日进度
```

**规则**：
- 各自只写自己的分片，不动他人的。
- 主文件 `docs/progress/2026-05-26.md` 由 `docs:sync` 自动汇总生成，不手写。
- 历史已有 `2026-05-19.md` 至 `2026-05-26.md` 保留不变，从今天起执行新规则。
- 如果某天只有一人工作，直接写个人分片，`docs:sync` 仍会正确生成主文件。

### 3. 开工前强制 `git pull`

在 `dual-dev-ai-workflow.md` 和 `AGENTS.md` 的开工流程中增加第 0 步：

```
0. git pull origin main — 确保看到最新任务 ID、领取记录和进度分片。
```

### 4. 开发者标识统一

在文档中明确：

- **Lee** = 开发 A，负责平台基础、Next.js、数据库、PDF 工具箱等。
- **Jaspon** = 开发 B，负责 AI 搜索/修图、麻将 Roguelike、游戏接入等。

## 允许修改文件

- `docs/tasks/NEXT_ID.md`（新建）
- `docs/workflow/dual-dev-ai-workflow.md`
- `docs/workflow/doc-sync-policy.md`
- `AGENTS.md`
- `CLAUDE.md`
- 本任务分片：`docs/tasks/items/T071-avoid-id-progress-conflict.md`
- 领取分片：`docs/tasks/claims/T071-lee.md`

## 禁止修改文件

- `apps/**`
- `packages/**`
- `docker-compose.yml`
- `package.json`
- `package-lock.json`

## 验证命令

- 文档自审；UTF-8 无 BOM 检查；`git diff --check`

## 遗留问题

1. `T045` 重复需要后续手动重命名其中一个（建议把后创建的 `T045-hulebu-rules-model.md` 重命名为当前可用新 ID，并同步更新对应 claims 文件）。
2. `docs:sync` 脚本未来需要增强以支持自动汇总 `docs/progress/YYYY-MM-DD-*.md` 到主文件，当前先通过规范约定解决。
