import { alias } from 'react-chrome-redux'

import FeedMe from 'feedme';

import { FETCH_FEED, updateFeed } from '../modules/feeds'

const aliases = {
  FETCH_FEED: (action) => {
    // If there's a promise, the action has already been handled.
    if (action.promise) return action

    const feed = action.payload.feed
    return (dispatch) => {
      const promise = fetch(feed.url)
        .then(res => res.text())
        .then(body => {
          const parser = new FeedMe(true)

          parser.on('end', function() {
            const feedData = parser.done()
            const attributes = translateFeedData(feedData)

            console.log("Full Feed", feedData)
            console.log("Feed", attributes)
            
            dispatch(updateFeed(feed, attributes))
          })

          parser.write(body)
          parser.end()

          return body
        })
        .catch(error => {
          console.error(error)
          throw error
        })
      
      dispatch({...action, promise})
    }
  }
}

function translateFeedData(data) {
  const feed = {}
  // Only assign present data, we don't want to override anything with missing data.
  if (data.title) feed.title = data.title
  if (data.items) feed.items = data.items.map(translateItemData)
  
  return feed
}

function translateItemData(data) {
  return {
    title: data.title,
    url: data["feedburner:origlink"] || data["link"],
    createdAt: new Date(data.pubdate),
    description: data.description
  }
}

export default alias(aliases)