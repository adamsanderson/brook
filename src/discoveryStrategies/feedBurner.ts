import { humanizeHost } from '../util/url'
import type { DiscoveredFeed } from './types'

// Search for known permutations of possible feed sources:
const SELECTORS = `
  a[href^="http://feeds.feedburner.com/"],
  a[href^="http://feeds2.feedburner.com/"]
`

/**
 * Searches the current page for links to FeedBurner, a common feed proxy.
 */
function feedBurnerLinks(document: Document): DiscoveredFeed[] {
  const feedLinks = document.querySelectorAll<HTMLAnchorElement>(SELECTORS)
  const feeds = Array.from(feedLinks).map((linkEl) => ({
    title: linkEl.getAttribute('title') || humanizeHost(linkEl.getAttribute('href') || ''),
    url: linkEl.getAttribute('href') || '',
  }))

  return feeds
}

export default feedBurnerLinks
