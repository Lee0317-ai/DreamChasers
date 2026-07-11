"use strict";

const childProcess = require("node:child_process");
const crypto = require("node:crypto");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const {
  HulebuReleaseError,
  evaluateCreatorBuild,
  loadReleaseConfig,
  readBuildManifest,
  smokeBuild,
  validateBuildArtifacts,
  writeBuildManifest,
} = require("./hulebu-cocos-release.cjs");

const DEFAULT_CREATOR_EXECUTABLE =
  "/Applications/Cocos/Creator/3.8.8/CocosCreator.app/Contents/MacOS/CocosCreator";
const PROMOTION_JOURNAL_NAME = ".hulebu-cocos-promotion.json";
const PROMOTION_JOURNAL_TEMP_NAME = `${PROMOTION_JOURNAL_NAME}.tmp`;
const SCRIPT_DIRECTORY = __dirname;
const RELEASE_SOURCE_INPUTS = Object.freeze([
  "apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/.creator",
  "apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets",
  "apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/package.json",
  "apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/settings/v2/packages",
  "apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json",
  "apps/game/mahjong-roguelike/release/hulebu-v1.release.json",
  "apps/game/mahjong-roguelike/scripts/build-hulebu-cocos.cjs",
  "apps/game/mahjong-roguelike/scripts/hulebu-cocos-release.cjs",
  "package.json",
]);
const DEFAULT_PATHS = Object.freeze({
  repositoryRoot: path.resolve(SCRIPT_DIRECTORY, "../../../.."),
  projectRoot: path.resolve(SCRIPT_DIRECTORY, "../cocos/hulebu-cocos-3.8.8"),
  configPath: path.resolve(
    SCRIPT_DIRECTORY,
    "../release/hulebu-v1.release.json",
  ),
});

function parseArguments(argv, environment = process.env) {
  const result = {
    creatorExecutable:
      typeof environment.COCOS_CREATOR_BIN === "string" &&
      environment.COCOS_CREATOR_BIN.length > 0
        ? environment.COCOS_CREATOR_BIN
        : DEFAULT_CREATOR_EXECUTABLE,
    verifyOnly: false,
  };
  const seen = new Set();

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (!["--creator", "--output-root", "--verify-only"].includes(argument)) {
      throw new HulebuReleaseError(`Unknown argument: ${argument}`);
    }
    if (seen.has(argument)) {
      throw new HulebuReleaseError(`Duplicate argument: ${argument}`);
    }
    seen.add(argument);

    if (argument === "--verify-only") {
      result.verifyOnly = true;
      continue;
    }

    const value = argv[index + 1];
    if (
      typeof value !== "string" ||
      value.length === 0 ||
      value.startsWith("--")
    ) {
      throw new HulebuReleaseError(`Missing value for ${argument}`);
    }
    index += 1;
    if (argument === "--creator") result.creatorExecutable = value;
    if (argument === "--output-root") result.outputRoot = value;
  }

  return result;
}

function resolveOutputPaths({ config, cwd, outputRoot, projectRoot }) {
  if (
    typeof outputRoot === "string" &&
    (outputRoot.includes(";") || /[\0\r\n]/.test(outputRoot))
  ) {
    throw new HulebuReleaseError(
      "output root contains characters unsupported by Creator build arguments",
    );
  }
  const resolvedOutputRoot = outputRoot
    ? path.resolve(cwd, outputRoot)
    : path.resolve(projectRoot, "build/production");
  if (resolvedOutputRoot === path.parse(resolvedOutputRoot).root) {
    throw new HulebuReleaseError("output root must not be a filesystem root");
  }
  if (config.outputName !== "web-mobile") {
    throw new HulebuReleaseError("outputName must be web-mobile");
  }
  const buildRoot = path.resolve(resolvedOutputRoot, config.outputName);
  if (
    path.dirname(buildRoot) !== resolvedOutputRoot ||
    path.relative(resolvedOutputRoot, buildRoot) !== config.outputName
  ) {
    throw new HulebuReleaseError(
      "build root must be the web-mobile output child",
    );
  }
  return { outputRoot: resolvedOutputRoot, buildRoot };
}

function assertOutputOutsideReleaseInputs({
  outputRoot,
  repositoryRoot,
  sourceInputs,
}) {
  const resolvedOutputRoot = path.resolve(outputRoot);
  const resolvedRepositoryRoot = path.resolve(repositoryRoot);
  const existingOutputAncestor = findExistingAncestor(resolvedOutputRoot);
  const realOutputRoot = path.resolve(
    fs.realpathSync(existingOutputAncestor),
    path.relative(existingOutputAncestor, resolvedOutputRoot),
  );
  const realRepositoryRoot = fs.realpathSync(resolvedRepositoryRoot);
  const overlappingInputs = sourceInputs.filter((sourceInput) => {
    const resolvedInput = path.resolve(realRepositoryRoot, sourceInput);
    return (
      resolvedInput === realOutputRoot ||
      isPathInside(resolvedInput, realOutputRoot) ||
      isPathInside(realOutputRoot, resolvedInput)
    );
  });
  if (overlappingInputs.length > 0) {
    throw new HulebuReleaseError(
      `output root overlaps formal build inputs: ${overlappingInputs.join(", ")}`,
    );
  }
}

function findExistingAncestor(candidatePath) {
  let currentPath = candidatePath;
  while (!fs.existsSync(currentPath)) {
    const parentPath = path.dirname(currentPath);
    if (parentPath === currentPath) {
      throw new HulebuReleaseError(
        "unable to resolve an existing output root ancestor",
      );
    }
    currentPath = parentPath;
  }
  return currentPath;
}

function isPathInside(parentPath, candidatePath) {
  const relative = path.relative(parentPath, candidatePath);
  return (
    relative !== "" &&
    relative !== ".." &&
    !relative.startsWith(`..${path.sep}`) &&
    !path.isAbsolute(relative)
  );
}

function buildCreatorArguments({ config, outputRoot, projectRoot }) {
  if (
    [outputRoot, projectRoot].some(
      (value) =>
        typeof value !== "string" ||
        value.length === 0 ||
        value.includes(";") ||
        /[\0\r\n]/.test(value),
    )
  ) {
    throw new HulebuReleaseError(
      "Creator project and output paths must not contain separators or control characters",
    );
  }
  return [
    "--project",
    projectRoot,
    "--build",
    `platform=${config.platform};debug=false;buildPath=${outputRoot};outputName=${config.outputName}`,
  ];
}

function createExactCommitProjectSnapshot({
  commit,
  projectRoot,
  repositoryRoot,
  temporaryRoot = os.tmpdir(),
}) {
  if (!/^(?:[0-9a-f]{40}|[0-9a-f]{64})$/i.test(commit)) {
    throw new HulebuReleaseError("snapshot commit must be a full Git commit");
  }
  const absoluteRepositoryRoot = fs.realpathSync(repositoryRoot);
  const absoluteProjectRoot = fs.realpathSync(projectRoot);
  const relativeProjectRoot = path.relative(
    absoluteRepositoryRoot,
    absoluteProjectRoot,
  );
  if (
    relativeProjectRoot === "" ||
    relativeProjectRoot === ".." ||
    relativeProjectRoot.startsWith(`..${path.sep}`) ||
    path.isAbsolute(relativeProjectRoot)
  ) {
    throw new HulebuReleaseError(
      "snapshot project root must be inside the repository",
    );
  }
  const containerRoot = fs.mkdtempSync(
    path.join(path.resolve(temporaryRoot), "hulebu-cocos-source-"),
  );
  const checkoutRoot = path.join(containerRoot, "checkout");
  let added = false;
  try {
    childProcess.execFileSync(
      "git",
      ["worktree", "add", "--detach", checkoutRoot, commit],
      {
        cwd: absoluteRepositoryRoot,
        stdio: ["ignore", "ignore", "pipe"],
        maxBuffer: 16 * 1024 * 1024,
      },
    );
    added = true;
    const snapshotProjectRoot = path.join(checkoutRoot, relativeProjectRoot);
    const projectStatus = fs.lstatSync(snapshotProjectRoot);
    if (projectStatus.isSymbolicLink() || !projectStatus.isDirectory()) {
      throw new HulebuReleaseError(
        "snapshot project root must be a real directory",
      );
    }
    let worktreeRemoved = false;
    let containerRemoved = false;
    return {
      checkoutRoot,
      projectRoot: snapshotProjectRoot,
      release() {
        if (!worktreeRemoved) {
          childProcess.execFileSync(
            "git",
            ["worktree", "remove", "--force", checkoutRoot],
            {
              cwd: absoluteRepositoryRoot,
              stdio: ["ignore", "ignore", "pipe"],
              maxBuffer: 16 * 1024 * 1024,
            },
          );
          worktreeRemoved = true;
        }
        if (!containerRemoved) {
          fs.rmSync(containerRoot, { recursive: true, force: true });
          containerRemoved = true;
        }
      },
    };
  } catch (error) {
    if (added) {
      try {
        childProcess.execFileSync(
          "git",
          ["worktree", "remove", "--force", checkoutRoot],
          { cwd: absoluteRepositoryRoot, stdio: "ignore" },
        );
      } catch {
        // Preserve the snapshot creation failure and leave recovery evidence.
      }
    }
    if (!added || !fs.existsSync(checkoutRoot)) {
      fs.rmSync(containerRoot, { recursive: true, force: true });
    }
    if (error instanceof HulebuReleaseError) throw error;
    throw new HulebuReleaseError(
      `Unable to create exact-commit project snapshot: ${sanitizeErrorMessage(error)}`,
    );
  }
}

