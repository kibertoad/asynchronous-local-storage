import type { AsynchronousLocalStorage } from './lib/als-types'
export type { AsynchronousLocalStorage } from './lib/als-types'

const { getNodeVersion, isAlsSupported, nodeVersionString } = require('./lib/nodeVersionUtils')
export const als: AsynchronousLocalStorage = isAlsSupported(getNodeVersion(nodeVersionString))
  ? require('./lib/als').als
  : require('./lib/cls-fallback').cls

export default als
