export async function getFullVersionFromSnForge() {
  const { stdout } = await exec.getExecOutput(`snforge -V`);
  const match = stdout.match(/^snforge ([^ ]+)/);
  if (!match) {
    throw new Error(
      `unable to determine SnForge version from 'snforge -V' output: ${stdout}`,
    );
  }
  return match[1];
}

export function versionWithPrefix(version) {
  return /^\d/.test(version) ? `v${version}` : version;
}