function ensureRealOutputRoot(outputRoot) {
  const resolvedOutputRoot = path.resolve(outputRoot);
  if (resolvedOutputRoot === path.parse(resolvedOutputRoot).root) {
    throw new HulebuReleaseError("output root must not be a filesystem root");
  }
  fs.mkdirSync(resolvedOutputRoot, { recursive: true });
  const outputStatus = fs.lstatSync(resolvedOutputRoot);
  if (outputStatus.isSymbolicLink() || !outputStatus.isDirectory()) {
    throw new HulebuReleaseError("output root must be a real directory");
  }
  return resolvedOutputRoot;
}

function createBuildAttempt({ outputName, outputRoot }) {
  if (outputName !== "web-mobile") {
    throw new HulebuReleaseError("attempt outputName must be web-mobile");
  }
  const resolvedOutputRoot = ensureRealOutputRoot(outputRoot);
  const outputRootIdentity = inspectOutputRootIdentity(resolvedOutputRoot);
  const attemptRoot = fs.mkdtempSync(
    path.join(resolvedOutputRoot, ".hulebu-attempt-"),
  );
  assertOutputRootIdentity(resolvedOutputRoot, outputRootIdentity);
  const attemptIdentity = fileIdentity(
    fs.lstatSync(attemptRoot, { bigint: true }),
  );
  let cleaned = false;
  return {
    outputRoot: attemptRoot,
    buildRoot: path.join(attemptRoot, outputName),
    logPath: path.join(attemptRoot, "hulebu-cocos-build.log"),
    cleanup() {
      if (cleaned) return;
      assertOutputRootIdentity(resolvedOutputRoot, outputRootIdentity);
      let currentIdentity;
      try {
        currentIdentity = fileIdentity(
          fs.lstatSync(attemptRoot, { bigint: true }),
        );
      } catch (error) {
        throw new HulebuReleaseError(
          `build attempt identity changed: ${sanitizeErrorMessage(error)}`,
        );
      }
      if (currentIdentity !== attemptIdentity) {
        throw new HulebuReleaseError("build attempt identity changed");
      }
      fs.rmSync(attemptRoot, { recursive: true, force: true });
      cleaned = true;
    },
  };
}

function beginBuildPromotion({
  attemptBuildRoot,
  attemptLogPath,
  finalBuildRoot,
  finalLogPath,
  outputRoot,
  renameSync = fs.renameSync,
}) {
  const resolvedOutputRoot = ensureRealOutputRoot(outputRoot);
  for (const [candidate, label] of [
    [finalBuildRoot, "final build"],
    [finalLogPath, "final log"],
  ]) {
    if (path.dirname(path.resolve(candidate)) !== resolvedOutputRoot) {
      throw new HulebuReleaseError(
        `${label} path must be a direct child of output root`,
      );
    }
  }
  const attemptRoot = path.dirname(path.resolve(attemptBuildRoot));
  if (
    path.dirname(attemptRoot) !== resolvedOutputRoot ||
    !path.basename(attemptRoot).startsWith(".hulebu-attempt-") ||
    path.resolve(attemptLogPath) !==
      path.join(attemptRoot, "hulebu-cocos-build.log")
  ) {
    throw new HulebuReleaseError(
      "promotion attempt paths must belong to one output-root attempt",
    );
  }
  if (
    path.basename(path.resolve(finalBuildRoot)) !== "web-mobile" ||
    path.basename(path.resolve(finalLogPath)) !== "hulebu-cocos-build.log"
  ) {
    throw new HulebuReleaseError("promotion final paths are invalid");
  }
  assertPromotionEntry(attemptBuildRoot, "directory", "attempt build");
  assertPromotionEntry(attemptLogPath, "file", "attempt log");
  if (
    pathExistsNoFollow(
      path.join(resolvedOutputRoot, PROMOTION_JOURNAL_NAME),
      "promotion journal",
    )
  ) {
    throw new HulebuReleaseError(
      "pending build promotion must be recovered",
    );
  }

  const token = crypto.randomBytes(16).toString("hex");
  const backupBuildRoot = path.join(
    resolvedOutputRoot,
    `.hulebu-backup-build-${token}`,
  );
  const backupLogPath = path.join(
    resolvedOutputRoot,
    `.hulebu-backup-log-${token}`,
  );
  const state = {
    oldBuildParked: false,
    oldLogParked: false,
    newBuildPublished: false,
    newLogPublished: false,
    settled: false,
  };
  const journal = {
    schemaVersion: 1,
    token,
    phase: "promoting",
    step: "prepared",
    attemptName: path.basename(attemptRoot),
    backupBuildName: path.basename(backupBuildRoot),
    backupLogName: path.basename(backupLogPath),
    finalBuildName: "web-mobile",
    finalLogName: "hulebu-cocos-build.log",
    hadOldBuild: pathExistsNoFollow(finalBuildRoot, "final build root"),
    hadOldLog: pathExistsNoFollow(finalLogPath, "final Creator log"),
  };
  writePromotionJournal(resolvedOutputRoot, journal);

  const updateJournal = (phase, step) => {
    journal.phase = phase;
    journal.step = step;
    writePromotionJournal(resolvedOutputRoot, journal);
  };

  const rollback = () => {
    if (state.settled) return;
    const errors = [];
    try {
      updateJournal("rolling-back", "rollback-started");
    } catch (error) {
      errors.push(`journal: ${sanitizeErrorMessage(error)}`);
    }
    for (const [stateKey, from, to, label] of [
      ["newLogPublished", finalLogPath, attemptLogPath, "new log"],
      ["newBuildPublished", finalBuildRoot, attemptBuildRoot, "new build"],
      ["oldLogParked", backupLogPath, finalLogPath, "old log"],
      ["oldBuildParked", backupBuildRoot, finalBuildRoot, "old build"],
    ]) {
      if (!state[stateKey]) continue;
      try {
        renameSync(from, to);
        state[stateKey] = false;
        try {
          updateJournal("rolling-back", `rolled-back-${stateKey}`);
        } catch (error) {
          errors.push(`journal after ${label}: ${sanitizeErrorMessage(error)}`);
        }
      } catch (error) {
        errors.push(`${label}: ${sanitizeErrorMessage(error)}`);
      }
    }
    if (errors.length > 0) {
      throw new HulebuReleaseError(
        `build promotion rollback failed; recovery paths ${backupBuildRoot}, ${backupLogPath}: ${errors.join("; ")}`,
      );
    }
    removePromotionJournal(resolvedOutputRoot);
    state.settled = true;
  };

  try {
    if (journal.hadOldBuild) {
      renameSync(finalBuildRoot, backupBuildRoot);
      state.oldBuildParked = true;
      updateJournal("promoting", "old-build-parked");
    }
    if (journal.hadOldLog) {
      renameSync(finalLogPath, backupLogPath);
      state.oldLogParked = true;
      updateJournal("promoting", "old-log-parked");
    }
    renameSync(attemptBuildRoot, finalBuildRoot);
    state.newBuildPublished = true;
    updateJournal("promoting", "new-build-published");
    renameSync(attemptLogPath, finalLogPath);
    state.newLogPublished = true;
    updateJournal("promoting", "new-log-published");
  } catch (error) {
    try {
      rollback();
    } catch (rollbackError) {
      const combinedError = new HulebuReleaseError(
        `${sanitizeErrorMessage(error)}; ${sanitizeErrorMessage(rollbackError)}`,
      );
      combinedError.preserveBuildAttempt = true;
      throw combinedError;
    }
    throw error;
  }

  return {
    rollback,
    finalize() {
      if (state.settled) {
        throw new HulebuReleaseError("build promotion is already settled");
      }
      updateJournal("committed", "publication-verified");
      state.settled = true;
      const cleanupWarnings = [];
      for (const [candidate, label] of [
        [backupBuildRoot, "old build backup"],
        [backupLogPath, "old log backup"],
      ]) {
        try {
          fs.rmSync(candidate, { recursive: true, force: true });
        } catch (error) {
          cleanupWarnings.push(`${label}: ${sanitizeErrorMessage(error)}`);
        }
      }
      try {
        removePromotionJournal(resolvedOutputRoot);
      } catch (error) {
        cleanupWarnings.push(
          `promotion journal: ${sanitizeErrorMessage(error)}`,
        );
      }
      return { cleanupWarnings };
    },
  };
}

function recoverPendingBuildPromotion(outputRoot) {
  const resolvedOutputRoot = ensureRealOutputRoot(outputRoot);
  const temporaryPath = path.join(
    resolvedOutputRoot,
    PROMOTION_JOURNAL_TEMP_NAME,
  );
  try {
    fs.rmSync(temporaryPath, { force: true });
  } catch (error) {
    throw new HulebuReleaseError(
      `Unable to remove temporary promotion journal: ${sanitizeErrorMessage(error)}`,
    );
  }
  const journal = readPromotionJournal(resolvedOutputRoot);
  if (!journal) {
    return { recovered: false, cleanupWarnings: [] };
  }
  const paths = resolvePromotionJournalPaths(resolvedOutputRoot, journal);
  const cleanupWarnings = [];

  if (journal.phase === "committed") {
    assertPromotionEntry(paths.finalBuildRoot, "directory", "committed build");
    assertPromotionEntry(paths.finalLogPath, "file", "committed log");
    cleanupPromotionPath(
      paths.backupBuildRoot,
      "old build backup",
      cleanupWarnings,
    );
    cleanupPromotionPath(
      paths.backupLogPath,
      "old log backup",
      cleanupWarnings,
    );
    cleanupPromotionPath(paths.attemptRoot, "build attempt", cleanupWarnings);
    removePromotionJournal(resolvedOutputRoot);
    return { action: "completed", cleanupWarnings, recovered: true };
  }

  recoverPromotionEntry({
    attemptPath: paths.attemptLogPath,
    backupPath: paths.backupLogPath,
    expectedType: "file",
    finalPath: paths.finalLogPath,
    hadOld: journal.hadOldLog,
    label: "Creator log",
  });
  journal.step = "recovered-log";
  journal.phase = "rolling-back";
  writePromotionJournal(resolvedOutputRoot, journal);
  recoverPromotionEntry({
    attemptPath: paths.attemptBuildRoot,
    backupPath: paths.backupBuildRoot,
    expectedType: "directory",
    finalPath: paths.finalBuildRoot,
    hadOld: journal.hadOldBuild,
    label: "build",
  });
  journal.step = "recovered-build";
  writePromotionJournal(resolvedOutputRoot, journal);
  cleanupPromotionPath(paths.attemptRoot, "build attempt", cleanupWarnings);
  removePromotionJournal(resolvedOutputRoot);
  return { action: "rolled-back", cleanupWarnings, recovered: true };
}

