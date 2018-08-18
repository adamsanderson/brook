// Firefox changed the semantics of following a link (brilliant!) and always opens
// sidebar tabs in new windows.  So we need to manualy handle clicking links…
export default function handleOnClick(event) {
  const target = event.target
  if (target.nodeName === "A" && target.getAttribute('href')) {
    openLink(target.getAttribute('href'), event.metaKey)
    event.preventDefault()
  }
}

function openLink(url, useNewTab) {
  if (useNewTab) {
    browser.tabs.create({url: url, active: false})
  } else {
    browser.tabs.update({url: url})
  }
}