import type { AsynchronousLocalStorage } from './lib/als-types'
export type { AsynchronousLocalStorage } from './lib/als-types'

const { isAlsSupported } = require('./lib/nodeVersionUtils')
export const als: AsynchronousLocalStorage = isAlsSupported()
  ? require('./lib/als').als
  : require('./lib/cls-fallback').cls

export default als
