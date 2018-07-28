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
    const u = f.url
    if (urls.has(u)) { return false }

    urls.add(u)
    return true
  })
}

function normalizeFeeds(feeds) {
  // Note: this mutates the feeds in place.
  feeds.forEach((f) => {
    // Make paths fully qualified:
    f.url = resolveUrl(f.url)
  })

  return feeds
}

document.addEventListener("visibilitychange", findFeeds)

findFeeds()