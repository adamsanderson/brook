import { FEED } from './modules/feeds'
import { WATCH } from './modules/watches'
import { FOLDER } from './modules/folders'

import { humanizeURL } from '../util/url'

/**
 * Builds a feed from whatever data is available.
 * 
 * @param {Object} feed - parsed feed data
 * @param {string} feed.url - the feed's URL.  This is the only required attribute.
 */
export function buildFeed(feed) {
  if (!feed.url) throw new Error("Feeds must have a URL")
  
  return ({
    id: feed.id || randomId(),
    type: FEED,
    isLoading: !!feed.isLoading,
    url: new URL(feed.url).toString(),
    title: feed.title || humanizeURL(feed.url),
    items: feed.items || [],
    updatedAt: feed.updatedAt || 0
  })
}

/**
 * Builds a watch from whatever data is available.
 * 
 * @param {Object} watch - stored watch data
 * @param {string} watch.url - the watched site's URL.  This is the only required attribute.
 */
export function buildWatch(watch) {
  if (!watch.url) throw new Error("Watched sites must have a URL")
  
  return ({
    id: watch.id || randomId(),
    type: WATCH,
    isLoading: !!watch.isLoading,
    url: new URL(watch.url).toString(),
    title: watch.title || humanizeURL(watch.url),
    updatedAt: watch.updatedAt || 0
  })
}

/**
 * Builds a new folder from whatever data is available.
 * 
 * @param {Object=} folder - initial folder attributes
 */
export function buildFolder(folder = {}) {
  return {
    id: folder.id || randomId(),
    type: FOLDER,
    title: folder.title || "Folder",
    children: folder.children || [],
    isEditing: folder.isEditing || false,
    expanded: true,
  }
}

function randomId() {
  // Note: the substring is used to slice out the `0.` from a base36 string 
  // like `0.occd054dfpi`.
  return Math.random().toString(36).substring(2, 15)
}