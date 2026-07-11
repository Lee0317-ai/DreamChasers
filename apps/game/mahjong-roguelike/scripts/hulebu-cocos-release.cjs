"use strict";

const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");

class HulebuReleaseError extends Error {
  constructor(message) {
    super(message);
    this.name = "HulebuReleaseError";
  }
}

function loadReleaseConfig(configPath) {
  let config;
  try {
    config = JSON.parse(fs.readFileSync(configPath, "utf8"));
  } catch (error) {
    throw new HulebuReleaseError(
      `Unable to read release config: ${error.message}`,
    );
  }
  validateReleaseConfig(config);
  return config;
}

function validateReleaseConfig(config) {
  if (config?.schemaVersion !== 1) {
    throw new HulebuReleaseError("release schemaVersion must be 1");
  }
  if (config.creatorVersion !== "3.8.8") {
    throw new HulebuReleaseError("creatorVersion must be 3.8.8");
  }
  if (config.platform !== "web-mobile") {
    throw new HulebuReleaseError("platform must be web-mobile");
  }
  if (config.debug !== false) {
    throw new HulebuReleaseError("debug must be false");
  }
  if (config.outputName !== "web-mobile") {
    throw new HulebuReleaseError("outputName must be web-mobile");
  }
  for (const key of [
    "requiredFiles",
    "requiredJsonFiles",
    "smokePaths",
    "allowedNonZeroExitCodes",
  ]) {
    if (!Array.isArray(config[key]) || config[key].length === 0) {
      throw new HulebuReleaseError(`${key} must be a non-empty array`);
    }
  }
  for (const key of ["requiredFiles", "requiredJsonFiles"]) {
    config[key].forEach((entry, index) => {
      validateArtifactPath(entry, `${key}[${index}]`);
    });
  }
  config.smokePaths.forEach((entry, index) => {
    validateSmokePath(entry, `smokePaths[${index}]`);
  });
  config.allowedNonZeroExitCodes.forEach((entry, index) => {
    if (!Number.isInteger(entry) || entry <= 0) {
      throw new HulebuReleaseError(
        `allowedNonZeroExitCodes[${index}] must be a positive integer`,
      );
    }
  });
  if (!config.requiredFiles.includes("index.html")) {
    throw new HulebuReleaseError("requiredFiles must include index.html");
  }
  const requiredFileSet = new Set(config.requiredFiles);
  for (const relativePath of config.requiredJsonFiles) {
    if (!requiredFileSet.has(relativePath)) {
      throw new HulebuReleaseError(
        `requiredJsonFiles entry must also be in requiredFiles: ${relativePath}`,
      );
    }
  }
  if (typeof config.finishedMarker !== "string" || !config.finishedMarker) {
    throw new HulebuReleaseError("finishedMarker must be a non-empty string");
  }
}

function validateArtifactPath(value, label) {
  if (typeof value !== "string" || value.length === 0) {
    throw new HulebuReleaseError(`${label} must be a non-empty string`);
  }
  if (
    path.posix.isAbsolute(value) ||
    path.win32.isAbsolute(value) ||
    /^[A-Za-z]:/.test(value) ||
    value.includes("\\") ||
    value.includes("\0")
  ) {
    throw new HulebuReleaseError(`${label} must be a portable relative path`);
  }
  const segments = value.split("/");
  if (segments.includes(".") || segments.includes("..")) {
    throw new HulebuReleaseError(`${label} must not contain dot segments`);
  }
  if (path.posix.normalize(value) !== value || value.endsWith("/")) {
    throw new HulebuReleaseError(`${label} must be normalized`);
  }
}

function validateSmokePath(value, label) {
  if (typeof value !== "string" || value.length === 0) {
    throw new HulebuReleaseError(`${label} must be a non-empty string`);
  }
  let decoded = value;
  while (true) {
    validateDecodedSmokePath(decoded, label);
    try {
      const next = decodeURIComponent(decoded);
      if (next === decoded) return;
      decoded = next;
    } catch {
      throw new HulebuReleaseError(`${label} must be normalized`);
    }
  }
}

