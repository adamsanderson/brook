import { resolveUrl, normalizeProtocol } from '../util/url'
import type { DiscoveredFeed } from '../discoveryStrategies/types'

/**
 * Transforms discovered feeds, processing them to give users the best
 * options possible when visiting a page.
 *
 * @param feeds to be filtered, normalized, and transformed.
 * @returns a new array of feeds
 */
export default function transformFeeds(feeds: DiscoveredFeed[]): DiscoveredFeed[] {
  feeds = removeDuplicates(feeds)
  feeds = normalizeFeeds(feeds)
  feeds = removeRedundant(feeds)

  return feeds
}

// Remove feeds with duplicate URLs.
function removeDuplicates(feeds: DiscoveredFeed[]): DiscoveredFeed[] {
  const urls = new Set<string>()
  return feeds.filter((feed) => {
    const url = feed.url
    if (urls.has(url)) {
      return false
    }

    urls.add(url)
    return true
  })
}

// Remove feeds that only vary based on their protocol. We favor Atom feeds because they
// tend to be slightly better encoded (escaping, etc.).
function removeRedundant(feeds: DiscoveredFeed[]): DiscoveredFeed[] {
  if (feeds.length <= 1) return feeds

  let feedsWithoutAtom: string[] | undefined
  return feeds.filter((feed) => {
    // Split title on non letters (whitespace, punctuation, etc)
    const feedTitle = (feed.title || '').toLowerCase()
    if (feedTitle.split(/\W+/).indexOf('rss') !== -1) {
      const title = feedTitle.replace('rss', '')
      feedsWithoutAtom = feedsWithoutAtom || feeds.map((f) => (f.title || '').toLowerCase().replace('atom', ''))
      return feedsWithoutAtom.indexOf(title) === -1
    }

    return true
  })
}

// Normalizes feed protocol and transforms URLs into absolute paths.
function normalizeFeeds(feeds: DiscoveredFeed[]): DiscoveredFeed[] {
  return feeds.map((feed) => {
    let url = feed.url
    url = normalizeProtocol(url)
    url = resolveUrl(url)

    return { ...feed, url }
  })
}
