import { getOperatingSystem, MAC } from "./operatingSystem"

/**
 * Firefox changed the semantics of following a link (brilliant!) and always opens
 * sidebar tabs in new windows.  So we need to manualy handle clicking links…
 * 
 * @param {MouseEvent} event to intercept.
 */
export default function handleOnClick(event) {
  // Ignore handled events
  if (event.isDefaultPrevented()) return
  
  // Ignore clicks not using the primary mouse button
  if (event.button !== 0) return

  const target = event.target
  if (target.nodeName === "A") {
    const url = target.getAttribute('href')
    if (url && url[0] !== "#") {
      openLink(target.getAttribute('href'), event)
      event.preventDefault()
    }
  }
}

function openLink(url, event) {
  if (useNewTab(event)) {
    browser.tabs.create({url: url, active: event.shiftKey})
  } else if (useNewWindow(event)) {
    browser.windows.create({url: url})
  } else {
    browser.tabs.update({url: url})
  }
}

function useNewTab(event) {
  if (getOperatingSystem() === MAC) {
    return event.metaKey
  } else {
    return event.ctrlKey
  }
}

function useNewWindow(event) {
  return event.shiftKey
}