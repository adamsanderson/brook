import { createProxyStore } from "./redux/store"
import { foundFeeds } from "./redux/modules/discovery"
import { discoverFeeds } from './discoveryStrategies'
import transformFeeds from './lib/discoveryPipeline'

const store = createProxyStore()

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
  feeds = transformFeeds(feeds)

  store.dispatch(foundFeeds(feeds))
}

document.addEventListener("visibilitychange", findFeeds)

findFeeds()