function validateDecodedSmokePath(value, label) {
  if (!value.startsWith("/") || value.startsWith("//")) {
    throw new HulebuReleaseError(
      `${label} must be an origin-relative HTTP path`,
    );
  }
  if (value.includes("\\")) {
    throw new HulebuReleaseError(`${label} must not contain backslashes`);
  }
  if (value.includes("?") || value.includes("#")) {
    throw new HulebuReleaseError(`${label} must not contain query or hash`);
  }
  const segments = value.split("/");
  if (segments.includes(".") || segments.includes("..")) {
    throw new HulebuReleaseError(`${label} must not contain dot segments`);
  }
  if (path.posix.normalize(value) !== value) {
    throw new HulebuReleaseError(`${label} must be normalized`);
  }
}

function validateBuildArtifacts(buildRoot, config) {
  const errors = [];
  let realBuildRoot;
  try {
    realBuildRoot = fs.realpathSync(buildRoot);
    if (!fs.statSync(realBuildRoot).isDirectory()) {
      errors.push("build root is not a directory");
      return { ok: false, errors };
    }
  } catch {
    errors.push("unable to inspect build root");
    return { ok: false, errors };
  }

  const readableFiles = new Set();
  for (const relativePath of config.requiredFiles) {
    const filePath = path.join(buildRoot, relativePath);
    let linkStatus;
    try {
      linkStatus = fs.lstatSync(filePath);
    } catch (error) {
      if (error?.code === "ENOENT") {
        errors.push(`missing required file: ${relativePath}`);
      } else {
        errors.push(`unable to inspect required file: ${relativePath}`);
      }
      continue;
    }
    if (linkStatus.isSymbolicLink()) {
      errors.push(`required file must not be a symlink: ${relativePath}`);
      continue;
    }
    if (!linkStatus.isFile()) {
      errors.push(`required artifact is not a regular file: ${relativePath}`);
      continue;
    }

    let realFilePath;
    let fileStatus;
    try {
      realFilePath = fs.realpathSync(filePath);
      if (!isPathInside(realBuildRoot, realFilePath)) {
        errors.push(`required file escapes build root: ${relativePath}`);
        continue;
      }
      fileStatus = fs.statSync(filePath);
      fs.accessSync(filePath, fs.constants.R_OK);
    } catch {
      errors.push(`unable to inspect required file: ${relativePath}`);
      continue;
    }
    if (!fileStatus.isFile()) {
      errors.push(`required artifact is not a regular file: ${relativePath}`);
      continue;
    }
    if (fileStatus.size === 0) {
      errors.push(`empty required file: ${relativePath}`);
      continue;
    }
    readableFiles.add(relativePath);
  }
  for (const relativePath of config.requiredJsonFiles) {
    if (!readableFiles.has(relativePath)) continue;
    const filePath = path.join(buildRoot, relativePath);
    let jsonText;
    try {
      jsonText = fs.readFileSync(filePath, "utf8");
    } catch {
      errors.push(`unable to read required file: ${relativePath}`);
      continue;
    }
    try {
      JSON.parse(jsonText);
    } catch {
      errors.push(`invalid JSON: ${relativePath}`);
    }
  }
  const indexPath = path.join(buildRoot, "index.html");
  if (readableFiles.has("index.html")) {
    let indexHtml;
    try {
      indexHtml = fs.readFileSync(indexPath, "utf8");
    } catch {
      errors.push("unable to read required file: index.html");
      return { ok: false, errors };
    }
    if (!indexHtml.includes('id="GameCanvas"')) {
      errors.push("index.html missing GameCanvas");
    }
    if (!indexHtml.includes("System.import")) {
      errors.push("index.html missing System.import bootstrap");
    }
  }
  return { ok: errors.length === 0, errors };
}

function isPathInside(parentPath, candidatePath) {
  const relativePath = path.relative(parentPath, candidatePath);
  return (
    relativePath === "" ||
    (relativePath !== ".." &&
      !relativePath.startsWith(`..${path.sep}`) &&
      !path.isAbsolute(relativePath))
  );
}

