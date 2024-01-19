import {
  determineVersion,
  getFullVersionFromStarknetFoundry,
  versionWithPrefix,
} from "./versions";
import {
  downloadStarknetFoundry,
  downloadUniversalSierraCompiler,
} from "./download";
import { getOsTriplet } from "./platform";
import path from "path";
import * as core from "@actions/core";
import * as tc from "@actions/tool-cache";

export default async function main() {
  try {
    const StarknetFoundryVersionInput = core.getInput(
      "starknet-foundry-version",
    );

    const StarknetFoundryRepo = "foundry-rs/starknet-foundry";
    const StarknetFoundryVersion = await determineVersion(
      StarknetFoundryVersionInput,
      StarknetFoundryRepo,
    );

    const triplet = getOsTriplet();
    await core.group(
      `Setting up Starknet Foundry ${versionWithPrefix(
        StarknetFoundryVersion,
      )}`,
      async () => {
        let StarknetFoundryPrefix = tc.find(
          "starknet-foundry",
          StarknetFoundryVersion,
          triplet,
        );
        if (!StarknetFoundryPrefix) {
          await downloadUniversalSierraCompiler();
          const download = await downloadStarknetFoundry(
            StarknetFoundryRepo,
            StarknetFoundryVersion,
          );
          StarknetFoundryPrefix = await tc.cacheDir(
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
      "starknet-foundry-version",
      await getFullVersionFromStarknetFoundry(),
    );
  } catch (err) {
    core.setFailed(err);
  }
}
