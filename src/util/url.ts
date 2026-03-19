/*
 * Assorted functions for working with urls.
 */


/**
 * A lenient, but correct enough URL regular expression
 */
const URL_REGEXP = /https?:\/\/[^\s/$.?#].[^\s]*/

/**
  Attempts to provide a reasonable "name" for a URL by humanizing the last
  segment of the URL.

  Invalid urls will return an empty string.
*/
export function humanizeURL(path: string): string {
  try {
    const url = coerceToURL(path)
    
    const pathname = url.pathname
    
    // Get the last segment of the pathname:
    const segment = pathname.replace(/\/+$/,"").split("/").pop()
    
    // Split on non common non alphanumeric symbols and word breaks:
    const humanized = segment?.split(/[-_+\s]+/).join(" ").replace(/([a-z])([A-Z])/, "$1 $2")
    
    if (humanized && humanized.length > 2) {
      return humanized
    } else {
      return url.hostname
    }
    
  } catch (err) {
    console.warn("Could not humanize:", path, err?.toString())
    return path
  }
}

/**
 * Tries to return a sensible name from a url based on the host name.
 */
export function humanizeHost(path: string): string {
  try {
    const url = coerceToURL(path)
    return url.hostname

  } catch (err) {
    console.warn("Could not humanize:", path, err?.toString())
    return path
  }
}

/**
 * Resolves a url against the base url.  This is simply a wrapper around
 * the [URL constructor](https://developer.mozilla.org/en-US/docs/Web/API/URL/URL)
 * that will always return a String.
 */
export function resolveUrl(url: string, base: string | URL = window.location.toString()): string {
  return new window.URL(url, base).toString()
}

/**
 * Translate feed protocol (and any others in the future) to URLs.
 * See https://en.wikipedia.org/wiki/Feed_URI_scheme for more details.
 */
export function normalizeProtocol(uri: string): string {
  return uri
    .replace(/^feed:\/\//, "http://")
    .replace(/^feed:/, "")
}

/**
  Tries to clean up messy URLs.  For instance:

      www.example.com => http://www.example.com

  Throws an Error if it cannot create a URL.
*/
function coerceToURL(path: string): URL {
  try {
    return new window.URL(path)
  } catch (_err) {
    return new window.URL("http://" + path)
  }
}

/**
 * Find urls in an arbitrary string.
 */
export function findUrls(text: string): RegExpMatchArray | null {
  return text.match(URL_REGEXP)
}