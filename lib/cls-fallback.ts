import { createNamespace } from 'cls-hooked'
import { AsynchronousLocalStorage } from './als-types'
const _namespace = createNamespace('@kibertoad/als')

export const cls: AsynchronousLocalStorage = {
  storageImplementation: 'cls-hooked',
  get: <T>(key: string): T | undefined => {
    if (_namespace.active) {
      return _namespace.get(key)
    }
    return undefined
  },

  set: <T>(key: string, value: T) => {
    if (_namespace.active) {
      _namespace.set(key, value)
    }
  },

  runWith: (callback: () => void, defaults?: Record<string, any>) => {
    _namespace.run(() => {
      if (defaults) {
        const objectKeys = Object.keys(defaults)
        for (let i = 0; i < objectKeys.length; i++) {
          _namespace.set(objectKeys[i], defaults[objectKeys[i]])
        }
      }
      callback()
    })
  },
}

export default cls
