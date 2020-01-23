import { dispatch } from './redux/dispatchChannel'
import { foundFeeds } from './redux/modules/discovery'
import { discoverFeeds } from './discoveryStrategies'
import transformFeeds from './lib/discoveryPipeline'
import { initErrorHandler, reportError } from './util/errorHandler'

initErrorHandler({
  // Explicitly try/catch for errors.  We are ONLY interested in errors coming from Brook.
  globalHandlers: false,
})

/**
 * Detect feeds on current page.
 * This will bail out early if the page is not visible since we're only interested 
 * in the active page.
 */
function findFeeds() {
  try {
    if (document.hidden) { return }
    reportFeeds(discoverFeeds(document))
  } catch (error) {
    reportError(error)
  }
}

function reportFeeds(feeds) {
  try {
    feeds = transformFeeds(feeds)
    dispatch(foundFeeds(feeds))
  } catch (error) {
    reportError(error)
  }
}

document.addEventListener("visibilitychange", findFeeds)

findFeeds()