import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const paths = {
  taskItems: path.join(rootDir, "docs/tasks/items"),
  taskClaims: path.join(rootDir, "docs/tasks/claims"),
  taskBoard: path.join(rootDir, "docs/tasks/TASK_BOARD.md"),
  claims: path.join(rootDir, "docs/tasks/CLAIMS.md"),
  status: path.join(rootDir, "docs/status/CURRENT_STATUS.md"),
};

const taskMarkers = {
  start: "<!-- DOCS_SYNC_TASKS_START -->",
  end: "<!-- DOCS_SYNC_TASKS_END -->",
};

const claimMarkers = {
  start: "<!-- DOCS_SYNC_CLAIMS_START -->",
  end: "<!-- DOCS_SYNC_CLAIMS_END -->",
};

const statusMarkers = {
  start: "<!-- DOCS_SYNC_STATUS_START -->",
  end: "<!-- DOCS_SYNC_STATUS_END -->",
};

async function readMarkdown(filePath) {
  return readFile(filePath, "utf8");
}

async function writeMarkdown(filePath, content) {
  await writeFile(filePath, ensureTrailingNewline(content), "utf8");
}

function ensureTrailingNewline(content) {
  return content.endsWith("\n") ? content : `${content}\n`;
}

function escapeCell(value) {
  return (value || "未填写")
    .replace(/\r?\n/g, "<br>")
    .replace(/\|/g, "\\|")
    .trim();
}

