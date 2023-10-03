import { getFullVersionFromsnfoundry, versionWithPrefix } from "./versions";
import { downloadsnfoundry } from "./download";
import { getOsTriplet } from "./platform";
import path from "path";
import * as core from "@actions/core";
import * as tc from "@actions/tool-cache";

export default async function main() {
  try {
    const snfoundryVersionInput = core.getInput("version");

    const { repo: snfoundryRepo, version: snfoundryVersion } = {
      rep: "foundry-rs/starknet-foundry",
      version: snfoundryVersionInput,
    };

    const triplet = getOsTriplet();
    await core.group(
      `Setting up snfoundry ${versionWithPrefix(snfoundryVersion)}`,
      async () => {
        let snfoundryPrefix = tc.find(
          "starknet-foundry",
          snfoundryVersion,
          triplet,
        );
        if (!snfoundryPrefix) {
          const download = await downloadsnfoundry(
            snfoundryRepo,
            snfoundryVersion,
          );
          snforgePrefix = await tc.cacheDir(
            download,
            "starknet-foundry",
            snfoundryVersion,
            triplet,
          );
        }

        core.setOutput("starknet-foundry-prefix", snfoundryPrefix);
        core.addPath(path.join(snfoundryPrefix, "bin"));
      },
    );

    core.setOutput(
      "starknet-fundry-version",
      await getFullVersionFromsnfoundry(),
    );
  } catch (err) {
    core.setFailed(err);
  }
}
