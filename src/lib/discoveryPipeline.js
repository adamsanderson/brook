import { resolveUrl, normalizeProtocol } from '../util/url'

/**
 * Transforms discovered feeds, processing them to give users the best
 * options possible when visiting a page.
 * 
 * @param {Feed[]} feeds to be filtered, normalized, and transformed.
 * @returns a new array of feeds
 */
export default function transformFeeds(feeds) {
  feeds = removeDuplicates(feeds)
  feeds = normalizeFeeds(feeds)
  feeds = removeRedundant(feeds)

  return feeds
}

// Remove feeds with duplicate URLs.
function removeDuplicates(feeds) {
  const urls = new Set()
  return feeds.filter(feed => {
    const url = feed.url
    if (urls.has(url)) { return false }

    urls.add(url)
    return true
  })
}

// Remove feeds that only vary based on their protocol. We favor Atom feeds because they
// tend to be slightly better encoded (escaping, etc.).
function removeRedundant(feeds) {
  if (feeds.length <= 1) return feeds

  let feedsWithoutAtom
  return feeds.filter(feed => {
    // Split title on non letters (whitespace, punctuation, etc)
    if (feed.title.toLowerCase().split(/\W+/).indexOf("rss") !== -1) {
      const title = feed.title.toLowerCase().replace("rss", "")
      feedsWithoutAtom = feedsWithoutAtom || feeds.map(f => f.title.toLowerCase().replace("atom", ""))
      return feedsWithoutAtom.indexOf(title) === -1
    }

    return true
  })
}

// Normalizes feed protocol and transforms URLs into absolute paths.
function normalizeFeeds(feeds) {
  return feeds.map(feed => {
    let url = feed.url
    url = normalizeProtocol(url)
    url = resolveUrl(url)

    return { ...feed, url }
  })
}