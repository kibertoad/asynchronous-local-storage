import type { AsynchronousLocalStorage } from '../lib/als-types'
import { isAlsSupported, getNodeVersion, nodeVersionString } from '../lib/nodeVersionUtils'

describe('Dynamic export resolution tests', () => {
  beforeEach(() => {
    jest.resetModules()
    jest.resetAllMocks()
    jest.restoreAllMocks()
    jest.clearAllMocks()

    jest.mock('../lib/nodeVersionUtils')
  })

  describe('Sanity check for version resolution', () => {
    const nodeVersion = getNodeVersion(nodeVersionString)
    const isAlsSupportedValue = isAlsSupported(getNodeVersion(nodeVersionString));

    expect(nodeVersionString).toEqual(expect.any(String));
    expect(nodeVersion.majorVersion).toEqual(expect.any(Number));

    if (nodeVersion.majorVersion >= 12) {
      expect(isAlsSupportedValue).toBe(true)
    } else {
      expect(isAlsSupportedValue).toBe(false)
    }
  })

  describe('when AsyncLocalStorage is not available', () => {
    it('then clsHooked fallback is used', async () => {
      const mockNodeUtils: any = await import('../lib/nodeVersionUtils')
      mockNodeUtils.isAlsSupported.mockReturnValue(false)
      const als: AsynchronousLocalStorage = (await import('../index')).als
      expect(als.storageImplementation).toBe('cls-hooked')
    })
  })

  // Do not run this on older Nodes to avoid als.ts exploding on import
  if (isAlsSupported(getNodeVersion(nodeVersionString))) {
    describe('when AsyncLocalStorage is available', () => {
      it('then it is used', async () => {
        const mockNodeUtils: any = await import('../lib/nodeVersionUtils')
        mockNodeUtils.isAlsSupported.mockReturnValue(true)
        const als: AsynchronousLocalStorage = (await import('../index')).als
        expect(als.storageImplementation).toBe('AsyncLocalStorage')
      })
    })
  }
})
