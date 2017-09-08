import { humanizeURL } from '../../util/url'

export const ADD_FEED = "ADD_FEED"
export const REMOVE_FEED = "REMOVE_FEED"

export function addFeed(feed) {
  return {type: ADD_FEED, payload: {
    feed: normalizeFeed(feed)
  }}
}

export function removeFeed(feed) {
  return {type: REMOVE_FEED, payload: {
    feed
  }}
}

const initialState = [
  normalizeFeed({title: "MonkeyAndCrow!", url: "http://feeds.feedburner.com/MonkeyAndCrow"}),
  normalizeFeed({title: "Codrops", url: "http://feeds2.feedburner.com/tympanus"})
]

const reducer = (state = initialState, action) => {
  
  switch (action.type) {
    case ADD_FEED:
      console.log("ADD_FEED", action)
      return [...state, action.payload.feed]
    case REMOVE_FEED:
      return state.filter(f => f.id != action.payload.feed.id)
    default:
      return state
  }
}

function normalizeFeed(feed) {
  if (!feed.url) throw new Error("Feeds must have a URL")
  
  return ({
    id: feed.id || Math.random().toString(36).substring(2, 15),
    url: feed.url,
    title: feed.title || humanizeURL(feed.url),
    articles: feed.articles || [],
    updatedAt: feed.updatedAt || new Date()
  })
}

export default {
  name: "feeds",
  reducer
}