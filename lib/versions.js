export async function getFullVersionFromsnfoundry() {
  const { stdout } = await exec.getExecOutput(`snforge -V`);
  const match = stdout.match(/^snforge ([^ ]+)/);
  if (!match) {
    throw new Error(
      `unable to determine snfoundry version from 'snforge -V' output: ${stdout}`,
    );
  }
  return match[1];
}

export function versionWithPrefix(version) {
  return /^\d/.test(version) ? `v${version}` : version;
}