function evaluateCreatorBuild({ exitCode, logText, artifactErrors, config }) {
  if (artifactErrors.length > 0) {
    throw new HulebuReleaseError(
      `Creator build artifacts are invalid: ${artifactErrors.join("; ")}`,
    );
  }
  if (!logText.includes(config.finishedMarker)) {
    throw new HulebuReleaseError(
      "Creator build log is missing the finished marker",
    );
  }
  if (exitCode === 0) {
    return { accepted: true, normalized: false, originalExitCode: 0 };
  }
  if (config.allowedNonZeroExitCodes.includes(exitCode)) {
    return { accepted: true, normalized: true, originalExitCode: exitCode };
  }
  throw new HulebuReleaseError(
    `Creator exited with unsupported code ${exitCode}`,
  );
}

function collectBuildStats(buildRoot) {
  const absoluteBuildRoot = resolveBuildDirectory(buildRoot);
  const excludedRootFiles = new Set([
    "hulebu-build.json",
    "hulebu-build.json.tmp",
  ]);
  let fileCount = 0;
  let totalBytes = 0;

  function visit(directoryPath, isRoot) {
    let entries;
    try {
      entries = fs.readdirSync(directoryPath, { withFileTypes: true });
    } catch (error) {
      throw new HulebuReleaseError(
        `Unable to inspect build directory: ${error.message}`,
      );
    }

    for (const entry of entries) {
      if (isRoot && excludedRootFiles.has(entry.name)) continue;

      const entryPath = path.join(directoryPath, entry.name);
      let status;
      try {
        status = fs.lstatSync(entryPath);
      } catch (error) {
        throw new HulebuReleaseError(
          `Unable to inspect build entry: ${error.message}`,
        );
      }
      if (status.isSymbolicLink()) {
        throw new HulebuReleaseError(
          `Build output must not contain symlinks: ${entryPath}`,
        );
      }
      if (status.isDirectory()) {
        visit(entryPath, false);
        continue;
      }
      if (!status.isFile()) {
        throw new HulebuReleaseError(
          `Build output contains an unsupported filesystem entry: ${entryPath}`,
        );
      }
      fileCount += 1;
      totalBytes += status.size;
    }
  }

  visit(absoluteBuildRoot, true);
  return { fileCount, totalBytes };
}

function resolveBuildDirectory(buildRoot) {
  if (typeof buildRoot !== "string" || buildRoot.length === 0) {
    throw new HulebuReleaseError("Build root must be a directory");
  }
  const absoluteBuildRoot = path.resolve(buildRoot);
  let status;
  try {
    status = fs.lstatSync(absoluteBuildRoot);
    fs.accessSync(absoluteBuildRoot, fs.constants.R_OK);
  } catch (error) {
    throw new HulebuReleaseError(
      `Unable to inspect build root: ${error.message}`,
    );
  }
  if (status.isSymbolicLink() || !status.isDirectory()) {
    throw new HulebuReleaseError("Build root must be a directory");
  }
  return absoluteBuildRoot;
}

function writeBuildManifest(
  buildRoot,
  { buildId, commit, config, creatorDecision, createdAt, smokeResults },
) {
  const absoluteBuildRoot = resolveBuildDirectory(buildRoot);
  const stats = collectBuildStats(absoluteBuildRoot);
  const data = {
    schemaVersion: 1,
    buildId,
    gameId: config.gameId,
    displayName: config.displayName,
    creatorVersion: config.creatorVersion,
    platform: config.platform,
    debug: config.debug,
    contentVersion: config.contentVersion,
    saveSchemaVersion: config.saveSchemaVersion,
    commit,
    createdAt,
    creatorExitCode: creatorDecision.originalExitCode,
    creatorExitNormalized: creatorDecision.normalized,
    smokeResults,
    ...stats,
  };
  const manifestPath = path.join(absoluteBuildRoot, "hulebu-build.json");
  const temporaryPath = path.join(absoluteBuildRoot, "hulebu-build.json.tmp");
  let temporaryFileDescriptor;

  try {
    fs.rmSync(temporaryPath, { force: true });
    const noFollowFlag = fs.constants.O_NOFOLLOW;
    if (typeof noFollowFlag !== "number") {
      throw new HulebuReleaseError(
        "Filesystem no-follow opens are unavailable",
      );
    }
    temporaryFileDescriptor = fs.openSync(
      temporaryPath,
      fs.constants.O_WRONLY |
        fs.constants.O_CREAT |
        fs.constants.O_EXCL |
        noFollowFlag,
      0o600,
    );
    fs.writeFileSync(
      temporaryFileDescriptor,
      `${JSON.stringify(data, null, 2)}\n`,
      "utf8",
    );
    fs.closeSync(temporaryFileDescriptor);
    temporaryFileDescriptor = undefined;
    fs.renameSync(temporaryPath, manifestPath);
  } finally {
    if (temporaryFileDescriptor !== undefined) {
      try {
        fs.closeSync(temporaryFileDescriptor);
      } catch {
        // Preserve the original write error when closing also fails.
      }
    }
    try {
      fs.rmSync(temporaryPath, { force: true });
    } catch {
      // Preserve the original write or rename error when cleanup also fails.
    }
  }

  return { path: manifestPath, data };
}

