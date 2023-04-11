import { isAlsSupported, getNodeVersion, nodeVersionString } from '../lib/nodeVersionUtils'

describe('AsyncLocalStorage tests', () => {
  if (isAlsSupported(getNodeVersion(nodeVersionString))) {
    const { als } = require('../lib/als')

    describe('if set is called without running in context', () => {
      it('then get returns undefined', () => {
        als.set('key', 'value')
        expect(als.get('key')).toBeUndefined()
      })
    })

    describe('if defaults are used when running a context', () => {
      it('then the get returns the correct information', (done) => {
        als.runWith(
          () => {
            expect(als.get('key')).toBe('value')
            done()
          },
          { key: 'value' }
        )
      })

      it('runWith with synchronous callback', () => {
        const result = als.runWith(() => {
          als.set('key', 'value')
          return als.get('key')
        })

        expect(result).toBe('value')
      })
    })

    describe('if set is called within context', () => {
      it('then the get returns the correct information', (done) => {
        als.runWith(() => {
          als.set('key', 'value')
          expect(als.get('key')).toBe('value')
          done()
        })
      })
    })

    describe('test runWith', () => {
      it('runWith with synchronous callback', () => {
        const result = als.runWith(() => {
          als.set('key', 'value')
          return als.get('key')
        })

        expect(result).toBe('value')
      })

      it('runWith with asynchronous callback', async () => {
        const result = await als.runWith(async () => {
          als.set('key', 'value')
          return Promise.resolve(als.get('key'))
        })

        expect(result).toBe('value')
      })
    })
  } else {
    it('dummy test', () => {
      // Keeps jest happy
    })
  }
})
