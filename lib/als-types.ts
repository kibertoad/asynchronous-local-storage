export type StorageType = Map<string, any>

export type AsynchronousLocalStorage = {
  get: <T>(key: string) => T | undefined
  set: <T>(key: string, value: T) => void
  runWith: (callback: () => void, defaults?: Record<string, any>) => void
  storageImplementation: string
}