function recoverPromotionEntry({
  attemptPath,
  backupPath,
  expectedType,
  finalPath,
  hadOld,
  label,
}) {
  const backupType = inspectPromotionEntry(backupPath, `${label} backup`);
  const finalType = inspectPromotionEntry(finalPath, `final ${label}`);
  const attemptType = inspectPromotionEntry(attemptPath, `attempt ${label}`);
  for (const [actualType, entryLabel] of [
    [backupType, `${label} backup`],
    [finalType, `final ${label}`],
    [attemptType, `attempt ${label}`],
  ]) {
    if (actualType !== "missing" && actualType !== expectedType) {
      throw new HulebuReleaseError(
        `promotion recovery ${entryLabel} has an unexpected type`,
      );
    }
  }

  if (backupType !== "missing") {
    if (finalType !== "missing") {
      if (attemptType !== "missing") {
        throw new HulebuReleaseError(
          `promotion recovery ${label} state is ambiguous`,
        );
      }
      fs.mkdirSync(path.dirname(attemptPath), { recursive: true });
      fs.renameSync(finalPath, attemptPath);
    }
    fs.renameSync(backupPath, finalPath);
    return;
  }

  if (hadOld) {
    if (finalType === "missing" || attemptType === "missing") {
      throw new HulebuReleaseError(
        `promotion recovery cannot prove the old ${label}`,
      );
    }
    return;
  }

  if (finalType !== "missing") {
    if (attemptType !== "missing") {
      throw new HulebuReleaseError(
        `promotion recovery ${label} state is ambiguous`,
      );
    }
    fs.mkdirSync(path.dirname(attemptPath), { recursive: true });
    fs.renameSync(finalPath, attemptPath);
    return;
  }
  if (attemptType === "missing") {
    throw new HulebuReleaseError(
      `promotion recovery cannot locate the new ${label}`,
    );
  }
}

function cleanupPromotionPath(candidatePath, label, cleanupWarnings) {
  try {
    fs.rmSync(candidatePath, { recursive: true, force: true });
  } catch (error) {
    cleanupWarnings.push(`${label}: ${sanitizeErrorMessage(error)}`);
  }
}

function inspectPromotionEntry(candidatePath, label) {
  try {
    const status = fs.lstatSync(candidatePath);
    if (status.isSymbolicLink()) {
      throw new HulebuReleaseError(`${label} must not be a symlink`);
    }
    if (status.isDirectory()) return "directory";
    if (status.isFile()) return "file";
    throw new HulebuReleaseError(`${label} has an unsupported type`);
  } catch (error) {
    if (error?.code === "ENOENT") return "missing";
    throw error;
  }
}

function assertPromotionEntry(candidatePath, expectedType, label) {
  const actualType = inspectPromotionEntry(candidatePath, label);
  if (actualType !== expectedType) {
    throw new HulebuReleaseError(`${label} must be a ${expectedType}`);
  }
}

function writePromotionJournal(outputRoot, journal) {
  validatePromotionJournal(journal);
  const journalPath = path.join(outputRoot, PROMOTION_JOURNAL_NAME);
  const temporaryPath = path.join(outputRoot, PROMOTION_JOURNAL_TEMP_NAME);
  let descriptor;
  try {
    fs.rmSync(temporaryPath, { force: true });
    descriptor = openExclusiveNoFollow(temporaryPath, fs.constants.O_WRONLY);
    fs.writeFileSync(descriptor, `${JSON.stringify(journal)}\n`, "utf8");
    fs.fsyncSync(descriptor);
    fs.closeSync(descriptor);
    descriptor = undefined;
    fs.renameSync(temporaryPath, journalPath);
    fsyncDirectoryBestEffort(outputRoot);
  } finally {
    if (descriptor !== undefined) {
      try {
        fs.closeSync(descriptor);
      } catch {
        // Preserve the journal write failure.
      }
    }
    try {
      fs.rmSync(temporaryPath, { force: true });
    } catch {
      // Preserve the journal write failure.
    }
  }
}

function readPromotionJournal(outputRoot) {
  const journalPath = path.join(outputRoot, PROMOTION_JOURNAL_NAME);
  let descriptor;
  try {
    const noFollowFlag = fs.constants.O_NOFOLLOW;
    if (typeof noFollowFlag !== "number") {
      throw new HulebuReleaseError(
        "Filesystem no-follow opens are unavailable",
      );
    }
    descriptor = fs.openSync(
      journalPath,
      fs.constants.O_RDONLY | noFollowFlag,
    );
    const status = fs.fstatSync(descriptor, { bigint: true });
    if (!status.isFile() || status.size <= 0n || status.size > 64n * 1024n) {
      throw new HulebuReleaseError("promotion journal size is invalid");
    }
    const journal = JSON.parse(fs.readFileSync(descriptor, "utf8"));
    validatePromotionJournal(journal);
    return journal;
  } catch (error) {
    if (error?.code === "ENOENT") return undefined;
    if (error instanceof HulebuReleaseError) throw error;
    throw new HulebuReleaseError(
      `Unable to read promotion journal: ${sanitizeErrorMessage(error)}`,
    );
  } finally {
    if (descriptor !== undefined) {
      try {
        fs.closeSync(descriptor);
      } catch {
        // Preserve the journal read result.
      }
    }
  }
}

function validatePromotionJournal(journal) {
  if (
    !journal ||
    typeof journal !== "object" ||
    Array.isArray(journal) ||
    journal.schemaVersion !== 1 ||
    !/^[0-9a-f]{32}$/i.test(journal.token) ||
    !["promoting", "rolling-back", "committed"].includes(journal.phase) ||
    typeof journal.step !== "string" ||
    !isSafePromotionName(journal.attemptName, ".hulebu-attempt-") ||
    journal.backupBuildName !== `.hulebu-backup-build-${journal.token}` ||
    journal.backupLogName !== `.hulebu-backup-log-${journal.token}` ||
    journal.finalBuildName !== "web-mobile" ||
    journal.finalLogName !== "hulebu-cocos-build.log" ||
    typeof journal.hadOldBuild !== "boolean" ||
    typeof journal.hadOldLog !== "boolean"
  ) {
    throw new HulebuReleaseError("promotion journal is invalid");
  }
}

function isSafePromotionName(value, prefix) {
  return (
    typeof value === "string" &&
    value.startsWith(prefix) &&
    value.length > prefix.length &&
    path.basename(value) === value &&
    !/[\0\r\n]/.test(value)
  );
}

function resolvePromotionJournalPaths(outputRoot, journal) {
  const attemptRoot = path.join(outputRoot, journal.attemptName);
  return {
    attemptRoot,
    attemptBuildRoot: path.join(attemptRoot, journal.finalBuildName),
    attemptLogPath: path.join(attemptRoot, journal.finalLogName),
    backupBuildRoot: path.join(outputRoot, journal.backupBuildName),
    backupLogPath: path.join(outputRoot, journal.backupLogName),
    finalBuildRoot: path.join(outputRoot, journal.finalBuildName),
    finalLogPath: path.join(outputRoot, journal.finalLogName),
  };
}

function removePromotionJournal(outputRoot) {
  const journalPath = path.join(outputRoot, PROMOTION_JOURNAL_NAME);
  try {
    fs.unlinkSync(journalPath);
  } catch (error) {
    if (error?.code === "ENOENT") return;
    throw error;
  }
  fsyncDirectoryBestEffort(outputRoot);
}

function fsyncDirectoryBestEffort(directoryPath) {
  let descriptor;
  try {
    descriptor = fs.openSync(directoryPath, fs.constants.O_RDONLY);
    fs.fsyncSync(descriptor);
  } catch (error) {
    if (!["EINVAL", "ENOTSUP", "EISDIR", "EPERM"].includes(error?.code)) {
      throw error;
    }
  } finally {
    if (descriptor !== undefined) {
      fs.closeSync(descriptor);
    }
  }
}

function pathExistsNoFollow(candidatePath, label) {
  try {
    const status = fs.lstatSync(candidatePath);
    if (status.isSymbolicLink()) {
      throw new HulebuReleaseError(`${label} must not be a symlink`);
    }
    return true;
  } catch (error) {
    if (error?.code === "ENOENT") return false;
    throw error;
  }
}

function createExclusiveTemporaryFile(finalPath) {
  const noFollowFlag =
    typeof fs.constants.O_NOFOLLOW === "number" ? fs.constants.O_NOFOLLOW : 0;
  for (let attempt = 0; attempt < 10; attempt += 1) {
    const temporaryPath = `${finalPath}.${process.pid}.${crypto
      .randomBytes(8)
      .toString("hex")}.tmp`;
    try {
      const fileDescriptor = fs.openSync(
        temporaryPath,
        fs.constants.O_WRONLY |
          fs.constants.O_CREAT |
          fs.constants.O_EXCL |
          noFollowFlag,
        0o600,
      );
      return { fileDescriptor, temporaryPath };
    } catch (error) {
      if (error?.code !== "EEXIST") throw error;
    }
  }
  throw new HulebuReleaseError("Unable to reserve a temporary Creator log");
}

