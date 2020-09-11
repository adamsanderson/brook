import documentLinks from './documentLinks'
import feedBurner from './feedBurner'
import feedHandler from './feedHandler'
import medium from './medium'
import wordpressApi from './wordpressApi'
import wordpressAssets from './wordpressAssets'

const NONE = []

const strategies = [
  documentLinks,
  feedBurner,
  feedHandler,
  medium,
  wordpressApi,
  wordpressAssets,
]

export function discoverFeeds(document) {
  for (var i = 0; i < strategies.length; i++) {
    const feeds = strategies[i](document)
    if (feeds && feeds.length > 0) return feeds
  }

  return NONE
}

export function discoverFeedsFromString(string) {
  const parser = new DOMParser()
  const document = parser.parseFromString(string, "text/html")
  return discoverFeeds(document)
}