import { Store } from 'react-chrome-redux'
import { foundFeeds, forgetFeeds } from "./redux/modules/discovery";
import { humanizeHost } from "./util/url";

const store = new Store({
  portName: 'Brook'
})

// Search for known permutations of possible feed sources:
const SELECTORS = `
  link[rel~=feed][type="application/rss+xml"],
  link[rel~=alternate][type="application/rss+xml"],
  link[rel~=feed][type="application/atom+xml"],
  link[rel~=alternate][type="application/atom+xml"]
`

/**
 * Detect feeds on current page.
 * This will bail out early if the page is not visible since we're only interested 
 * in the active page.
 */
function findFeeds() {
  // Only search for feeds in an active view:
  if (document.hidden) { return }

  let feeds = findFeedLinks()
  if (!feeds.length) feeds = findFeedHandler()

  reportFeeds(feeds)
}

/**
 * Searches the current page for discovery links.
 */
function findFeedLinks() {
  const feedLinks = document.querySelectorAll(SELECTORS)
  const feeds = Array.from(feedLinks).map(linkEl => ({
    title: linkEl.getAttribute("title") || humanizeHost(linkEl.getAttribute("href")),
    url: linkEl.getAttribute("href")
  }))
  
  return feeds
}

/**
 * Detects firefox's feed handler HTML.  This is sub-optimal, but I'm not sure how to:
 * 1. Hook into the existing feed handler.
 * 2. Detect a feed before it gets rewritten.
 */
function findFeedHandler() {
  if (document.querySelector('html#feedHandler') && document.querySelector('script[src^="chrome://"]')) {
    return [
      {
        title: document.title,
        url: document.location.toString()
      }
    ]
  } else {
    return []
  }
}

function reportFeeds(feeds) {
  feeds = removeDuplicates(feeds)
  store.dispatch(foundFeeds(feeds))
}

function discardFeeds() {
  store.dispatch(forgetFeeds())
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

document.addEventListener("visibilitychange", findFeeds)
document.addEventListener("unload", discardFeeds)

findFeeds()