import { AsyncLocalStorage } from 'async_hooks'
import { AsynchronousLocalStorage, StorageType, UnwrapPromise } from './als-types'
const asyncLocalStorage = new AsyncLocalStorage<StorageType>()

export const als: AsynchronousLocalStorage = {
  storageImplementation: 'AsyncLocalStorage',
  get: <T>(key: string): T | undefined => {
    const store = asyncLocalStorage.getStore()
    return store?.get(key)
  },

  set: <T>(key: string, value: T): void => {
    const store = asyncLocalStorage.getStore()
    store?.set(key, value)
  },

  runWith: <T extends (...args: any[]) => any, R extends ReturnType<T>>(
    callback: T,
    defaults?: Record<string, any>
  ): UnwrapPromise<R> => {
    const store: StorageType = defaults ? new Map(Object.entries(defaults)) : new Map()

    return asyncLocalStorage.run(store, () => {
      let result = callback()

      if (result instanceof Promise) {
        result.then((resolve) => {
          result = resolve
        })
      }

      return result
    })
  },
}

export default als
