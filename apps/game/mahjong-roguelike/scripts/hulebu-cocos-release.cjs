"use strict";

const fs = require("node:fs");
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
    throw new HulebuReleaseError(`Unable to read release config: ${error.message}`);
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
    throw new HulebuReleaseError(`${label} must be an origin-relative HTTP path`);
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
    throw new HulebuReleaseError("Creator build log is missing the finished marker");
  }
  if (exitCode === 0) {
    return { accepted: true, normalized: false, originalExitCode: 0 };
  }
  if (config.allowedNonZeroExitCodes.includes(exitCode)) {
    return { accepted: true, normalized: true, originalExitCode: exitCode };
  }
  throw new HulebuReleaseError(`Creator exited with unsupported code ${exitCode}`);
}

module.exports = {
  HulebuReleaseError,
  evaluateCreatorBuild,
  loadReleaseConfig,
  validateBuildArtifacts,
  validateReleaseConfig,
};