async function runCreatorProcess({
  creatorArguments,
  creatorExecutable,
  environment,
  outputRoot,
  projectRoot,
  spawn = childProcess.spawn,
}) {
  fs.mkdirSync(outputRoot, { recursive: true });
  const logPath = path.join(outputRoot, "hulebu-cocos-build.log");
  const { fileDescriptor, temporaryPath } =
    createExclusiveTemporaryFile(logPath);
  let descriptorOpen = true;

  try {
    let outcome;
    try {
      const child = spawn(creatorExecutable, creatorArguments, {
        cwd: projectRoot,
        env: environment,
        shell: false,
        windowsHide: true,
        stdio: ["ignore", fileDescriptor, fileDescriptor],
      });
      outcome = await new Promise((resolveOutcome) => {
        let settled = false;
        let asynchronousSpawnError;
        const settle = (value) => {
          if (settled) return;
          settled = true;
          resolveOutcome(value);
        };
        child.once("error", (error) => {
          asynchronousSpawnError = error;
        });
        child.once("close", (exitCode, signal) => {
          if (asynchronousSpawnError) {
            settle({ kind: "spawn-error", error: asynchronousSpawnError });
            return;
          }
          if (signal || !Number.isInteger(exitCode)) {
            settle({ kind: "signal", signal: signal || "unknown" });
            return;
          }
          settle({ kind: "exit", exitCode });
        });
      });
    } catch (error) {
      outcome = {
        kind: "spawn-error",
        error: error instanceof Error ? error : new Error(String(error)),
      };
    }

    if (outcome.kind === "spawn-error") {
      fs.writeSync(
        fileDescriptor,
        `Hulebu wrapper: unable to start Creator: ${outcome.error.message}\n`,
      );
    } else if (outcome.kind === "signal") {
      fs.writeSync(
        fileDescriptor,
        `Hulebu wrapper: Creator terminated by signal ${outcome.signal}\n`,
      );
    }

    fs.fsyncSync(fileDescriptor);
    const temporaryStatus = fs.fstatSync(fileDescriptor);
    fs.closeSync(fileDescriptor);
    descriptorOpen = false;
    fs.renameSync(temporaryPath, logPath);
    return {
      outcome,
      logPath,
      logText: readPublishedLog(logPath, temporaryStatus),
    };
  } finally {
    if (descriptorOpen) {
      try {
        fs.closeSync(fileDescriptor);
      } catch {
        // Preserve the original process or log failure.
      }
    }
    try {
      fs.rmSync(temporaryPath, { force: true });
    } catch {
      // Preserve the original process or log failure.
    }
  }
}

function readPublishedLog(logPath, expectedStatus) {
  const noFollowFlag =
    typeof fs.constants.O_NOFOLLOW === "number" ? fs.constants.O_NOFOLLOW : 0;
  const descriptor = fs.openSync(logPath, fs.constants.O_RDONLY | noFollowFlag);
  try {
    const publishedStatus = fs.fstatSync(descriptor);
    if (
      publishedStatus.dev !== expectedStatus.dev ||
      publishedStatus.ino !== expectedStatus.ino
    ) {
      throw new HulebuReleaseError("Creator log changed during publication");
    }
    return fs.readFileSync(descriptor, "utf8");
  } finally {
    fs.closeSync(descriptor);
  }
}

function acquireOutputLock(outputRoot, options = {}) {
  const resolvedOutputRoot = ensureRealOutputRoot(outputRoot);
  const outputRootIdentity = inspectOutputRootIdentity(resolvedOutputRoot);
  const lockPath = path.join(
    resolvedOutputRoot,
    ".hulebu-cocos-build.lock",
  );
  const anchorPath = path.join(
    path.dirname(resolvedOutputRoot),
    `.hulebu-cocos-build-${crypto
      .createHash("sha256")
      .update(resolvedOutputRoot)
      .digest("hex")
      .slice(0, 32)}.lock`,
  );
  const now = options.now || (() => new Date());
  const pid = options.pid ?? process.pid;
  const hostname = options.hostname || os.hostname();
  const tokenFactory =
    options.tokenFactory || (() => crypto.randomBytes(32).toString("hex"));
  const probePid = options.probePid || probeLocalPid;
  const staleGraceMs = options.staleGraceMs ?? 30_000;
  const acquiredAt = now();
  const token = tokenFactory();
  if (
    !Number.isInteger(pid) ||
    pid <= 0 ||
    typeof hostname !== "string" ||
    hostname.length === 0 ||
    !Number.isFinite(acquiredAt.getTime()) ||
    !/^[0-9a-f]{64}$/i.test(token) ||
    !Number.isFinite(staleGraceMs) ||
    staleGraceMs < 0
  ) {
    throw new HulebuReleaseError("build lock options are invalid");
  }

  for (let acquireAttempt = 0; acquireAttempt < 3; acquireAttempt += 1) {
    let descriptor;
    try {
      descriptor = openExclusiveNoFollow(anchorPath, fs.constants.O_RDWR);
    } catch (error) {
      if (error?.code !== "EEXIST") throw error;
      let existing;
      try {
        existing = inspectLockFile(anchorPath);
      } catch (inspectionError) {
        if (inspectionError?.code === "ENOENT") continue;
        throw inspectionError;
      }
      if (
        !canReclaimLock({
          existing,
          hostname,
          now: acquiredAt,
          probePid,
          staleGraceMs,
        })
      ) {
        throw describeHeldLock(resolvedOutputRoot, existing);
      }
      reclaimStaleLock({
        existing,
        hostname,
        lockPath: anchorPath,
        now: acquiredAt,
        pid,
        probePid,
        staleGraceMs,
        token,
      });
      continue;
    }

    const metadata = {
      schemaVersion: 1,
      token,
      pid,
      hostname,
      acquiredAt: acquiredAt.toISOString(),
    };
    let identity = fileIdentity(
      fs.fstatSync(descriptor, { bigint: true }),
    );
    try {
      fs.writeFileSync(descriptor, `${JSON.stringify(metadata)}\n`, "utf8");
      fs.fsyncSync(descriptor);
      const published = inspectLockFile(anchorPath);
      if (
        published.identity !== identity ||
        published.record?.token !== token
      ) {
        throw new HulebuReleaseError(
          "build lock changed while it was being created",
        );
      }
      assertOutputRootIdentity(resolvedOutputRoot, outputRootIdentity);
      publishDiagnosticLock({
        anchorPath,
        anchorIdentity: identity,
        hostname,
        lockPath,
        now: acquiredAt,
        pid,
        probePid,
        staleGraceMs,
        token,
      });
      assertOutputRootIdentity(resolvedOutputRoot, outputRootIdentity);
    } catch (error) {
      try {
        if (identity && inspectLockFile(lockPath).identity === identity) {
          fs.unlinkSync(lockPath);
        }
      } catch {
        // Preserve the lock creation failure and leave recovery evidence.
      }
      try {
        if (identity && inspectLockFile(anchorPath).identity === identity) {
          fs.unlinkSync(anchorPath);
        }
      } catch {
        // Preserve the lock creation failure and leave recovery evidence.
      }
      try {
        fs.closeSync(descriptor);
      } catch {
        // Preserve the lock creation failure.
      }
      throw error;
    }

    let released = false;
    const assertOwnership = () => {
      assertOutputRootIdentity(resolvedOutputRoot, outputRootIdentity);
      let anchor;
      let diagnostic;
      try {
        anchor = inspectLockFile(anchorPath);
        diagnostic = inspectLockFile(lockPath);
      } catch (error) {
        throw new HulebuReleaseError(
          `build lock ownership changed: ${sanitizeErrorMessage(error)}`,
        );
      }
      if (
        anchor.identity !== identity ||
        diagnostic.identity !== identity ||
        anchor.record?.token !== token ||
        diagnostic.record?.token !== token
      ) {
        throw new HulebuReleaseError("build lock ownership changed");
      }
    };
    return {
      assertOwnership,
      release() {
        if (released) return;
        try {
          assertOwnership();
        } catch (error) {
          try {
            if (inspectLockFile(anchorPath).identity === identity) {
              fs.unlinkSync(anchorPath);
            }
          } catch {
            // Preserve the ownership failure without touching replacements.
          }
          try {
            fs.closeSync(descriptor);
          } finally {
            released = true;
          }
          throw error;
        }
        fs.unlinkSync(lockPath);
        fs.unlinkSync(anchorPath);
        released = true;
        try {
          fs.closeSync(descriptor);
        } catch (error) {
          throw new HulebuReleaseError(
            `build lock was released but its descriptor did not close: ${sanitizeErrorMessage(error)}`,
          );
        }
      },
    };
  }
  throw new HulebuReleaseError(
    `unable to acquire Hulebu build lock after stale-lock recovery: ${resolvedOutputRoot}`,
  );
}

function inspectOutputRootIdentity(outputRoot) {
  try {
    const status = fs.lstatSync(outputRoot, { bigint: true });
    if (status.isSymbolicLink() || !status.isDirectory()) {
      throw new HulebuReleaseError("output root identity changed");
    }
    return fileIdentity(status);
  } catch (error) {
    if (error instanceof HulebuReleaseError) throw error;
    throw new HulebuReleaseError(
      `output root identity changed: ${sanitizeErrorMessage(error)}`,
    );
  }
}

function assertOutputRootIdentity(outputRoot, expectedIdentity) {
  if (inspectOutputRootIdentity(outputRoot) !== expectedIdentity) {
    throw new HulebuReleaseError("output root identity changed");
  }
}

