import type { MouseEvent } from 'react'
import { getOperatingSystem, MAC } from "./operatingSystem"
import browser from "webextension-polyfill"

/**
 * Firefox changed the semantics of following a link (brilliant!) and always opens
 * sidebar tabs in new windows.  So we need to manually handle clicking links…
 */
export default function handleOnClick(event: MouseEvent): void {
  // Ignore handled events
  if (event.isDefaultPrevented()) return
  
  // Ignore clicks not using the primary mouse button
  if (event.button !== 0) return

  const target = event.target as HTMLElement
  if (target.nodeName === "A") {
    const anchor = target as HTMLAnchorElement
    const url = anchor.getAttribute('href')
    if (url && url[0] !== "#") {
      openLink(url, event)
      event.preventDefault()
    }
  }
}

function openLink(url: string, event: MouseEvent): void {
  if (shouldUseNewTab(event)) {
    browser.tabs.create({url: url, active: event.shiftKey}).catch((error) => {
      console.warn("Could not open new tab", error)
    })
  } else if (shouldUseNewWindow(event)) {
    browser.windows.create({url: url}).catch((error) => {
      console.warn("Could not open new window", error)
    })
  } else {
    browser.tabs.update({url: url}).catch((error) => {
      console.warn("Could not open tab", error)
    })
  }
}

function shouldUseNewTab(event: MouseEvent): boolean {
  if (getOperatingSystem() === MAC) {
    return event.metaKey
  } else {
    return event.ctrlKey
  }
}

function shouldUseNewWindow(event: MouseEvent): boolean {
  return event.shiftKey
}
