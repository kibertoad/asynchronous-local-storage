import { getNodeVersion, isAlsSupported } from '../lib/nodeVersionUtils'

describe('nodeVersionUtils', () => {
  it('Versions below 12 do not support ALS', () => {
    const nodeVersion = getNodeVersion('11.5.1')
    expect(isAlsSupported(nodeVersion)).toBe(false)
  })

  it('Versions below 12.17 do not support ALS', () => {
    const nodeVersion = getNodeVersion('12.16.3')
    expect(isAlsSupported(nodeVersion)).toBe(false)
  })

  it('Versions 12.17+ not support ALS', () => {
    const nodeVersion = getNodeVersion('12.17.0')
    expect(isAlsSupported(nodeVersion)).toBe(true)
  })

  it('Versions below 13.10 do not support ALS', () => {
    const nodeVersion = getNodeVersion('13.9.3')
    expect(isAlsSupported(nodeVersion)).toBe(false)
  })

  it('Versions 13.10+ support ALS', () => {
    const nodeVersion = getNodeVersion('13.10.1')
    expect(isAlsSupported(nodeVersion)).toBe(true)
  })

  it('Versions 14 support ALS', () => {
    const nodeVersion = getNodeVersion('14.0.0')
    expect(isAlsSupported(nodeVersion)).toBe(true)
  })

  it('Versions > 14 support ALS', () => {
    const nodeVersion = getNodeVersion('15.0.0')
    expect(isAlsSupported(nodeVersion)).toBe(true)
  })
})
