import { Store } from 'react-chrome-redux'
import { foundFeeds } from "./redux/modules/discovery"
import { resolveUrl } from './util/url'
import { discoverFeeds } from './discoveryStrategies'

const store = new Store({
  portName: 'Brook'
})

/**
 * Detect feeds on current page.
 * This will bail out early if the page is not visible since we're only interested 
 * in the active page.
 */
function findFeeds() {
  if (document.hidden) { return }

  reportFeeds(discoverFeeds(document))
}

function reportFeeds(feeds) {
  feeds = removeDuplicates(feeds)
  feeds = normalizeFeeds(feeds)

  store.dispatch(foundFeeds(feeds))
}

function removeDuplicates(feeds) {
  const urls = new Set()
  return feeds.filter(f => {
    const url = f.url
    if (urls.has(url)) { return false }

    urls.add(url)
    return true
  })
}

function normalizeFeeds(feeds) {
  return feeds.map(feed => {
    let url = feed.url

    // Translate feed URI to URLs:
    // https://en.wikipedia.org/wiki/Feed_URI_scheme
    url = url.replace(/^feed:\/\//, "http://")
    url = url.replace(/^feed:/, "")
    
    // Resolve relative URLs
    url = resolveUrl(url)

    return { ...feed, url }
  })
}

document.addEventListener("visibilitychange", findFeeds)

findFeeds()