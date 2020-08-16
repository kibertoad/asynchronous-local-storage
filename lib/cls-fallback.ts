import { createNamespace, Namespace } from 'cls-hooked'
import { AsynchronousLocalStorage } from './als-types'

const usedNamespaceIds = new Set()

export class Cls implements AsynchronousLocalStorage {
  private _storageInstance: Namespace
  public storageImplementation: string

  constructor(namespaceId = '@kibertoad/als') {
    if (usedNamespaceIds.has(namespaceId)) {
      throw new Error(
        `Namespace id ${namespaceId} was already used. Please specify a different one.`
      )
    }
    this.storageImplementation = 'cls-hooked'
    this._storageInstance = createNamespace(namespaceId)
  }

  get<T>(key: string): T | undefined {
    if (this._storageInstance.active) {
      return this._storageInstance.get(key)
    }
    return undefined
  }

  set<T>(key: string, value: T): void {
    if (this._storageInstance.active) {
      this._storageInstance.set(key, value)
    }
  }

  runWith(callback: () => void, defaults?: Record<string, any>): void {
    this._storageInstance.run(() => {
      if (defaults) {
        const objectKeys = Object.keys(defaults)
        for (let i = 0; i < objectKeys.length; i++) {
          this._storageInstance.set(objectKeys[i], defaults[objectKeys[i]])
        }
      }
      callback()
    })
  }
}

export function getClsInstance(namespaceId: string): AsynchronousLocalStorage {
  return new Cls(namespaceId)
}

export default new Cls()