function resolveRequestPath(buildRoot, rawPathname) {
  if (
    typeof rawPathname !== "string" ||
    !rawPathname.startsWith("/") ||
    rawPathname.startsWith("//") ||
    rawPathname.includes("?") ||
    rawPathname.includes("#")
  ) {
    throw new HulebuReleaseError("request path is invalid");
  }

  let decodedPathname;
  try {
    decodedPathname = decodeURIComponent(rawPathname);
  } catch {
    throw new HulebuReleaseError("request path is invalid");
  }
  if (
    !decodedPathname.startsWith("/") ||
    decodedPathname.startsWith("//") ||
    decodedPathname.includes("\0") ||
    decodedPathname.includes("\\")
  ) {
    throw new HulebuReleaseError("request path is invalid");
  }
  if (decodedPathname.split("/").includes("..")) {
    throw new HulebuReleaseError("request path escapes the build root");
  }

  const absoluteBuildRoot = path.resolve(buildRoot);
  const requestPath = decodedPathname === "/" ? "/index.html" : decodedPathname;
  const candidatePath = path.resolve(absoluteBuildRoot, `.${requestPath}`);
  if (
    !isPathInside(absoluteBuildRoot, candidatePath) ||
    candidatePath === absoluteBuildRoot
  ) {
    throw new HulebuReleaseError("request path escapes the build root");
  }
  return candidatePath;
}

