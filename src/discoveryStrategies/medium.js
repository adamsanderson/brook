/**
 * Special handler for picking up Medium links.
 * Medium hosts plenty of great content, but does not consistently link it well.
 * 
 * One might even take the cynical point of view and say that they don't want you
 * to use their feeds. That's probably true, and given that they get better data
 * if you use their apps to subscribe.  So it goes.
 */
function mediumLinks(document) {
  const location = document.location
  
  if (location.host === "medium.com") {
    const authorPath = findAuthorPath(document)

    if (authorPath) {
      const url = new URL(location)
      url.pathname = `/feed${authorPath}`

      return [{ title: authorPath, url: url.toString() }]
    }
  }
  
  return []
}

function findAuthorPath(document) {
  const link = document.querySelector('link[rel=author]')
  return link && link.href && new URL(link.href).pathname
}

export default mediumLinks