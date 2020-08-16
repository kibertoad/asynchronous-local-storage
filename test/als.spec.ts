const { isAlsSupported } = require('../lib/nodeVersionUtils')

describe('AsyncLocalStorage tests', () => {
  if (isAlsSupported()) {
    const als = require('../lib/als').default

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
  } else {
    it('dummy test', () => {
      // Keeps jest happy
    })
  }
})
