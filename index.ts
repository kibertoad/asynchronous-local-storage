import type { AsynchronousLocalStorage } from './lib/als-types'
export type { AsynchronousLocalStorage } from './lib/als-types'

const { isAlsSupported: isAlsSupportedFn } = require('./lib/nodeVersionUtils')
const isAlsSupported = isAlsSupportedFn()

export const als: AsynchronousLocalStorage = isAlsSupported
  ? require('./lib/als').default
  : require('./lib/cls-fallback').default

export const getAlsInstance: (namespaceId?: string) => AsynchronousLocalStorage = isAlsSupported
  ? require('./lib/als').getAlsInstance
  : require('./lib/cls-fallback').getClsInstance

export default als
