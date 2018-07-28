import documentLinks from './documentLinks'
import feedBurner from './feedBurner'
import feedHandler from './feedHandler'

const strategies = [
  documentLinks,
  feedBurner,
  feedHandler,
]

export function discoverFeeds(document) {
  for (var i = 0; i < strategies.length; i++) {
    const feeds = strategies[i](document)
    if (feeds && feeds.length > 0) return feeds
  }

  return []
}