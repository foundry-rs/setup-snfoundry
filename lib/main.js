import { getFullVersionFromSnFoundry, versionWithPrefix } from "./versions";
import { downloadSnFoundry } from "./download";
import { getOsTriplet } from "./platform";
import path from "path";
import * as core from "@actions/core";
import * as tc from "@actions/tool-cache";

export default async function main() {
  try {
    const SnFoundryVersionInput = core.getInput("version");

    const { repo: SnFoundryRepo, version: SnFoundryVersion } = {
      rep: "foundry-rs/starknet-foundry",
      version: SnFoundryVersionInput,
    };

    const triplet = getOsTriplet();
    await core.group(
      `Setting up SnFoundry ${versionWithPrefix(SnFoundryVersion)}`,
      async () => {
        let SnFoundryPrefix = tc.find(
          "starknet-foundry",
          SnFoundryVersion,
          triplet,
        );
        if (!SnFoundryPrefix) {
          const download = await downloadSnFoundry(
            SnFoundryRepo,
            SnFoundryVersion,
          );
          snforgePrefix = await tc.cacheDir(
            download,
            "starknet-foundry",
            SnFoundryVersion,
            triplet,
          );
        }

        core.setOutput("starknet-foundry-prefix", SnFoundryPrefix);
        core.addPath(path.join(SnFoundryPrefix, "bin"));
      },
    );

    core.setOutput(
      "starknet-fundry-version",
      await getFullVersionFromSnFoundry(),
    );
  } catch (err) {
    core.setFailed(err);
  }
}