const CONTENT_TYPES = new Map([
  [".html", "text/html; charset=utf-8"],
  [".js", "application/javascript; charset=utf-8"],
  [".css", "text/css; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".wasm", "application/wasm"],
  [".bin", "application/octet-stream"],
  [".png", "image/png"],
]);

async function startStaticServer(buildRoot) {
  const absoluteBuildRoot = resolveBuildDirectory(buildRoot);
  const server = http.createServer((request, response) => {
    response.setHeader("Connection", "close");
    if (request.method !== "GET" && request.method !== "HEAD") {
      sendStatus(response, 405);
      return;
    }

    const rawPathname = (request.url || "/").split("?", 1)[0];
    let filePath;
    try {
      filePath = resolveRequestPath(absoluteBuildRoot, rawPathname);
    } catch (error) {
      if (error instanceof HulebuReleaseError) {
        sendStatus(response, 403);
        return;
      }
      sendStatus(response, 500);
      return;
    }

    const openedFile = openServedFile(absoluteBuildRoot, filePath);
    if (!openedFile) {
      sendStatus(response, 404);
      return;
    }

    response.writeHead(200, {
      "Content-Type":
        CONTENT_TYPES.get(path.extname(filePath).toLowerCase()) ||
        "application/octet-stream",
      "Content-Length": openedFile.size,
    });
    if (request.method === "HEAD") {
      fs.closeSync(openedFile.fileDescriptor);
      response.end();
      return;
    }

    let stream;
    try {
      stream = fs.createReadStream(filePath, {
        autoClose: true,
        fd: openedFile.fileDescriptor,
      });
    } catch {
      fs.closeSync(openedFile.fileDescriptor);
      response.destroy();
      return;
    }
    stream.on("error", () => response.destroy());
    stream.pipe(response);
  });

  await new Promise((resolveListening, rejectListening) => {
    const handleError = (error) => {
      server.off("listening", handleListening);
      rejectListening(
        new HulebuReleaseError(
          `Unable to start build server: ${error.message}`,
        ),
      );
    };
    const handleListening = () => {
      server.off("error", handleError);
      resolveListening();
    };
    server.once("error", handleError);
    server.once("listening", handleListening);
    server.listen(0, "127.0.0.1");
  });

  const address = server.address();
  if (!address || typeof address === "string") {
    await closeHttpServer(server);
    throw new HulebuReleaseError("Unable to determine build server address");
  }

  let closePromise;
  return {
    origin: `http://127.0.0.1:${address.port}`,
    close() {
      if (!closePromise) closePromise = closeHttpServer(server);
      return closePromise;
    },
  };
}

function openServedFile(buildRoot, filePath) {
  const relativePath = path.relative(buildRoot, filePath);
  let currentPath = buildRoot;
  let fileDescriptor;
  try {
    for (const segment of relativePath.split(path.sep)) {
      currentPath = path.join(currentPath, segment);
      const status = fs.lstatSync(currentPath);
      if (status.isSymbolicLink()) return null;
      if (currentPath !== filePath && !status.isDirectory()) return null;
      if (currentPath === filePath && !status.isFile()) return null;
    }
    const realFilePath = fs.realpathSync(filePath);
    if (!isPathInside(fs.realpathSync(buildRoot), realFilePath)) return null;
    const noFollowFlag = fs.constants.O_NOFOLLOW;
    if (typeof noFollowFlag !== "number") return null;
    fileDescriptor = fs.openSync(
      filePath,
      fs.constants.O_RDONLY | noFollowFlag,
    );
    const status = fs.fstatSync(fileDescriptor);
    if (!status.isFile()) {
      fs.closeSync(fileDescriptor);
      return null;
    }
    return { fileDescriptor, size: status.size };
  } catch {
    if (fileDescriptor !== undefined) {
      try {
        fs.closeSync(fileDescriptor);
      } catch {
        // The request already resolves to a not-found response.
      }
    }
    return null;
  }
}

function sendStatus(response, statusCode) {
  const body = Buffer.from(http.STATUS_CODES[statusCode] || "Error", "utf8");
  response.writeHead(statusCode, {
    "Content-Type": "text/plain; charset=utf-8",
    "Content-Length": body.byteLength,
  });
  response.end(body);
}

function closeHttpServer(server) {
  if (!server.listening) return Promise.resolve();
  return new Promise((resolveClose, rejectClose) => {
    server.close((error) => {
      if (error) {
        rejectClose(
          new HulebuReleaseError(
            `Unable to close build server: ${error.message}`,
          ),
        );
        return;
      }
      resolveClose();
    });
  });
}

async function smokeBuild(buildRoot, smokePaths) {
  for (const pathname of smokePaths) {
    try {
      resolveRequestPath(buildRoot, pathname);
    } catch (error) {
      throw new HulebuReleaseError(
        `Smoke check failed for ${String(pathname)}: ${error.message}`,
      );
    }
  }

  const server = await startStaticServer(buildRoot);
  const results = [];
  try {
    for (const pathname of smokePaths) {
      try {
        const response = await fetch(`${server.origin}${pathname}`);
        const body = Buffer.from(await response.arrayBuffer());
        if (response.status !== 200) {
          throw new HulebuReleaseError(
            `Smoke check failed for ${pathname}: HTTP ${response.status}`,
          );
        }
        if (body.byteLength === 0) {
          throw new HulebuReleaseError(
            `Smoke check failed for ${pathname}: empty response body`,
          );
        }
        if (pathname.endsWith(".json")) {
          try {
            JSON.parse(body.toString("utf8"));
          } catch {
            throw new HulebuReleaseError(
              `Smoke check failed for ${pathname}: invalid JSON`,
            );
          }
        }
        results.push({
          pathname,
          status: response.status,
          bytes: body.byteLength,
        });
      } catch (error) {
        if (error instanceof HulebuReleaseError) throw error;
        throw new HulebuReleaseError(
          `Smoke check failed for ${pathname}: ${
            error instanceof Error ? error.message : String(error)
          }`,
        );
      }
    }
    return results;
  } finally {
    await server.close();
  }
}

module.exports = {
  HulebuReleaseError,
  collectBuildStats,
  evaluateCreatorBuild,
  loadReleaseConfig,
  resolveRequestPath,
  smokeBuild,
  startStaticServer,
  validateBuildArtifacts,
  validateReleaseConfig,
  writeBuildManifest,
};
