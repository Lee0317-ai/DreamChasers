"use strict";

const childProcess = require("node:child_process");
const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");

const {
  HulebuReleaseError,
  evaluateCreatorBuild,
  loadReleaseConfig,
  smokeBuild,
  validateBuildArtifacts,
  writeBuildManifest,
} = require("./hulebu-cocos-release.cjs");

const DEFAULT_CREATOR_EXECUTABLE =
  "/Applications/Cocos/Creator/3.8.8/CocosCreator.app/Contents/MacOS/CocosCreator";
const SCRIPT_DIRECTORY = __dirname;
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

function buildCreatorArguments({ config, outputRoot, projectRoot }) {
  return [
    "--project",
    projectRoot,
    "--build",
    `platform=${config.platform};debug=false;buildPath=${outputRoot};outputName=${config.outputName}`,
  ];
}

function prepareBuildOutput({ buildRoot, outputRoot }) {
  const resolvedOutputRoot = path.resolve(outputRoot);
  const resolvedBuildRoot = path.resolve(buildRoot);
  if (resolvedOutputRoot === path.parse(resolvedOutputRoot).root) {
    throw new HulebuReleaseError("output root must not be a filesystem root");
  }
  if (
    path.dirname(resolvedBuildRoot) !== resolvedOutputRoot ||
    path.relative(resolvedOutputRoot, resolvedBuildRoot) !== "web-mobile"
  ) {
    throw new HulebuReleaseError(
      "build root must be the web-mobile output child",
    );
  }

  fs.mkdirSync(resolvedOutputRoot, { recursive: true });
  const outputStatus = fs.lstatSync(resolvedOutputRoot);
  if (outputStatus.isSymbolicLink() || !outputStatus.isDirectory()) {
    throw new HulebuReleaseError("output root must be a real directory");
  }
  try {
    const buildStatus = fs.lstatSync(resolvedBuildRoot);
    if (buildStatus.isSymbolicLink()) {
      throw new HulebuReleaseError("build root must not be a symlink");
    }
  } catch (error) {
    if (error instanceof HulebuReleaseError) throw error;
    if (error?.code !== "ENOENT") throw error;
  }
  fs.rmSync(resolvedBuildRoot, { recursive: true, force: true });
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
        const settle = (value) => {
          if (settled) return;
          settled = true;
          resolveOutcome(value);
        };
        child.once("error", (error) => {
          settle({ kind: "spawn-error", error });
        });
        child.once("close", (exitCode, signal) => {
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
    fs.closeSync(fileDescriptor);
    descriptorOpen = false;
    fs.renameSync(temporaryPath, logPath);
    return {
      outcome,
      logPath,
      logText: fs.readFileSync(logPath, "utf8"),
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

function readGitCommit(repositoryRoot) {
  const commit = childProcess
    .execFileSync("git", ["rev-parse", "--short=12", "HEAD"], {
      cwd: repositoryRoot,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    })
    .trim();
  if (!/^[0-9a-f]{12}$/i.test(commit)) {
    throw new HulebuReleaseError(
      "Unable to determine the 12-character HEAD commit",
    );
  }
  return commit;
}

function createBuildId(commit, createdAt) {
  const suffix = createdAt.replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
  return `${commit}-${suffix}`;
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
  const loadConfig = effects.loadReleaseConfig || loadReleaseConfig;
  const config = loadConfig(paths.configPath);
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
  const now = effects.now || (() => new Date());

  if (parsed.verifyOnly) {
    const artifactResult = validateArtifacts(outputPaths.buildRoot, config);
    throwArtifactErrors(artifactResult);
    const smokeResults = await runSmoke(
      outputPaths.buildRoot,
      config.smokePaths,
    );
    const commit = getCommit();
    const verifiedAt = now().toISOString();
    return {
      ok: true,
      mode: "verify-only",
      projectRoot: paths.projectRoot,
      outputRoot: outputPaths.outputRoot,
      buildRoot: outputPaths.buildRoot,
      commit,
      verifiedAt,
      creatorInvoked: false,
      manifestWritten: false,
      smokeResults,
    };
  }

  const commit = getCommit();
  const prepareOutput = effects.prepareBuildOutput || prepareBuildOutput;
  prepareOutput(outputPaths);
  const creatorArguments = buildCreatorArguments({
    config,
    outputRoot: outputPaths.outputRoot,
    projectRoot: paths.projectRoot,
  });
  const executeCreator = effects.runCreatorProcess || runCreatorProcess;
  const creatorResult = await executeCreator({
    creatorArguments,
    creatorExecutable: parsed.creatorExecutable,
    environment,
    outputRoot: outputPaths.outputRoot,
    projectRoot: paths.projectRoot,
    spawn: effects.spawn || childProcess.spawn,
  });
  const artifactResult = validateArtifacts(outputPaths.buildRoot, config);

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

  const evaluateBuild = effects.evaluateCreatorBuild || evaluateCreatorBuild;
  const creatorDecision = evaluateBuild({
    exitCode: creatorResult.outcome.exitCode,
    logText: creatorResult.logText,
    artifactErrors: artifactResult.errors,
    config,
  });
  const smokeResults = await runSmoke(outputPaths.buildRoot, config.smokePaths);
  const createdAt = now().toISOString();
  const buildId = createBuildId(commit, createdAt);
  const writeManifest = effects.writeBuildManifest || writeBuildManifest;
  const manifest = writeManifest(outputPaths.buildRoot, {
    buildId,
    commit,
    config,
    creatorDecision,
    createdAt,
    smokeResults,
  });

  return {
    ok: true,
    mode: "build",
    projectRoot: paths.projectRoot,
    outputRoot: outputPaths.outputRoot,
    buildRoot: outputPaths.buildRoot,
    logPath: creatorResult.logPath,
    manifestPath: manifest.path,
    buildId,
    commit,
    createdAt,
    creatorExitCode: creatorDecision.originalExitCode,
    creatorExitNormalized: creatorDecision.normalized,
    smokeResults,
  };
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
  buildCreatorArguments,
  createBuildId,
  main,
  parseArguments,
  prepareBuildOutput,
  readGitCommit,
  resolveOutputPaths,
  runCreatorProcess,
  runRelease,
  sanitizeErrorMessage,
};
