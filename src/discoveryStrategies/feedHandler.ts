import type { DiscoveredFeed } from './types'

const XML_CONTENT_TYPES = new Set([
  'text/xml',
  'application/xml',
  'application/rss+xml',
  'application/atom+xml',
])

const JSON_CONTENT_TYPES = new Set([
  'application/feed+json',
  'application/json',
])

type MaybeJSONFeed = {
  title?: string,
  version?: string,
}

/**
 * Detects when the user is viewing a raw feed.
 */
export default function findFeedHandler(document: Document): DiscoveredFeed[] {
  const { contentType } = document

  if (XML_CONTENT_TYPES.has(contentType)) {
    const rootNode = document.children[0]
    if (rootNode && (rootNode.nodeName === 'feed' || rootNode.nodeName === 'rss')) {
      return [{ title: document.title, url: document.location.toString() }]
    }
  }

  if (JSON_CONTENT_TYPES.has(contentType)) {
    try {
      const data = JSON.parse(document.body.innerText) as MaybeJSONFeed
      if (typeof data === 'object' && typeof data.version === 'string' && data.version.startsWith('https://jsonfeed.org/version/')) {
        return [{ title: data.title || document.title, url: document.location.toString() }]
      }
    } catch {
      // not valid JSON
    }
  }

  return []
}
