import { FEED } from './modules/feeds'
import { FOLDER } from './modules/folders'

import { humanizeURL } from '../util/url'
import { NodeRef } from './types'

export type FeedItem = {
  id: string
  createdAt: number
  title: string,
  url: string,
}

export type Feed = {
  id: string
  type: typeof FEED
  format?: string
  isLoading: boolean
  url: string
  title: string
  customTitle?: string
  isEditing: boolean
  items: FeedItem[]
  updatedAt: number
}

export type Folder = {
  id: string
  type: typeof FOLDER
  title: string
  children: NodeRef[]
  isEditing: boolean
  expanded: boolean
}

export type FeedInput = Partial<Omit<Feed, 'type'>> & Required<Pick<Feed, 'url'>>

export type FolderInput = Partial<Omit<Folder, 'type'>>

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