function publishDiagnosticLock({
  anchorPath,
  anchorIdentity,
  hostname,
  lockPath,
  now,
  pid,
  probePid,
  staleGraceMs,
  token,
}) {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      fs.linkSync(anchorPath, lockPath);
      const published = inspectLockFile(lockPath);
      if (published.identity !== anchorIdentity || published.record?.token !== token) {
        throw new HulebuReleaseError(
          "diagnostic build lock changed while it was being created",
        );
      }
      return;
    } catch (error) {
      if (error?.code !== "EEXIST") throw error;
      let existing;
      try {
        existing = inspectLockFile(lockPath);
      } catch (inspectionError) {
        if (inspectionError?.code === "ENOENT") continue;
        throw inspectionError;
      }
      if (existing.identity === anchorIdentity) return;
      if (
        !canReclaimLock({
          existing,
          hostname,
          now,
          probePid,
          staleGraceMs,
        })
      ) {
        throw describeHeldLock(path.dirname(lockPath), existing);
      }
      reclaimStaleLock({
        existing,
        hostname,
        lockPath,
        now,
        pid,
        probePid,
        staleGraceMs,
        token,
      });
    }
  }
  throw new HulebuReleaseError(
    "unable to publish diagnostic Hulebu build lock",
  );
}

function openExclusiveNoFollow(filePath, accessFlag) {
  const noFollowFlag =
    typeof fs.constants.O_NOFOLLOW === "number" ? fs.constants.O_NOFOLLOW : 0;
  return fs.openSync(
    filePath,
    accessFlag |
      fs.constants.O_CREAT |
      fs.constants.O_EXCL |
      noFollowFlag,
    0o600,
  );
}

function inspectLockFile(lockPath) {
  const noFollowFlag =
    typeof fs.constants.O_NOFOLLOW === "number" ? fs.constants.O_NOFOLLOW : 0;
  const pathStatus = fs.lstatSync(lockPath, { bigint: true });
  if (pathStatus.isSymbolicLink() || !pathStatus.isFile()) {
    throw new HulebuReleaseError(
      "existing build lock must be a regular non-symlink file",
    );
  }
  if (pathStatus.size > 4096n) {
    throw new HulebuReleaseError("existing build lock metadata is too large");
  }
  const descriptor = fs.openSync(
    lockPath,
    fs.constants.O_RDONLY | noFollowFlag,
  );
  try {
    const status = fs.fstatSync(descriptor, { bigint: true });
    const identity = fileIdentity(status);
    if (identity !== fileIdentity(pathStatus)) {
      throw new HulebuReleaseError(
        "existing build lock changed during inspection",
      );
    }
    const raw = fs.readFileSync(descriptor);
    const fingerprint = crypto.createHash("sha256").update(raw).digest("hex");
    let record;
    try {
      record = JSON.parse(raw.toString("utf8"));
    } catch {
      record = undefined;
    }
    if (!isValidLockRecord(record)) record = undefined;
    return {
      identity,
      fingerprint,
      mtimeMs: Number(status.mtimeMs),
      record,
    };
  } finally {
    fs.closeSync(descriptor);
  }
}

function fileIdentity(status) {
  return `${status.dev.toString()}:${status.ino.toString()}`;
}

function isValidLockRecord(record) {
  return Boolean(
    record &&
      typeof record === "object" &&
      !Array.isArray(record) &&
      record.schemaVersion === 1 &&
      /^[0-9a-f]{64}$/i.test(record.token) &&
      Number.isInteger(record.pid) &&
      record.pid > 0 &&
      typeof record.hostname === "string" &&
      record.hostname.length > 0 &&
      typeof record.acquiredAt === "string" &&
      Number.isFinite(Date.parse(record.acquiredAt)),
  );
}

function canReclaimLock({
  existing,
  hostname,
  now,
  probePid,
  staleGraceMs,
}) {
  const referenceTime = existing.record
    ? Date.parse(existing.record.acquiredAt)
    : existing.mtimeMs;
  const ageMs = now.getTime() - referenceTime;
  if (!Number.isFinite(ageMs) || ageMs < staleGraceMs) return false;
  if (!existing.record) return true;
  if (existing.record.hostname !== hostname) return false;
  return probePid(existing.record.pid) === "dead";
}

function describeHeldLock(outputRoot, existing) {
  const detail = existing.record
    ? ` (pid ${existing.record.pid}, host ${existing.record.hostname}, acquired ${existing.record.acquiredAt})`
    : " (metadata is incomplete or invalid)";
  return new HulebuReleaseError(
    `another Hulebu build is using output root: ${outputRoot}${detail}`,
  );
}

function reclaimStaleLock({
  existing,
  hostname,
  lockPath,
  now,
  pid,
  probePid,
  staleGraceMs,
  token,
}) {
  const claimPath = `${lockPath}.reap-${existing.fingerprint.slice(0, 32)}`;
  let claimDescriptor;
  let claimIdentity;
  for (let claimAttempt = 0; claimAttempt < 3; claimAttempt += 1) {
    try {
      claimDescriptor = openExclusiveNoFollow(claimPath, fs.constants.O_RDWR);
      break;
    } catch (error) {
      if (error?.code !== "EEXIST") throw error;
      let orphanedClaim;
      try {
        orphanedClaim = inspectLockFile(claimPath);
      } catch (inspectionError) {
        if (inspectionError?.code === "ENOENT") continue;
        throw inspectionError;
      }
      if (
        (orphanedClaim.record &&
          orphanedClaim.record.targetFingerprint !== existing.fingerprint) ||
        !canReclaimLock({
          existing: orphanedClaim,
          hostname,
          now,
          probePid,
          staleGraceMs,
        })
      ) {
        throw new HulebuReleaseError(
          "another process is recovering the stale Hulebu build lock",
        );
      }
      removeOrphanedRecoveryClaim(claimPath, orphanedClaim.identity);
    }
  }
  if (claimDescriptor === undefined) {
    throw new HulebuReleaseError(
      "unable to acquire stale-lock recovery claim",
    );
  }
  try {
    claimIdentity = fileIdentity(
      fs.fstatSync(claimDescriptor, { bigint: true }),
    );
    fs.writeFileSync(
      claimDescriptor,
      `${JSON.stringify({
        schemaVersion: 1,
        token,
        pid,
        hostname,
        acquiredAt: now.toISOString(),
        targetFingerprint: existing.fingerprint,
      })}\n`,
      "utf8",
    );
    fs.fsyncSync(claimDescriptor);
    const current = inspectLockFile(lockPath);
    if (
      current.identity !== existing.identity ||
      current.fingerprint !== existing.fingerprint ||
      !canReclaimLock({
        existing: current,
        hostname,
        now,
        probePid,
        staleGraceMs,
      })
    ) {
      throw new HulebuReleaseError(
        "stale build lock changed during recovery",
      );
    }
    fs.unlinkSync(lockPath);
  } finally {
    if (claimDescriptor !== undefined) {
      try {
        fs.closeSync(claimDescriptor);
      } catch {
        // Preserve the recovery result.
      }
    }
    if (claimIdentity) {
      try {
        if (inspectLockFile(claimPath).identity === claimIdentity) {
          fs.unlinkSync(claimPath);
        }
      } catch (error) {
        if (error?.code !== "ENOENT") {
          // A leftover claim blocks unsafe concurrent recovery and is diagnosable.
        }
      }
    }
  }
}

function removeOrphanedRecoveryClaim(claimPath, expectedIdentity) {
  const tombstonePath = `${claimPath}.stale-${process.pid}-${crypto
    .randomBytes(8)
    .toString("hex")}`;
  fs.renameSync(claimPath, tombstonePath);
  let movedIdentity;
  try {
    movedIdentity = inspectLockFile(tombstonePath).identity;
    if (movedIdentity !== expectedIdentity) {
      throw new HulebuReleaseError(
        "stale-lock recovery claim changed during recovery",
      );
    }
    fs.unlinkSync(tombstonePath);
  } catch (error) {
    if (movedIdentity !== expectedIdentity) {
      try {
        fs.renameSync(tombstonePath, claimPath);
      } catch {
        // Preserve both the unexpected entry and the recovery failure.
      }
    }
    throw error;
  }
}

function probeLocalPid(pid) {
  try {
    process.kill(pid, 0);
    return "alive";
  } catch (error) {
    if (error?.code === "ESRCH") return "dead";
    return "unknown";
  }
}

function readGitCommit(repositoryRoot) {
  const commit = childProcess
    .execFileSync("git", ["rev-parse", "HEAD"], {
      cwd: repositoryRoot,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
      maxBuffer: 1024 * 1024,
    })
    .trim();
  if (!/^(?:[0-9a-f]{40}|[0-9a-f]{64})$/i.test(commit)) {
    throw new HulebuReleaseError(
      "Unable to determine the full HEAD commit",
    );
  }
  return commit;
}

