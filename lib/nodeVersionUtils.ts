export const nodeVersionString = process.versions.node

type NodeVersion = {
  majorVersion: number
  minorVersion: number
  patchVersion: number
}

export function getNodeVersion(nodeVersionString: string): NodeVersion {
  const [nodeMajor, nodeMinor, nodePatch] = nodeVersionString.split('.')
  return {
    majorVersion: Number.parseInt(nodeMajor),
    minorVersion: Number.parseInt(nodeMinor),
    patchVersion: Number.parseInt(nodePatch),
  }
}

export function isAlsSupported(nodeVersion: NodeVersion): boolean {
  const { majorVersion, minorVersion } = nodeVersion

  if (majorVersion > 13) {
    return true
  }

  if (majorVersion < 12) {
    return false
  }

  // https://nodejs.org/en/blog/release/v12.17.0/
  if (majorVersion === 12) {
    return minorVersion >= 17
  }

  // https://nodejs.org/en/blog/release/v13.10.0/
  if (majorVersion === 13) {
    return minorVersion >= 10
  }

  return false
}
