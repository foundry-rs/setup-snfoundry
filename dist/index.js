/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 805:
/***/ ((module) => {

module.exports = eval("require")("@actions/core");


/***/ }),

/***/ 868:
/***/ ((module) => {

module.exports = eval("require")("@actions/exec");


/***/ }),

/***/ 423:
/***/ ((module) => {

module.exports = eval("require")("@actions/http-client");


/***/ }),

/***/ 473:
/***/ ((module) => {

module.exports = eval("require")("@actions/tool-cache");


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId](module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__nccwpck_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__nccwpck_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__nccwpck_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__nccwpck_require__.o(definition, key) && !__nccwpck_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__nccwpck_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__nccwpck_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
// ESM COMPAT FLAG
__nccwpck_require__.r(__webpack_exports__);

// EXTERNAL MODULE: ../../.asdf/installs/nodejs/21.2.0/lib/node_modules/@vercel/ncc/dist/ncc/@@notfound.js?@actions/core
var core = __nccwpck_require__(805);
// EXTERNAL MODULE: ../../.asdf/installs/nodejs/21.2.0/lib/node_modules/@vercel/ncc/dist/ncc/@@notfound.js?@actions/exec
var exec = __nccwpck_require__(868);
// EXTERNAL MODULE: ../../.asdf/installs/nodejs/21.2.0/lib/node_modules/@vercel/ncc/dist/ncc/@@notfound.js?@actions/http-client
var http_client = __nccwpck_require__(423);
;// CONCATENATED MODULE: external "fs/promises"
const promises_namespaceObject = require("fs/promises");
var promises_default = /*#__PURE__*/__nccwpck_require__.n(promises_namespaceObject);
;// CONCATENATED MODULE: ./lib/versions.js





async function getFullVersionFromStarknetFoundry() {
  const { stdout } = await exec.getExecOutput(`snforge -V`);
  const match = stdout.match(/^snforge ([^ ]+)/);
  if (!match) {
    throw new Error(
      `unable to determine Starknet Foundry version from 'snforge -V' output: ${stdout}`,
    );
  }
  return match[1];
}

async function determineVersion(version, toolVersionsPath, repo) {
  version = version?.trim();

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

  if (!version) {
    let toolVersion = await getVersionFromToolVersionsFile();
    version = toolVersion ?? "latest";
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
      const http = new http_client.HttpClient("software-mansion/setup-scarb", undefined, {
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

function versionWithPrefix(version) {
  return /^\d/.test(version) ? `v${version}` : version;
}

async function getVersionFromToolVersionsFile(toolVersionsPath) {
  try {
    toolVersionsPath = toolVersionsPath || ".tool-versions";
    const toolVersions = await promises_default().readFile(toolVersionsPath, {
      encoding: "utf-8",
    });
    return toolVersions.match(/^starknet-foundry ([\w.-]+)/m)?.[1];
  } catch (e) {
    return undefined;
  }
}

;// CONCATENATED MODULE: external "path"
const external_path_namespaceObject = require("path");
var external_path_default = /*#__PURE__*/__nccwpck_require__.n(external_path_namespaceObject);
// EXTERNAL MODULE: ../../.asdf/installs/nodejs/21.2.0/lib/node_modules/@vercel/ncc/dist/ncc/@@notfound.js?@actions/tool-cache
var tool_cache = __nccwpck_require__(473);
;// CONCATENATED MODULE: external "os"
const external_os_namespaceObject = require("os");
var external_os_default = /*#__PURE__*/__nccwpck_require__.n(external_os_namespaceObject);
;// CONCATENATED MODULE: ./lib/platform.js


function getOsTriplet() {
  const arch = getOsArch();
  const platform = getOsPlatform();
  return `${arch}-${platform}`;
}

function getOsArch() {
  const arch = external_os_default().arch();
  switch (arch) {
    case "arm64":
      return "aarch64";
    case "x64":
      return "x86_64";
    default:
      throw new Error(`unsupported host architecture: ${arch}`);
  }
}

function getOsPlatform() {
  const platform = external_os_default().platform();
  switch (platform) {
    case "linux":
      return "unknown-linux-gnu";
    case "darwin":
      return "apple-darwin";
    case "win32":
      return "pc-windows-msvc";
    default:
      throw new Error(`unsupported host platform: ${platform}`);
  }
}

;// CONCATENATED MODULE: ./lib/download.js








async function downloadStarknetFoundry(repo, version) {
  const triplet = getOsTriplet();
  const tag = versionWithPrefix(version);
  const basename = `starknet-foundry-${tag}-${triplet}`;
  const extension = triplet.includes("-windows-") ? "zip" : "tar.gz";
  const url = `https://github.com/${repo}/releases/download/${tag}/${basename}.${extension}`;

  core.info(`Downloading Starknet Foundry from ${url}`);
  const pathToTarball = await tool_cache.downloadTool(url);

  const extract = url.endsWith(".zip") ? tool_cache.extractZip : tool_cache.extractTar;
  const extractedPath = await extract(pathToTarball);

  const pathToCli = await findStarknetFoundryDir(extractedPath);

  core.debug(`Extracted to ${pathToCli}`);
  return pathToCli;
}

async function findStarknetFoundryDir(extractedPath) {
  for (const dirent of await promises_default().readdir(extractedPath, {
    withFileTypes: true,
  })) {
    if (dirent.isDirectory() && dirent.name.startsWith("starknet-foundry-")) {
      return external_path_default().join(extractedPath, dirent.name);
    }
  }

  throw new Error(
    `could not find Starknet Foundry directory in ${extractedPath}`,
  );
}

;// CONCATENATED MODULE: ./lib/main.js







async function main() {
  try {
    const StarknetFoundryVersionInput = core.getInput(
      "starknet-foundry-version",
    );

    const toolVersionsPathInput = core.getInput("tool-versions");

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
        let StarknetFoundryPrefix = tool_cache.find(
          "starknet-foundry",
          StarknetFoundryVersion,
          triplet,
        );
        if (!StarknetFoundryPrefix) {
          const download = await downloadStarknetFoundry(
            StarknetFoundryRepo,
            StarknetFoundryVersion,
          );
          StarknetFoundryPrefix = await tool_cache.cacheDir(
            download,
            "starknet-foundry",
            StarknetFoundryVersion,
            triplet,
          );
        }

        core.setOutput("starknet-foundry-prefix", StarknetFoundryPrefix);
        core.addPath(external_path_default().join(StarknetFoundryPrefix, "bin"));
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

;// CONCATENATED MODULE: ./index.js


void main();

})();

module.exports = __webpack_exports__;
/******/ })()
;