import decodeHtmlEntities from "../../src/util/decodeHtmlEntities"

describe('decodeHtmlEntities', () => {
  it('should not affect text without an entity', () => {
    expect(decodeHtmlEntities('hello')).toBe('hello')
  })

  it('should decode named characters', () => {
    expect(decodeHtmlEntities('This &amp; that')).toBe('This & that')
  })

  it('should decode multiple characters', () => {
    expect(decodeHtmlEntities('a &amp;&amp; b')).toBe('a && b')
  })

  it('should decode numeric codes', () => {
    expect(decodeHtmlEntities('Snowman: &#x2603;')).toBe('Snowman: ☃')
  })
})