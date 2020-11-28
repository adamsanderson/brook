/**
 * Detects when the user is viewing a raw XML feed.
 */
export default function findFeedHandler(document) {
  if (document.contentType !== 'text/xml') return []

  const rootNode = document.children[0]

  if (rootNode && (rootNode.nodeName === 'feed' || rootNode.nodeName === 'rss')){
    return [
      {
        title: document.title,
        url: document.location.toString()
      }
    ]
  } else {
    return []
  }
}