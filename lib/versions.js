import * as core from "@actions/core";
import * as exec from "@actions/exec";
import { HttpClient } from "@actions/http-client";
import fs from "fs/promises";

export async function getFullVersionFromStarknetFoundry() {
  const { stdout } = await exec.getExecOutput(`snforge -V`);
  const match = stdout.match(/^snforge ([^ ]+)/);
  if (!match) {
    throw new Error(
      `unable to determine Starknet Foundry version from 'snforge -V' output: ${stdout}`,
    );
  }
  return match[1];
}

export async function determineVersion(version, toolVersionsPath, repo) {
  version = version?.trim();
  version = version ?? "latest";

  if (version && toolVersionsPath) {
    throw new Error(
      "the `starknet-foundry-version` and `tool-versions` inputs cannot be used simultaneously",
    );
  }

  if (toolVersionsPath) {
    let toolVersion = await getVersionFromToolVersionsFile(toolVersionsPath);

    if (!toolVersion) {
      throw new Error(
        `failed to read Starknet Foundry version from: ${toolVersionsPath}`,
      );
    }
    version = toolVersion;
  }

  if (version === "latest") {
    version = await fetchLatestTag(repo);
  }

  if (version.startsWith("v")) {
    version = version.substring(1);
  }

  return version;
}

function fetchLatestTag(repo) {
  // Note: Asking GitHub API for latest release information is the simplest solution here, but has one major drawback:
  // it tends to trigger rate limit errors when run on GitHub actions hosted runners. This method performs requests
  // against GitHub website, which does not rate limit so aggressively. We also never ask for nor download response
  // body, which means that this technique should be theoretically much faster.
  return core.group(
    "Getting information about latest Scarb release from GitHub",
    async () => {
      const http = new HttpClient("software-mansion/setup-scarb", undefined, {
        allowRedirects: false,
      });

      const requestUrl = `https://github.com/${repo}/releases/latest`;
      core.debug(`HEAD ${requestUrl}`);
      const res = await http.head(requestUrl);

      if (res.message.statusCode < 300 || res.message.statusCode >= 400) {
        throw new Error(
          `failed to determine latest version: expected releases request to redirect, instead got http status: ${res.message.statusCode}`,
        );
      }

      const location = res.message.headers.location;
      core.debug(`Location: ${location}`);
      if (!location) {
        throw new Error(
          `failed to determine latest version: releases request response misses 'location' header`,
        );
      }

      const tag = location.replace(/.*\/tag\/(.*)(?:\/.*)?/, "$1");
      if (!tag) {
        throw new Error(
          `failed to determine latest version: could not extract tag from release url`,
        );
      }

      return tag;
    },
  );
}

export function versionWithPrefix(version) {
  return /^\d/.test(version) ? `v${version}` : version;
}

async function getVersionFromToolVersionsFile(toolVersionsPath) {
  try {
    toolVersionsPath = toolVersionsPath || ".tool-versions";
    const toolVersions = await fs.readFile(toolVersionsPath, {
      encoding: "utf-8",
    });
    return toolVersions.match(/^starknet-foundry ([\w.-]+)/m)?.[1];
  } catch (e) {
    return undefined;
  }
}
