import { reduceEach } from "../../helpers"
import { buildFeed, buildFolder } from "../../../src/redux/factories"
import { OVER, BEFORE, AFTER } from "../../../src/constants"
import folders, {
  ROOT,
  addFolder,
  moveNode,
} from "../../../src/redux/modules/folders"

import { 
  addFeed,
} from "../../../src/redux/modules/feeds"

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
      const state = reducer(undefined, addFeed(feed))
      const root = state[ROOT]

      expect(root.children.some(c => c.id === feed.id))
    })

    it('should add feeds in order', () => {
      const state = reduceEach(reducer, [
        addFeed(feed1),
        addFeed(feed2),
      ])
      
      const root = state[ROOT]
      const ids = root.children.map(c => c.id)

      expect(ids).toEqual([feed1.id, feed2.id])
    })

    it('should add folders to root', () => {
      const state = reducer(undefined, addFolder(folder))
      const root = state[ROOT]

      expect(root.children.some(c => c.id === folder.id))
    })

    it('should add feeds to folders', () => {
      const state = reduceEach(reducer, [
        addFolder(folder),
        addFeed(feed, folder.id),
      ])
      
      expect(state[folder.id].children.some(c => c.id === feed.id))
    })
  })

  describe('moving nodes', () => {
    it('should move feeds between folders', () => {
      const state = reduceEach(reducer, [
        addFolder(folder),
        addFeed(feed),
        moveNode(feed, folder, OVER)
      ])
      
      expect(state[folder.id].children.some(c => c.id === feed.id))
      expect(!state[ROOT].children.some(c => c.id === feed.id))
    })

    it('should move items before others', () => {
      const state = reduceEach(reducer, [
        addFolder(folder),
        addFeed(feed),
        moveNode(feed, folder, BEFORE)
      ])
      
      const expectedIds = [feed.id, folder.id]
      expect(state[ROOT].children.map(c => c.id)).toEqual(expectedIds)
    })

    it('should move items after others', () => {
      const state = reduceEach(reducer, [
        addFolder(folder),
        addFeed(feed),
        moveNode(folder, feed, AFTER)
      ])
      
      const expectedIds = [feed.id, folder.id]
      expect(state[ROOT].children.map(c => c.id)).toEqual(expectedIds)
    })

    it('should move feeds into open folders when position is AFTER', () => {
      let expanded = {...folder, expanded: true}
      const state = reduceEach(reducer, [
        addFolder(expanded),
        addFeed(feed),
        moveNode(feed, expanded, AFTER)
      ])
      
      expect(state[expanded.id].children.some(c => c.id === feed.id))
    })
  })
})