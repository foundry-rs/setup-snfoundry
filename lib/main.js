import { getFullVersionFromSnForge, versionWithPrefix } from "./versions";
import { downloadSnForge } from "./download";
import { getOsTriplet } from "./platform";
import path from "path";
import * as core from "@actions/core";
import * as tc from "@actions/tool-cache";

export default async function main() {
  try {
    const snforgeVersionInput = core.getInput("version");

    const { repo: SnForgeRepo, version: SnForgeVersion } = {
      rep: "foundry-rs/starknet-foundry",
      version: snforgeVersionInput,
    };

    const triplet = getOsTriplet();
    await core.group(
      `Setting up SnForge ${versionWithPrefix(SnForgeVersion)}`,
      async () => {
        let snforgePrefix = tc.find("snforge", SnForgeVersion, triplet);
        if (!snforgePrefix) {
          const download = await downloadSnForge(SnForgeRepo, SnForgeVersion);
          snforgePrefix = await tc.cacheDir(
            download,
            "snforge",
            SnForgeVersion,
            triplet,
          );
        }

        core.setOutput("snforge-prefix", snforgePrefix);
        core.addPath(path.join(snforgePrefix, "bin"));
      },
    );

    core.setOutput("snforge-version", await getFullVersionFromSnForge());
  } catch (err) {
    core.setFailed(err);
  }
}
