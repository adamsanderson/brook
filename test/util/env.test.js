import env from '../../src/util/env'

describe('env', () => {
  it('should have an environment name', () => {
    expect(env.environmentName).toBe('test')
  })

  it('should set current env to true', () => {
    expect(env.test).toBe(true)
  })

  it('should leave other environments as undefined', () => {
    expect(env.development).toBe(undefined)
  })
})