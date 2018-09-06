// Detect custom domains by looking for the following elements.
const CUSTOM_DOMAIN_SELECTORS = `
  meta[property="al:ios:app_name"][content=Medium],
  meta[property="al:android:app_name"][content=Medium]
`

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
    return authorFeed(document)
  } else if (document.querySelector(CUSTOM_DOMAIN_SELECTORS)) {
    return customDomainFeed(document)
  }
  
  return []
}

function authorFeed(document) {
  const link = document.querySelector('link[rel=author]')
  if (link && link.href) {
    const authorPath = new URL(link.href).pathname
    const url = new URL(location)
    url.pathname = `/feed${authorPath}`

    return [
      { title: authorPath, url: url.toString() }
    ]
  }
}

function customDomainFeed(document) {
  const url = new URL(location)
  url.pathname = `/feed`

  return [
    { title: document.title, url: url.toString() }
  ]
}


export default mediumLinks