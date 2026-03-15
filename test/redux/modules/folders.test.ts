import { describe, it, expect } from "vitest"
import { dispatchEach, TestState } from "../../helpers.ts"
import { buildFeed, buildFolder } from "../../../src/redux/factories.ts"
import { OVER, BEFORE, AFTER } from "../../../src/constants.ts"
import folders, {
  ROOT,
  addFolder,
  moveNode,
  type FoldersState,
} from "../../../src/redux/modules/folders.ts"

import { 
  addFeed,
} from "../../../src/redux/modules/feeds.ts"
import { Folder } from "../../../src/redux/types.ts"

const reducer = folders.reducer

// Fixtures
const feed   = Object.freeze(buildFeed({url: "http://example.com"}))
const feed1  = Object.freeze(buildFeed({url: "http://example.com/1"}))
const feed2  = Object.freeze(buildFeed({url: "http://example.com/2"}))
const folder = Object.freeze(buildFolder())

describe('folder reducer', () => {
  it('should contain the ROOT in its initial state', () => {
    const state = reducer(undefined, {})
    expect(state).toHaveProperty(ROOT)
  })

  describe('adding nodes', () => {
    it('should add feeds to root', () => {
      const state = dispatchEach(addFeed(feed), {})
      const root = getEntry(state, ROOT)

      expect(root?.children.map(c => c.id)).toEqual([feed.id])
    })

    it('should add feeds in order', () => {
      const state = dispatchEach([
        addFeed(feed1),
        addFeed(feed2),
      ], {})
      
      const ids = getChildIds(state, ROOT)
      expect(ids).toEqual([feed1.id, feed2.id])
    })

    it('should add folders to root', () => {
      const state = dispatchEach(addFolder(folder), {})
      
      const ids = getChildIds(state, ROOT)
      expect(ids).toEqual([folder.id])
    })

    it('should add feeds to folders', () => {
      const state = dispatchEach([
        addFolder(folder),
        addFeed(feed, {parentId: folder.id}),
      ], {})
      
      const ids = getChildIds(state, folder)
      expect(ids).toEqual([feed.id])
    })
  })

  describe('moving nodes', () => {
    it('should move feeds between folders', () => {
      const state = dispatchEach([
        addFolder(folder),
        addFeed(feed),
        moveNode(feed, folder, OVER)
      ], {})
      
      const folderIds = getChildIds(state, folder)
      const rootIds = getChildIds(state, ROOT)
      
      expect(folderIds).toEqual([feed.id])
      expect(rootIds).toEqual([folder.id])
    })

    it('should move items before others', () => {
      const state = dispatchEach([
        addFolder(folder),
        addFeed(feed),
        moveNode(feed, folder, BEFORE)
      ], {})
      
      const ids = getChildIds(state, ROOT)
      expect(ids).toEqual([feed.id, folder.id])
    })

    it('should move items after others', () => {
      const state = dispatchEach([
        addFolder(folder),
        addFeed(feed),
        moveNode(folder, feed, AFTER)
      ], {})
      
      const ids = getChildIds(state, ROOT)
      expect(ids).toEqual([feed.id, folder.id])
    })

    it('should move feeds into open folders when position is AFTER', () => {
      let expanded = {...folder, expanded: true}
      
      const state = dispatchEach([
        addFolder(expanded),
        addFeed(feed),
        moveNode(feed, expanded, AFTER)
      ], {})
      
      const ids = getChildIds(state, expanded)
      expect(ids).toEqual([feed.id])
    })
  })
})

function getEntry(state: TestState, item: Folder | string): Folder | undefined {
  const id = typeof item === 'object' ? item.id : item
  return (state[folders.name] as FoldersState)[id]
}

function getChildIds(state: TestState, item: Folder | string) {
  return getEntry(state, item)?.children.map(c => c.id)
}