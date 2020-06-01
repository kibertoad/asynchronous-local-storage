import cls from '../lib/cls-fallback'

describe('cls-facade tests', () => {
  describe('if set is called without running in context', () => {
    it('then get returns undefined', () => {
      cls.set('key', 'value')
      expect(cls.get('key')).toBeUndefined()
    })
  })

  describe('if defaults are used when running a context', () => {
    it('then the get returns the correct information', (done) => {
      cls.runWith(
        () => {
          expect(cls.get('key')).toBe('value')
          done()
        },
        { key: 'value' }
      )
    })
  })
  describe('if set is called within context', () => {
    it('then the get returns the correct information', (done) => {
      cls.runWith(() => {
        cls.set('key', 'value')
        expect(cls.get('key')).toBe('value')
        done()
      })
    })
  })
})
