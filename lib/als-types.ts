export type StorageType = Map<string, any>

export type UnwrapPromise<T> = T extends Promise<infer U> ? U : T

export type AsynchronousLocalStorage = {
  get: <T>(key: string) => T | undefined
  set: <T>(key: string, value: T) => void
  runWith: <T extends (...args: any[]) => any, R extends ReturnType<T>>(
    callback: T,
    defaults?: Record<string, any>
  ) => UnwrapPromise<R>
  storageImplementation: string
}
