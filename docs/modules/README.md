# 模块文档目录

这里按“一个小工具或游戏一个独立文件夹”的方式记录全过程。

## 1. 目录规则

每个小工具或游戏必须使用独立目录：

```text
docs/modules/<module-slug>/
```

例如：

- `docs/modules/pdf-toolbox/`
- `docs/modules/photo-editor/`
- `docs/modules/mahjong-roguelike/`
- `docs/modules/ai-search/`
- `docs/modules/admin-content/`

禁止把多个工具或游戏混写在同一个模块文档里。后续工具和游戏数量变多后，必须能按目录直接筛选、交接和复盘。

## 2. 必备文件

每个模块目录至少包含：

- `README.md`：模块目标、边界、功能范围、技术路线、主要文件、验证方式。
- `IMPLEMENTATION_PLAN.md`：分阶段实施计划、文件范围、验收方式。
- `PROGRESS.md`：模块级过程记录，记录每天做了什么和下一步。
- `DECISIONS.md`：模块内关键决策和取舍。
- `HANDOFF.md`：交接说明、当前风险、下一位开发者需要先读什么。

如果模块已完成，还需要在 `docs/completion/` 写全局完成记录；模块目录内也可以继续保留模块级收尾说明。

## 3. 代码目录规则

每个工具或游戏的代码也必须有独立模块目录。路由层只做入口，不承载大量业务逻辑。

Web 工具代码：

```text
apps/web/src/modules/tools/<module-slug>/
```

Web 游戏接入代码：

```text
apps/web/src/modules/games/<module-slug>/
```

正式游戏工程：

```text
apps/game/<module-slug>/
```

推荐 Web 工具模块结构：

```text
apps/web/src/modules/tools/<module-slug>/
  components/
  lib/
  types.ts
  index.ts
  __tests__/
```

推荐 Web 游戏接入模块结构：

```text
apps/web/src/modules/games/<module-slug>/
  components/
  lib/
  types.ts
  index.ts
  __tests__/
```

`apps/web/src/app/**` 下的页面只负责路由、元数据和引入模块入口组件。

## 4. 开工规则

新增任何工具或游戏前，必须先确认：

- 模块目录是否已创建。
- 模块 `README.md` 是否写清目标和边界。
- `IMPLEMENTATION_PLAN.md` 是否写清阶段和验证。
- 任务池是否有任务编号。
- `CLAIMS.md` 是否已领取。
- 代码目录是否使用独立模块路径。

不满足以上条件，不进入实现。
