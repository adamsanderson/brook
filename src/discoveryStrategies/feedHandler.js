/**
 * Detects firefox's feed handler HTML.
 * 
 * This is sub-optimal, but I'm not sure how to:
 * 1. Hook into the existing feed handler.
 * 2. Detect a feed before it gets rewritten.
 */
export default function findFeedHandler(document) {
  if (document.querySelector('html#feedHandler') && document.querySelector('script[src^="chrome://"]')) {
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