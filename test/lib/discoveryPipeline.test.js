import transformFeeds from "../../src/lib/discoveryPipeline"

describe('Discovery Pipeline', () => {
  describe('Duplicates', () => {
    it('removes duplicates feeds', () => {
      const urls = transformFeeds([
        { title: 'a', url: 'http://a.com' },
        { title: 'b', url: 'http://b.com' },
        { title: 'a', url: 'http://a.com' },
      ])

      expect(urls).toHaveLength(2)
    })

    it('removes duplicates urls', () => {
      const urls = transformFeeds([
        { title: 'a', url: 'http://a.com' },
        { title: 'a again', url: 'http://a.com' },
      ])

      expect(urls).toHaveLength(1)
    })
  })
  
  describe('Normalizing', () => {
    it('transforms feed protocol', () => {
      const urls = transformFeeds([
        { title: 'a', url: 'feed://a.com' },
      ])

      expect(urls[0].url).toBe('http://a.com/')
    })
  })

  describe('Removing redundant feeds', () => {
    it('removes protocol alternatives', () => {
      const urls = transformFeeds([
        { title: 'a – Atom', url: 'http://a.com' },
        { title: 'a – Comments', url: 'http://a.com?comments=1' },
        { title: 'a – RSS', url: 'http://a.com?version=rss' },
      ])

      expect(urls.map(u => u.title)).toEqual(['a – Atom', 'a – Comments'])
    })
  })
})