function assertReleaseInputsClean({
  commit = "HEAD",
  repositoryRoot,
  sourceInputs = RELEASE_SOURCE_INPUTS,
  git,
}) {
  const normalizedInputs = [...sourceInputs];
  if (
    normalizedInputs.length === 0 ||
    normalizedInputs.some(
      (entry) =>
        typeof entry !== "string" ||
        entry.length === 0 ||
        path.isAbsolute(entry) ||
        entry.includes("\\") ||
        entry.includes("\0") ||
        entry.startsWith(":") ||
        entry.split("/").some((segment) => segment === "." || segment === "..") ||
        path.posix.normalize(entry) !== entry,
    ) ||
    new Set(normalizedInputs).size !== normalizedInputs.length
  ) {
    throw new HulebuReleaseError(
      "formal build input paths must be unique portable relative paths",
    );
  }

  const runGit =
    git ||
    ((...args) =>
      childProcess.execFileSync("git", args, {
        cwd: repositoryRoot,
        stdio: ["ignore", "pipe", "pipe"],
        maxBuffer: 64 * 1024 * 1024,
      }));
  let statusBuffer;
  try {
    statusBuffer = runGit(
      "status",
      "--porcelain=v1",
      "-z",
      "--untracked-files=all",
      "--ignored=matching",
      "--no-renames",
      "--",
      ...normalizedInputs.map((entry) => `:(literal)${entry}`),
    );
  } catch (error) {
    throw new HulebuReleaseError(
      `Unable to inspect formal build inputs: ${sanitizeErrorMessage(error)}`,
    );
  }
  if (typeof statusBuffer === "string") {
    statusBuffer = Buffer.from(statusBuffer, "utf8");
  }
  if (!Buffer.isBuffer(statusBuffer)) {
    throw new HulebuReleaseError(
      "Unable to inspect formal build inputs: Git returned non-text status",
    );
  }

  const statusText = statusBuffer.toString("utf8");
  if (!Buffer.from(statusText, "utf8").equals(statusBuffer)) {
    throw new HulebuReleaseError(
      "Git returned non-UTF-8 formal build status",
    );
  }

  const dirtyPaths = statusText
    .split("\0")
    .filter(Boolean)
    .map((entry) => {
      if (entry.length < 4 || entry[2] !== " ") {
        throw new HulebuReleaseError("Git returned malformed formal build status");
      }
      return entry.slice(3);
    })
    .sort(comparePortableText);
  if (dirtyPaths.length > 0) {
    throw new HulebuReleaseError(
      `formal build inputs are dirty: ${dirtyPaths.join(", ")}`,
    );
  }

  let indexBuffer;
  try {
    indexBuffer = runGit(
      "ls-files",
      "--stage",
      "-z",
      "--",
      ...normalizedInputs.map((entry) => `:(literal)${entry}`),
    );
  } catch (error) {
    throw new HulebuReleaseError(
      `Unable to inspect formal build input modes: ${sanitizeErrorMessage(error)}`,
    );
  }
  if (typeof indexBuffer === "string") {
    indexBuffer = Buffer.from(indexBuffer, "utf8");
  }
  if (!Buffer.isBuffer(indexBuffer)) {
    throw new HulebuReleaseError(
      "Unable to inspect formal build input modes: Git returned non-text index",
    );
  }
  const indexText = indexBuffer.toString("utf8");
  if (!Buffer.from(indexText, "utf8").equals(indexBuffer)) {
    throw new HulebuReleaseError(
      "Git returned non-UTF-8 formal build input index",
    );
  }
  const variableEntries = [];
  const stageZeroPaths = [];
  for (const entry of indexText.split("\0").filter(Boolean)) {
    const match = /^([0-7]{6}) ([0-9a-f]{40}|[0-9a-f]{64}) ([0-3])\t([\s\S]+)$/i.exec(
      entry,
    );
    if (!match) {
      throw new HulebuReleaseError(
        "Git returned malformed formal build input index",
      );
    }
    if (match[1] === "120000" || match[1] === "160000") {
      variableEntries.push(match[4]);
    }
    if (match[3] !== "0") {
      throw new HulebuReleaseError(
        `formal build inputs contain an unresolved index stage: ${match[4]}`,
      );
    }
    stageZeroPaths.push(match[4]);
  }
  if (variableEntries.length > 0) {
    throw new HulebuReleaseError(
      `formal build inputs contain a symlink or gitlink: ${variableEntries.sort(comparePortableText).join(", ")}`,
    );
  }
  assertEverySourceInputMatches(normalizedInputs, stageZeroPaths);

  let flagBuffer;
  try {
    flagBuffer = runGit(
      "ls-files",
      "-v",
      "-z",
      "--",
      ...normalizedInputs.map((entry) => `:(literal)${entry}`),
    );
  } catch (error) {
    throw new HulebuReleaseError(
      `Unable to inspect formal build input flags: ${sanitizeErrorMessage(error)}`,
    );
  }
  const flagText = decodeGitBuffer(
    flagBuffer,
    "formal build input flags",
  );
  const flaggedPaths = [];
  const flagPaths = [];
  for (const entry of flagText.split("\0").filter(Boolean)) {
    const match = /^([^ ]) ([\s\S]+)$/.exec(entry);
    if (!match) {
      throw new HulebuReleaseError(
        "Git returned malformed formal build input flags",
      );
    }
    flagPaths.push(match[2]);
    if (match[1] !== "H") flaggedPaths.push(match[2]);
  }
  if (
    JSON.stringify([...flagPaths].sort(comparePortableText)) !==
    JSON.stringify([...stageZeroPaths].sort(comparePortableText))
  ) {
    throw new HulebuReleaseError(
      "Git formal build input flags do not match the stage-0 index",
    );
  }
  if (flaggedPaths.length > 0) {
    throw new HulebuReleaseError(
      `formal build inputs use special index flags: ${flaggedPaths.sort(comparePortableText).join(", ")}`,
    );
  }

  let treeBuffer;
  try {
    treeBuffer = runGit(
      "ls-tree",
      "-r",
      "-z",
      "--full-tree",
      commit,
      "--",
      ...normalizedInputs.map((entry) => `:(literal)${entry}`),
    );
  } catch (error) {
    throw new HulebuReleaseError(
      `Unable to inspect formal build input tree: ${sanitizeErrorMessage(error)}`,
    );
  }
  const treeText = decodeGitBuffer(treeBuffer, "formal build input tree");
  const treePaths = [];
  for (const entry of treeText.split("\0").filter(Boolean)) {
    const match = /^(100644|100755) blob ([0-9a-f]{40}|[0-9a-f]{64})\t([\s\S]+)$/i.exec(
      entry,
    );
    if (!match) {
      throw new HulebuReleaseError(
        "Git returned a non-regular or malformed formal build input tree entry",
      );
    }
    treePaths.push(match[3]);
  }
  assertEverySourceInputMatches(normalizedInputs, treePaths);
  if (
    JSON.stringify([...treePaths].sort(comparePortableText)) !==
    JSON.stringify([...stageZeroPaths].sort(comparePortableText))
  ) {
    throw new HulebuReleaseError(
      "formal build input index does not match the selected commit tree",
    );
  }
  const normalizedTreeBuffer = Buffer.isBuffer(treeBuffer)
    ? treeBuffer
    : Buffer.from(treeBuffer, "utf8");
  return {
    sourceInputs: normalizedInputs,
    sourceState: "clean",
    sourceTreeSha256: crypto
      .createHash("sha256")
      .update("hulebu-release-source-tree-v1\0", "utf8")
      .update(normalizedTreeBuffer)
      .digest("hex"),
  };
}

function decodeGitBuffer(value, label) {
  const buffer = typeof value === "string" ? Buffer.from(value, "utf8") : value;
  if (!Buffer.isBuffer(buffer)) {
    throw new HulebuReleaseError(
      `Unable to inspect ${label}: Git returned non-text output`,
    );
  }
  const text = buffer.toString("utf8");
  if (!Buffer.from(text, "utf8").equals(buffer)) {
    throw new HulebuReleaseError(`Git returned non-UTF-8 ${label}`);
  }
  return text;
}

function assertEverySourceInputMatches(sourceInputs, trackedPaths) {
  const missingInputs = sourceInputs.filter(
    (sourceInput) =>
      !trackedPaths.some(
        (trackedPath) =>
          trackedPath === sourceInput ||
          trackedPath.startsWith(`${sourceInput}/`),
      ),
  );
  if (missingInputs.length > 0) {
    throw new HulebuReleaseError(
      `formal build input paths do not match tracked files: ${missingInputs.join(", ")}`,
    );
  }
}

function comparePortableText(left, right) {
  if (left < right) return -1;
  if (left > right) return 1;
  return 0;
}

function createBuildId(commit, createdAt) {
  const suffix = createdAt.replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
  return `${commit.slice(0, 12)}-${suffix}`;
}

function hashFileSha256(filePath) {
  try {
    const status = fs.lstatSync(filePath);
    if (status.isSymbolicLink() || !status.isFile()) {
      throw new HulebuReleaseError("release config must be a regular file");
    }
    return crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
  } catch (error) {
    if (error instanceof HulebuReleaseError) throw error;
    throw new HulebuReleaseError(`Unable to hash release config: ${error.message}`);
  }
}