function parseTitle(content, fallbackId = "") {
  const match = content.match(/^#\s+(T\d{3})[：:]\s*(.+)$/m);
  if (match) {
    return {
      id: match[1],
      title: match[2].trim(),
    };
  }

  return {
    id: fallbackId,
    title: "未命名任务",
  };
}

function parseFields(content) {
  const fields = {};
  const fieldPattern = /^-\s*([^：:\n]+)[：:]\s*(.*)$/gm;
  let match;

  while ((match = fieldPattern.exec(content))) {
    fields[match[1].trim()] = match[2].trim();
  }

  return fields;
}

function taskNumber(id) {
  const match = id.match(/\d+/);
  return match ? Number(match[0]) : Number.MAX_SAFE_INTEGER;
}

async function parseDirectoryEntries(directory) {
  const files = await readdir(directory);
  const markdownFiles = files
    .filter((file) => file.endsWith(".md") && file !== "README.md")
    .sort((a, b) => a.localeCompare(b, "en"));

  const entries = [];

  for (const file of markdownFiles) {
    const filePath = path.join(directory, file);
    const content = await readMarkdown(filePath);
    const fallbackId = file.match(/^(T\d{3})/)?.[1] || "";
    const title = parseTitle(content, fallbackId);
    const fields = parseFields(content);

    entries.push({
      file,
      filePath,
      ...title,
      fields,
    });
  }

  return entries.sort((a, b) => taskNumber(a.id) - taskNumber(b.id));
}

function renderTaskSummary(tasks) {
  const lines = [
    taskMarkers.start,
    "## 7. 自动生成任务分片摘要",
    "",
    "> 本节由 `npm run docs:sync` 生成。请修改 `docs/tasks/items/` 中的任务分片，不要手工编辑本节。",
    "",
    "| 编号 | 优先级 | 任务 | 负责人 | 状态 | 依赖 | 主要文件范围 | 验证方式 |",
    "| --- | --- | --- | --- | --- | --- | --- | --- |",
  ];

  for (const task of tasks) {
    const fields = task.fields;
    lines.push(
      [
        task.id,
        fields["优先级"],
        task.title,
        fields["负责人"] || fields["默认负责人"],
        fields["状态"],
        fields["依赖"] || fields["依赖任务"],
        fields["允许修改文件"] || fields["主要文件范围"],
        fields["验证命令"] || fields["验证方式"],
      ]
        .map(escapeCell)
        .join(" | ")
        .replace(/^/, "| ")
        .replace(/$/, " |"),
    );
  }

  if (tasks.length === 0) {
    lines.push("| 无 | 无 | 暂无任务分片 | 无 | 无 | 无 | 无 | 无 |");
  }

  lines.push(taskMarkers.end);
  return lines.join("\n");
}

function renderClaimSummary(claims) {
  const lines = [
    claimMarkers.start,
    "## 6. 自动生成领取分片摘要",
    "",
    "> 本节由 `npm run docs:sync` 生成。请修改 `docs/tasks/claims/` 中的领取分片，不要手工编辑本节。",
    "",
    "| 编号 | 任务 | 领取人 | 状态 | 领取时间 | 允许修改文件 | 验证命令 | 备注 |",
    "| --- | --- | --- | --- | --- | --- | --- | --- |",
  ];

  for (const claim of claims) {
    const fields = claim.fields;
    lines.push(
      [
        claim.id,
        claim.title,
        fields["领取人"],
        fields["状态"],
        fields["领取时间"],
        fields["允许修改文件"],
        fields["验证命令"],
        fields["备注"],
      ]
        .map(escapeCell)
        .join(" | ")
        .replace(/^/, "| ")
        .replace(/$/, " |"),
    );
  }

  if (claims.length === 0) {
    lines.push("| 无 | 暂无领取分片 | 无 | 无 | 无 | 无 | 无 | 无 |");
  }

  lines.push(claimMarkers.end);
  return lines.join("\n");
}

function renderStatusSummary(tasks, claims) {
  const activeClaims = claims.filter((claim) => claim.fields["状态"] !== "已完成");
  const recentlyCompleted = tasks.filter((task) => task.fields["状态"] === "已完成").slice(-5);

  const lines = [
    statusMarkers.start,
    "## 9. 自动生成分片同步摘要",
    "",
    "> 本节由 `npm run docs:sync` 生成。请修改 `docs/tasks/items/` 和 `docs/tasks/claims/` 中的分片文件，不要手工编辑本节。",
    "",
    "### 任务分片",
    "",
    `- 已扫描任务分片：${tasks.length} 个。`,
    `- 已扫描领取分片：${claims.length} 个。`,
    "",
    "### 当前未完成领取",
    "",
  ];

  if (activeClaims.length === 0) {
    lines.push("- 暂无未完成领取分片。");
  } else {
    for (const claim of activeClaims) {
      lines.push(
        `- ${claim.id}：${claim.title}，${claim.fields["领取人"] || "未填写领取人"}，状态：${claim.fields["状态"] || "未填写"}`,
      );
    }
  }

  lines.push("", "### 最近完成任务分片", "");

  if (recentlyCompleted.length === 0) {
    lines.push("- 暂无已完成任务分片。");
  } else {
    for (const task of recentlyCompleted) {
      lines.push(`- ${task.id}：${task.title}，负责人：${task.fields["负责人"] || "未填写"}`);
    }
  }

  lines.push(statusMarkers.end);
  return lines.join("\n");
}

function upsertGeneratedBlock(content, block, markers) {
  const startIndex = content.indexOf(markers.start);
  const endIndex = content.indexOf(markers.end);

  if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
    const before = content.slice(0, startIndex).trimEnd();
    const after = content.slice(endIndex + markers.end.length).trimStart();
    return [before, block, after].filter(Boolean).join("\n\n");
  }

  return `${content.trimEnd()}\n\n${block}\n`;
}

async function sync() {
  const [tasks, claims] = await Promise.all([
    parseDirectoryEntries(paths.taskItems),
    parseDirectoryEntries(paths.taskClaims),
  ]);

  const taskBoard = await readMarkdown(paths.taskBoard);
  await writeMarkdown(paths.taskBoard, upsertGeneratedBlock(taskBoard, renderTaskSummary(tasks), taskMarkers));

  const claimsDoc = await readMarkdown(paths.claims);
  await writeMarkdown(paths.claims, upsertGeneratedBlock(claimsDoc, renderClaimSummary(claims), claimMarkers));

  const statusDoc = await readMarkdown(paths.status);
  await writeMarkdown(paths.status, upsertGeneratedBlock(statusDoc, renderStatusSummary(tasks, claims), statusMarkers));

  console.log(`Synced ${tasks.length} task item(s) and ${claims.length} claim item(s).`);
}

sync().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
