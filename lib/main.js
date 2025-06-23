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
import * as exec from "@actions/exec";

export default async function main() {
  try {
    // await exec.exec("gh", ["run", "software-mansion/setup-universal-sierra-compiler@v1"]);

    const StarknetFoundryVersionInput = core.getInput(
      "starknet-foundry-version",
    );
    console.log(StarknetFoundryVersionInput);
    const toolVersionsPathInput = core.getInput("tool-versions");
    console.log(toolVersionsPathInput);

    const StarknetFoundryRepo = "foundry-rs/starknet-foundry";
    const StarknetFoundryVersion = await determineVersion(
      StarknetFoundryVersionInput,
      toolVersionsPathInput,
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