function inspectCreatorExecutable(executablePath, config, options = {}) {
  if (typeof executablePath !== "string" || executablePath.length === 0) {
    throw new HulebuReleaseError("Creator executable path is invalid");
  }
  const requestedPath = path.resolve(executablePath);
  let descriptor;
  let realPath;
  let sha256;
  try {
    const requestedStatus = fs.lstatSync(requestedPath, { bigint: true });
    if (requestedStatus.isSymbolicLink() || !requestedStatus.isFile()) {
      throw new HulebuReleaseError(
        "Creator executable must be a regular non-symlink file",
      );
    }
    fs.accessSync(requestedPath, fs.constants.R_OK | fs.constants.X_OK);
    realPath = fs.realpathSync(requestedPath);
    if (realPath !== config.creatorExecutableRealPath) {
      throw new HulebuReleaseError(
        "Creator executable real path does not match release config",
      );
    }
    const noFollowFlag = fs.constants.O_NOFOLLOW;
    if (typeof noFollowFlag !== "number") {
      throw new HulebuReleaseError(
        "Filesystem no-follow opens are unavailable",
      );
    }
    descriptor = fs.openSync(
      requestedPath,
      fs.constants.O_RDONLY | noFollowFlag,
    );
    const descriptorStatus = fs.fstatSync(descriptor, { bigint: true });
    const pathStatus = fs.lstatSync(requestedPath, { bigint: true });
    if (
      !descriptorStatus.isFile() ||
      fileIdentity(descriptorStatus) !== fileIdentity(pathStatus)
    ) {
      throw new HulebuReleaseError(
        "Creator executable changed during inspection",
      );
    }
    sha256 = crypto
      .createHash("sha256")
      .update(fs.readFileSync(descriptor))
      .digest("hex");
    const pathStatusAfter = fs.lstatSync(requestedPath, { bigint: true });
    if (fileIdentity(descriptorStatus) !== fileIdentity(pathStatusAfter)) {
      throw new HulebuReleaseError(
        "Creator executable changed during inspection",
      );
    }
  } catch (error) {
    if (error instanceof HulebuReleaseError) throw error;
    throw new HulebuReleaseError(
      `Unable to inspect Creator executable: ${sanitizeErrorMessage(error)}`,
    );
  } finally {
    if (descriptor !== undefined) {
      try {
        fs.closeSync(descriptor);
      } catch {
        // Preserve the executable inspection result.
      }
    }
  }
  if (sha256 !== config.creatorExecutableSha256) {
    throw new HulebuReleaseError(
      "Creator executable SHA-256 does not match release config",
    );
  }
  const readBundleMetadata =
    options.readBundleMetadata || readCreatorBundleMetadata;
  const bundleMetadata = readBundleMetadata(realPath);
  if (bundleMetadata.bundleIdentifier !== config.creatorBundleIdentifier) {
    throw new HulebuReleaseError(
      "Creator bundle identifier does not match release config",
    );
  }
  if (bundleMetadata.version !== config.creatorVersion) {
    throw new HulebuReleaseError(
      "Creator bundle version does not match release config",
    );
  }
  return {
    creatorBundleIdentifier: bundleMetadata.bundleIdentifier,
    creatorBundleVersion: bundleMetadata.version,
    creatorExecutableRealPath: realPath,
    creatorExecutableSha256: sha256,
  };
}

function readCreatorBundleMetadata(executableRealPath) {
  const marker = `${path.sep}Contents${path.sep}MacOS${path.sep}`;
  const markerIndex = executableRealPath.lastIndexOf(marker);
  if (markerIndex <= 0) {
    throw new HulebuReleaseError(
      "Creator executable is not inside a macOS application bundle",
    );
  }
  const infoPlistPath = path.join(
    executableRealPath.slice(0, markerIndex),
    "Contents",
    "Info.plist",
  );
  const readValue = (key) => {
    try {
      const status = fs.lstatSync(infoPlistPath);
      if (status.isSymbolicLink() || !status.isFile()) {
        throw new HulebuReleaseError(
          "Creator Info.plist must be a regular non-symlink file",
        );
      }
      return childProcess
        .execFileSync(
          "/usr/bin/plutil",
          ["-extract", key, "raw", "--", infoPlistPath],
          {
            encoding: "utf8",
            stdio: ["ignore", "pipe", "pipe"],
            maxBuffer: 1024 * 1024,
          },
        )
        .trim();
    } catch (error) {
      if (error instanceof HulebuReleaseError) throw error;
      throw new HulebuReleaseError(
        `Unable to read Creator bundle metadata: ${sanitizeErrorMessage(error)}`,
      );
    }
  };
  return {
    bundleIdentifier: readValue("CFBundleIdentifier"),
    version: readValue("CFBundleShortVersionString"),
  };
}

function captureReleaseSourceState({
  assertInputsClean,
  getCommit,
  repositoryRoot,
  sourceInputs,
}) {
  const commitBefore = getCommit();
  const sourceEvidence = assertInputsClean({
    commit: commitBefore,
    repositoryRoot,
    sourceInputs,
  });
  const commitAfter = getCommit();
  if (commitBefore !== commitAfter) {
    throw new HulebuReleaseError("HEAD changed while inspecting formal build inputs");
  }
  return { ...sourceEvidence, commit: commitAfter };
}

function throwArtifactErrors(artifactResult) {
  if (artifactResult.errors.length > 0) {
    throw new HulebuReleaseError(
      `Creator build artifacts are invalid: ${artifactResult.errors.join("; ")}`,
    );
  }
}

