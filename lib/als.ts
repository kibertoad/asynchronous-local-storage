import { AsyncLocalStorage } from 'async_hooks'
import { AsynchronousLocalStorage, StorageType } from './als-types'
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

  runWith: (callback: () => void, defaults?: Record<string, any>): void => {
    const store: StorageType = defaults ? new Map(Object.entries(defaults)) : new Map()

    asyncLocalStorage.run(store, () => {
      callback()
    })
  },
}

export default als
