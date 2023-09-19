import path from "path";
import fs from "fs/promises";
import * as core from "@actions/core";
import * as tc from "@actions/tool-cache";
import { getOsTriplet } from "./platform";
import { versionWithPrefix } from "./versions";

export async function downloadSnForge(repo, version) {
  const triplet = getOsTriplet();
  const tag = versionWithPrefix(version);
  const basename = `starknet-foundry-${tag}-${triplet}`;
  const extension = triplet.includes("-windows-") ? "zip" : "tar.gz";
  const url = `https://github.com/${repo}/releases/download/${tag}/${basename}.${extension}`;

  core.info(`Downloading SnForge from ${url}`);
  const pathToTarball = await tc.downloadTool(url);

  const extract = url.endsWith(".zip") ? tc.extractZip : tc.extractTar;
  const extractedPath = await extract(pathToTarball);

  const pathToCli = await findSnForgeDir(extractedPath);

  core.debug(`Extracted to ${pathToCli}`);
  return pathToCli;
}

async function findSnForgeDir(extractedPath) {
  for (const dirent of await fs.readdir(extractedPath, {
    withFileTypes: true,
  })) {
    if (dirent.isDirectory() && dirent.name.startsWith("snforge")) {
      return path.join(extractedPath, dirent.name);
    }
  }

  throw new Error(`could not find SnForge directory in ${extractedPath}`);
}
