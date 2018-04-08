import { OVER, BEFORE, AFTER } from "../../../src/constants"

import folders, {
  ROOT,
  addFolder,
  moveNode,
  FOLDER,
} from "../../../src/redux/modules/folders"

import { 
  addFeed, FEED,
} from "../../../src/redux/modules/feeds"

const reducer = folders.reducer

describe('folder reducer', () => {
  it('should contain the ROOT in its initial state', () => {
    const state = reducer(undefined, {})
    expect(state).toHaveProperty(ROOT)
  })

  describe('adding nodes', () => {
    it('should add feeds to root', () => {
      const feed = buildFeed()
      const state = reducer(undefined, addFeed(feed))
      const root = state[ROOT]

      expect(root.children.some(c => c.id === feed.id))
    })

    it('should add feeds in order', () => {
      const feed1 = buildFeed()
      const feed2 = buildFeed()
      const state = reduceEach(reducer, [
        addFeed(feed1),
        addFeed(feed2),
      ])
      
      const root = state[ROOT]
      const ids = root.children.map(c => c.id)

      expect(ids).toEqual([feed1.id, feed2.id])
    })

    it('should add folders to root', () => {
      const folder = buildFolder()
      const state = reducer(undefined, addFolder(folder))
      const root = state[ROOT]

      expect(root.children.some(c => c.id === folder.id))
    })

    it('should add feeds to folders', () => {
      const folder = buildFolder()
      const feed = buildFeed()
      const state = reduceEach(reducer, [
        addFolder(folder),
        addFeed(feed, folder.id),
      ])
      
      expect(state[folder.id].children.some(c => c.id === feed.id))
    })
  })

  describe('moving nodes', () => {
    it('should move feeds between folders', () => {
      const folder = buildFolder()
      const feed = buildFeed()
      const state = reduceEach(reducer, [
        addFolder(folder),
        addFeed(feed),
        moveNode(feed, folder, OVER)
      ])
      
      expect(state[folder.id].children.some(c => c.id === feed.id))
      expect(!state[ROOT].children.some(c => c.id === feed.id))
    })

    it('should move items before others', () => {
      const folder = buildFolder()
      const feed = buildFeed()
      const state = reduceEach(reducer, [
        addFolder(folder),
        addFeed(feed),
        moveNode(feed, folder, BEFORE)
      ])
      
      const expectedIds = [feed.id, folder.id]
      expect(state[ROOT].children.map(c => c.id)).toEqual(expectedIds)
    })

    it('should move items after others', () => {
      const folder = buildFolder()
      const feed = buildFeed()
      const state = reduceEach(reducer, [
        addFolder(folder),
        addFeed(feed),
        moveNode(folder, feed, AFTER)
      ])
      
      const expectedIds = [feed.id, folder.id]
      expect(state[ROOT].children.map(c => c.id)).toEqual(expectedIds)
    })

    it('should move feeds into open folders when position is AFTER', () => {
      const folder = buildFolder()
      folder.expanded = true
      const feed = buildFeed()
      const state = reduceEach(reducer, [
        addFolder(folder),
        addFeed(feed),
        moveNode(feed, folder, AFTER)
      ])
      
      expect(state[folder.id].children.some(c => c.id === feed.id))
    })
  })
})

var id = 1
function buildFeed() {
  return {
    id: id++,
    type: FEED,
    url: "http://example.com/" + id,
  }
}

function buildFolder() {
  return {
    id: id++,
    type: FOLDER,
  }
}

function reduceEach(reducer, actions, initialState = undefined) {
  let state = initialState
  actions.forEach(a => state = reducer(state, a))

  return state
}