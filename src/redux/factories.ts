import { FEED } from './modules/feeds'
import { humanizeURL } from '../util/url'
import type { Feed, Folder, FeedInput, FolderInput } from './types'
import { FOLDER } from './modules/folders'

/**
 * Builds a feed from whatever data is available.
 */
export function buildFeed(feed: FeedInput): Feed {
  if (!feed.url) throw new Error("Feeds must have a URL")

  return ({
    id: feed.id || randomId(),
    type: FEED,
    format: feed.format,
    isLoading: !!feed.isLoading,
    url: new URL(feed.url).toString(),
    title: feed.title || humanizeURL(feed.url),
    customTitle: feed.customTitle,
    isEditing: feed.isEditing || false,
    items: feed.items || [],
    updatedAt: feed.updatedAt || 0
  })
}

/**
 * Builds a new folder from whatever data is available.
 */
export function buildFolder(folder: FolderInput = {}): Folder {
  return {
    id: folder.id || randomId(),
    type: FOLDER,
    title: folder.title || "Folder",
    children: folder.children || [],
    isEditing: folder.isEditing || false,
    expanded: true,
  }
}

function randomId(): string {
  // Note: the substring is used to slice out the `0.` from a base36 string
  // like `0.occd054dfpi`.
  return Math.random().toString(36).substring(2, 15)
}