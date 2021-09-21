import { humanizeHost } from "../util/url"
import { WP_API } from "../constants"

// Search for Wordpress Assets
const SELECTORS = `
  meta[content*="/wp-content/"]
`

const API_REGEXP = '(.+)/wp-content/'

/**
 * Detects wordpress API instances by looking for wordpress assets.
 * Typically you can find them on image uploads for the site, ie:
 *  <meta property="og:image" content="https://api.example.com/wp-content/uploads/…">
 */
function wordPressAssets(document) {
  const location = document.location
  if (!location) return

  const rootDomain = getRootDomain(location)

  const feedLinks = document.querySelectorAll(SELECTORS)
  const feeds = Array.from(feedLinks)
  .filter(metaEl => getRootDomain(new URL(metaEl.getAttribute("content"))) === rootDomain)
  .map(metaEl => ({
    title: document.title || humanizeHost(metaEl.getAttribute("content")),
    url: getApiEndpoint(metaEl.getAttribute("content")),
    format: WP_API,
  }))

  return feeds
}

function getRootDomain(url) {
  return url.hostname.split('.').slice(-2).join('.')
}

function getApiEndpoint(link) {
  return link.match(API_REGEXP)[1] + '/wp-json/wp/v2/posts'
}

export default wordPressAssets