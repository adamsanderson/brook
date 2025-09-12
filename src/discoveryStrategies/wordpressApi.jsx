import { humanizeHost } from "../util/url"
import { WP_API } from "../constants"

// Search for Wordpress API links
const SELECTORS = `
  link[rel^="https://api.w.org"]
`
/**
 * Detects wordpress API instances such as:
 *  <link rel="https://api.w.org/" href="https://example.com/wp-json/"></link>
 *
 * We always use the `posts` endpoint.
 * See https://developer.wordpress.org/rest-api/reference/ for more details.
 */
function wordPressApi(document) {
  const feedLinks = document.querySelectorAll(SELECTORS)
  const feeds = Array.from(feedLinks).map(linkEl => ({
    title: document.title || humanizeHost(linkEl.getAttribute("href")),
    url: linkEl.getAttribute("href") + 'wp/v2/posts',
    format: WP_API
  }))

  return feeds
}

export default wordPressApi