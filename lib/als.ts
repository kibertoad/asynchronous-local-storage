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

export class Als implements AsynchronousLocalStorage {
  private _storageInstance: AsyncLocalStorage<StorageType>
  public storageImplementation: string
  constructor() {
    this.storageImplementation = 'AsyncLocalStorage'
    this._storageInstance = new AsyncLocalStorage<StorageType>()
  }

  get<T>(key: string): T | undefined {
    const store = this._storageInstance.getStore()
    return store?.get(key)
  }

  set<T>(key: string, value: T): void {
    const store = this._storageInstance.getStore()
    store?.set(key, value)
  }

  runWith(callback: () => void, defaults?: Record<string, any>): void {
    const store: StorageType = defaults ? new Map(Object.entries(defaults)) : new Map()

    this._storageInstance.run(store, () => {
      callback()
    })
  }
}

export function getAlsInstance(): AsynchronousLocalStorage {
  return new Als()
}

export default als