async function runRelease(argv, effects = {}) {
  const environment = effects.environment || process.env;
  const cwd = effects.cwd || process.cwd();
  const paths = effects.paths || DEFAULT_PATHS;
  const parsed = parseArguments(argv, environment);
  const hashReleaseConfig = effects.hashFileSha256 || hashFileSha256;
  const configHashBeforeRead = hashReleaseConfig(paths.configPath);
  const loadConfig = effects.loadReleaseConfig || loadReleaseConfig;
  const config = loadConfig(paths.configPath);
  const releaseConfigSha256 = hashReleaseConfig(paths.configPath);
  if (configHashBeforeRead !== releaseConfigSha256) {
    throw new HulebuReleaseError("release config changed while being loaded");
  }
  const outputPaths = resolveOutputPaths({
    config,
    cwd,
    outputRoot: parsed.outputRoot,
    projectRoot: paths.projectRoot,
  });
  const validateArtifacts =
    effects.validateBuildArtifacts || validateBuildArtifacts;
  const runSmoke = effects.smokeBuild || smokeBuild;
  const getCommit =
    effects.getCommit || (() => readGitCommit(paths.repositoryRoot));
  const assertInputsClean =
    effects.assertReleaseInputsClean || assertReleaseInputsClean;
  const sourceInputs = effects.releaseSourceInputs || RELEASE_SOURCE_INPUTS;
  assertOutputOutsideReleaseInputs({
    outputRoot: outputPaths.outputRoot,
    repositoryRoot: paths.repositoryRoot,
    sourceInputs,
  });
  const captureSourceState =
    effects.captureReleaseSourceState || captureReleaseSourceState;
  const now = effects.now || (() => new Date());
  const lockOutput = effects.acquireOutputLock || acquireOutputLock;
  const outputLock = lockOutput(outputPaths.outputRoot);
  let outputOwnershipLost = false;
  const assertOutputOwnership = () => {
    if (typeof outputLock.assertOwnership !== "function") return;
    try {
      outputLock.assertOwnership();
    } catch (error) {
      outputOwnershipLost = true;
      throw error;
    }
  };
  let attempt;
  let projectSnapshot;
  let promotion;
  let result;
  let failure;
  let preserveAttempt = false;
  const startupCleanupWarnings = [];
  try {
    assertOutputOwnership();
    const recoverPromotion =
      effects.recoverPendingBuildPromotion || recoverPendingBuildPromotion;
    const recoveryResult = recoverPromotion(outputPaths.outputRoot);
    startupCleanupWarnings.push(...(recoveryResult.cleanupWarnings || []));
    assertOutputOwnership();
    const preflight = captureSourceState({
      assertInputsClean,
      getCommit,
      repositoryRoot: paths.repositoryRoot,
      sourceInputs,
    });
    assertOutputOwnership();
    if (parsed.verifyOnly) {
      assertOutputOwnership();
      const artifactResult = validateArtifacts(outputPaths.buildRoot, config);
      throwArtifactErrors(artifactResult);
      assertOutputOwnership();
      const readManifest = effects.readBuildManifest || readBuildManifest;
      const manifest = readManifest(outputPaths.buildRoot, {
        commit: preflight.commit,
        config,
        releaseConfigSha256,
        sourceInputs: preflight.sourceInputs,
        sourceTreeSha256: preflight.sourceTreeSha256,
      });
      const smokeResults = await runSmoke(
        outputPaths.buildRoot,
        config.smokePaths,
      );
      assertOutputOwnership();
      const postflight = captureSourceState({
        assertInputsClean,
        getCommit,
        repositoryRoot: paths.repositoryRoot,
        sourceInputs,
      });
      if (preflight.commit !== postflight.commit) {
        throw new HulebuReleaseError("HEAD changed during build verification");
      }
      if (preflight.sourceTreeSha256 !== postflight.sourceTreeSha256) {
        throw new HulebuReleaseError(
          "formal build source tree changed during build verification",
        );
      }
      if (hashReleaseConfig(paths.configPath) !== releaseConfigSha256) {
        throw new HulebuReleaseError("release config changed during build verification");
      }
      assertOutputOwnership();
      result = {
        ok: true,
        mode: "verify-only",
        projectRoot: paths.projectRoot,
        outputRoot: outputPaths.outputRoot,
        buildRoot: outputPaths.buildRoot,
        buildId: manifest.buildId,
        commit: manifest.commit,
        verifiedAt: now().toISOString(),
        creatorInvoked: false,
        manifestWritten: false,
        sourceInputs: preflight.sourceInputs,
        sourceState: preflight.sourceState,
        sourceTreeSha256: preflight.sourceTreeSha256,
        smokeResults,
        cleanupWarnings: [...startupCleanupWarnings],
      };
    } else {
      const inspectCreator =
        effects.inspectCreatorExecutable || inspectCreatorExecutable;
      const creatorExecutableEvidence = inspectCreator(
        parsed.creatorExecutable,
        config,
      );
      assertOutputOwnership();
      const createSnapshot =
        effects.createExactCommitProjectSnapshot ||
        createExactCommitProjectSnapshot;
      projectSnapshot = createSnapshot({
        commit: preflight.commit,
        projectRoot: paths.projectRoot,
        repositoryRoot: paths.repositoryRoot,
        temporaryRoot: effects.snapshotTemporaryRoot,
      });
      assertOutputOwnership();
      const createAttempt = effects.createBuildAttempt || createBuildAttempt;
      attempt = createAttempt({
        outputName: config.outputName,
        outputRoot: outputPaths.outputRoot,
      });
      assertOutputOwnership();
      const creatorArguments = buildCreatorArguments({
        config,
        outputRoot: attempt.outputRoot,
        projectRoot: projectSnapshot.projectRoot,
      });
      const executeCreator = effects.runCreatorProcess || runCreatorProcess;
      const creatorResult = await executeCreator({
        creatorArguments,
        creatorExecutable: parsed.creatorExecutable,
        environment,
        outputRoot: attempt.outputRoot,
        projectRoot: projectSnapshot.projectRoot,
        spawn: effects.spawn || childProcess.spawn,
      });
      assertOutputOwnership();
      const artifactResult = validateArtifacts(attempt.buildRoot, config);
      assertOutputOwnership();

      if (creatorResult.outcome.kind === "spawn-error") {
        throw new HulebuReleaseError(
          `unable to start Creator: ${creatorResult.outcome.error.message}`,
        );
      }
      if (creatorResult.outcome.kind === "signal") {
        throw new HulebuReleaseError(
          `Creator terminated by signal ${creatorResult.outcome.signal}`,
        );
      }

      const evaluateBuild =
        effects.evaluateCreatorBuild || evaluateCreatorBuild;
      const creatorDecision = evaluateBuild({
        exitCode: creatorResult.outcome.exitCode,
        logText: creatorResult.logText,
        artifactErrors: artifactResult.errors,
        config,
      });
      const smokeResults = await runSmoke(
        attempt.buildRoot,
        config.smokePaths,
      );
      assertOutputOwnership();
      const postflight = captureSourceState({
        assertInputsClean,
        getCommit,
        repositoryRoot: paths.repositoryRoot,
        sourceInputs,
      });
      assertMatchingSourceEvidence(
        preflight,
        postflight,
        "during Creator build",
      );
      if (hashReleaseConfig(paths.configPath) !== releaseConfigSha256) {
        throw new HulebuReleaseError(
          "release config changed during Creator build",
        );
      }
      assertOutputOwnership();
      const createdAt = now().toISOString();
      const buildId = createBuildId(preflight.commit, createdAt);
      const writeManifest = effects.writeBuildManifest || writeBuildManifest;
      writeManifest(attempt.buildRoot, {
        buildId,
        commit: preflight.commit,
        config,
        creatorDecision,
        creatorExecutableEvidence,
        createdAt,
        releaseConfigSha256,
        sourceInputs: postflight.sourceInputs,
        sourceState: postflight.sourceState,
        sourceTreeSha256: postflight.sourceTreeSha256,
        smokeResults,
      });
      assertOutputOwnership();
      const readManifest = effects.readBuildManifest || readBuildManifest;
      const manifestExpectation = {
        commit: preflight.commit,
        config,
        releaseConfigSha256,
        sourceInputs: postflight.sourceInputs,
        sourceTreeSha256: postflight.sourceTreeSha256,
      };
      readManifest(attempt.buildRoot, manifestExpectation);
      assertOutputOwnership();
      const finalflight = captureSourceState({
        assertInputsClean,
        getCommit,
        repositoryRoot: paths.repositoryRoot,
        sourceInputs,
      });
      assertMatchingSourceEvidence(
        preflight,
        finalflight,
        "while preparing build publication",
      );
      if (hashReleaseConfig(paths.configPath) !== releaseConfigSha256) {
        throw new HulebuReleaseError(
          "release config changed while preparing build publication",
        );
      }
      assertOutputOwnership();

      projectSnapshot.release();
      projectSnapshot = undefined;
      assertOutputOwnership();
      const promote = effects.beginBuildPromotion || beginBuildPromotion;
      const finalLogPath = path.join(
        outputPaths.outputRoot,
        "hulebu-cocos-build.log",
      );
      promotion = promote({
        attemptBuildRoot: attempt.buildRoot,
        attemptLogPath: attempt.logPath,
        finalBuildRoot: outputPaths.buildRoot,
        finalLogPath,
        outputRoot: outputPaths.outputRoot,
      });
      assertOutputOwnership();

      let manifestEvidence;
      try {
        manifestEvidence = readManifest(
          outputPaths.buildRoot,
          manifestExpectation,
        );
        assertOutputOwnership();
        const publicationFlight = captureSourceState({
          assertInputsClean,
          getCommit,
          repositoryRoot: paths.repositoryRoot,
          sourceInputs,
        });
        assertMatchingSourceEvidence(
          preflight,
          publicationFlight,
          "while publishing the validated build",
        );
        if (hashReleaseConfig(paths.configPath) !== releaseConfigSha256) {
          throw new HulebuReleaseError(
            "release config changed while publishing the validated build",
          );
        }
        assertOutputOwnership();
      } catch (error) {
        try {
          promotion.rollback();
          promotion = undefined;
        } catch (rollbackError) {
          throw combineErrors(
            error,
            "unable to roll back failed build publication",
            rollbackError,
          );
        }
        throw error;
      }

      const { cleanupWarnings: promotionCleanupWarnings } = promotion.finalize();
      const cleanupWarnings = [
        ...startupCleanupWarnings,
        ...promotionCleanupWarnings,
      ];
      promotion = undefined;
      assertOutputOwnership();
      try {
        attempt.cleanup();
        attempt = undefined;
      } catch (error) {
        cleanupWarnings.push(
          `build attempt cleanup: ${sanitizeErrorMessage(error)}`,
        );
        attempt = undefined;
      }
      result = {
        ok: true,
        mode: "build",
        projectRoot: paths.projectRoot,
        outputRoot: outputPaths.outputRoot,
        buildRoot: outputPaths.buildRoot,
        logPath: finalLogPath,
        manifestPath: path.join(
          outputPaths.buildRoot,
          "hulebu-build.json",
        ),
        buildId: manifestEvidence.buildId,
        commit: manifestEvidence.commit,
        createdAt: manifestEvidence.createdAt,
        creatorExitCode: creatorDecision.originalExitCode,
        creatorExitNormalized: creatorDecision.normalized,
        actualCreatorVersion: creatorDecision.actualCreatorVersion,
        ...creatorExecutableEvidence,
        sourceInputs: postflight.sourceInputs,
        sourceState: postflight.sourceState,
        sourceTreeSha256: postflight.sourceTreeSha256,
        smokeResults,
        cleanupWarnings,
      };
    }
  } catch (error) {
    failure = error;
    preserveAttempt = error?.preserveBuildAttempt === true;
  }

  if (promotion && !outputOwnershipLost) {
    try {
      promotion.rollback();
      promotion = undefined;
    } catch (error) {
      preserveAttempt = true;
      failure = combineErrors(
        failure,
        "unable to roll back build publication",
        error,
      );
    }
  }
  if (projectSnapshot) {
    try {
      projectSnapshot.release();
    } catch (error) {
      failure = combineErrors(
        failure,
        "unable to remove exact-commit project snapshot",
        error,
      );
    }
  }
  if (attempt && !outputOwnershipLost && !preserveAttempt) {
    try {
      attempt.cleanup();
    } catch (error) {
      failure = combineErrors(
        failure,
        "unable to remove failed build attempt",
        error,
      );
    }
  }
  try {
    outputLock.release();
  } catch (error) {
    if (!failure && result?.ok) {
      if (!Array.isArray(result.cleanupWarnings)) {
        result.cleanupWarnings = [];
      }
      result.cleanupWarnings.push(
        `build lock release: ${sanitizeErrorMessage(error)}`,
      );
    } else {
      failure = combineErrors(failure, "unable to release build lock", error);
    }
  }
  if (failure) throw failure;
  return result;
}

function assertMatchingSourceEvidence(expected, actual, period) {
  if (expected.commit !== actual.commit) {
    throw new HulebuReleaseError(`HEAD changed ${period}`);
  }
  if (expected.sourceTreeSha256 !== actual.sourceTreeSha256) {
    throw new HulebuReleaseError(`formal build source tree changed ${period}`);
  }
}

function combineErrors(primary, context, secondary) {
  if (!primary) {
    return new HulebuReleaseError(
      `${context}: ${sanitizeErrorMessage(secondary)}`,
    );
  }
  return new HulebuReleaseError(
    `${sanitizeErrorMessage(primary)}; ${context}: ${sanitizeErrorMessage(secondary)}`,
  );
}

function sanitizeErrorMessage(error) {
  const message = error instanceof Error ? error.message : String(error);
  return message.replace(/[\r\n\t ]+/g, " ").trim();
}

async function main(argv = process.argv.slice(2), effects = {}) {
  const writeStdout = effects.stdout || ((line) => process.stdout.write(line));
  const writeStderr = effects.stderr || ((line) => process.stderr.write(line));
  const setExitCode =
    effects.setExitCode ||
    ((code) => {
      process.exitCode = code;
    });
  const executeRelease = effects.runRelease || runRelease;

  try {
    const summary = await executeRelease(argv, effects);
    writeStdout(`${JSON.stringify(summary)}\n`);
    return summary;
  } catch (error) {
    writeStderr(`Hulebu Cocos build failed: ${sanitizeErrorMessage(error)}\n`);
    setExitCode(1);
    return null;
  }
}

if (require.main === module) {
  void main();
}

module.exports = {
  DEFAULT_CREATOR_EXECUTABLE,
  RELEASE_SOURCE_INPUTS,
  acquireOutputLock,
  assertReleaseInputsClean,
  beginBuildPromotion,
  buildCreatorArguments,
  captureReleaseSourceState,
  createBuildAttempt,
  createBuildId,
  createExactCommitProjectSnapshot,
  inspectCreatorExecutable,
  main,
  parseArguments,
  hashFileSha256,
  readGitCommit,
  recoverPendingBuildPromotion,
  resolveOutputPaths,
  runCreatorProcess,
  runRelease,
  sanitizeErrorMessage,
};
