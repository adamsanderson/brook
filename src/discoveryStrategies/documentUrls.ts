import { humanizeHost } from '../util/url'
import type { DiscoveredFeed } from './types'

// Search for common page links.
// Ideally these would be link relations, but folks love to hard link feeds, and that's just fine.
const SELECTORS = `
  a[href$="/feed.xml"],
  a[href$="/atom.xml"],
  a[href$="/rss.xml"]
`

/**
 * Searches the current page for discovery link metadata.
 */
function documentLinks(document: Document): DiscoveredFeed[] {
  const feedLinks = document.querySelectorAll<HTMLAnchorElement>(SELECTORS)
  const feeds = Array.from(feedLinks).map((linkEl) => ({
    title: linkEl.getAttribute('title') || humanizeHost(linkEl.getAttribute('href') || ''),
    url: linkEl.getAttribute('href') || '',
  }))

  return feeds
}

export default documentLinks
