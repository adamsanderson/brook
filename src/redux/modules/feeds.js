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

/**
  Attempts to provide a reasonable "name" for a URL.
  Invalid urls will return an empty string.
*/
export function humanizeURL(path) {
  try {
    const url = coerceToURL(path)
    
    const pathname = url.pathname
    
    // Get the last segment of the pathname:
    const segment = pathname.replace(/\/+$/,"").split("/").pop()
    
    // Split on non common non alphanumeric symbols and word breaks:
    const humanized = segment.split(/[-_\+\s]+/).join(" ").replace(/([a-z])([A-Z])/, "$1 $2")
    
    if (humanized.length > 2) {
      return startCase(humanized)
    } else {
      return url.hostname
    }
    
  } catch (err) {
    console.warn("Could not humanize: "+path+", "+err.toString())
    return path
  }
}

/**
  Tries to clean up messy URLs.  For instance:
  
      www.example.com => http://www.example.com
  
  Throws an Error if it cannot create a URL.
*/
function coerceToURL(path) {
  try {
    return new window.URL(path)
  } catch (err) {
    return new window.URL("http://" + path)
  }
}

export default {
  name: "feeds",
  reducer
}