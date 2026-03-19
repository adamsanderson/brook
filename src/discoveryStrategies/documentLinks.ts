import { humanizeHost } from '../util/url'
import type { DiscoveredFeed } from './types'

// Search for known permutations of possible feed sources:
const SELECTORS = `
  link[rel~=feed][type="application/rss+xml"],
  link[rel~=alternate][type="application/rss+xml"],
  link[rel~=feed][type="application/atom+xml"],
  link[rel~=alternate][type="application/atom+xml"],
  link[rel~=feed][type="application/feed+json"],
  link[rel~=alternate][type="application/feed+json"]
`

/**
 * Searches the current page for discovery link metadata.
 */
function documentLinks(document: Document): DiscoveredFeed[] {
  const feedLinks = document.querySelectorAll<HTMLLinkElement>(SELECTORS)
  const feeds = Array.from(feedLinks).map((linkEl) => ({
    title: linkEl.getAttribute('title') || humanizeHost(linkEl.getAttribute('href') || ''),
    url: linkEl.getAttribute('href') || '',
  }))

  return feeds
}

export default documentLinks
