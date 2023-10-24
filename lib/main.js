import { getFullVersionFromStarknetFoundry, versionWithPrefix } from "./versions";
import { downloadStarknetFoundry } from "./download";
import { getOsTriplet } from "./platform";
import path from "path";
import * as core from "@actions/core";
import * as tc from "@actions/tool-cache";

export default async function main() {
  try {
    const StarknetFoundryVersionInput = core.getInput("version");

    const { repo: StarknetFoundryRepo, version: StarknetFoundryVersion } = {
      rep: "foundry-rs/starknet-foundry",
      version: StarknetFoundryVersionInput,
    };

    const triplet = getOsTriplet();
    await core.group(
      `Setting up Starknet Foundry ${versionWithPrefix(StarknetFoundryVersion)}`,
      async () => {
        let StarknetFoundryPrefix = tc.find(
          "starknet-foundry",
          StarknetFoundryVersion,
          triplet,
        );
        if (!StarknetFoundryPrefix) {
          const download = await downloadStarknetFoundry(
            StarknetFoundryRepo,
            StarknetFoundryVersion,
          );
          snforgePrefix = await tc.cacheDir(
            download,
            "starknet-foundry",
            StarknetFoundryVersion,
            triplet,
          );
        }

        core.setOutput("starknet-foundry-prefix", StarknetFoundryPrefix);
        core.addPath(path.join(StarknetFoundryPrefix, "bin"));
      },
    );

    core.setOutput(
      "starknet-fundry-version",
      await getFullVersionFromStarknetFoundry(),
    );
  } catch (err) {
    core.setFailed(err);
  }
}
