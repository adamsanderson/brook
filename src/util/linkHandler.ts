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
  if (useNewTab(event)) {
    browser.tabs.create({url: url, active: event.shiftKey})
  } else if (useNewWindow(event)) {
    browser.windows.create({url: url})
  } else {
    browser.tabs.update({url: url})
  }
}

function useNewTab(event: MouseEvent): boolean {
  if (getOperatingSystem() === MAC) {
    return event.metaKey
  } else {
    return event.ctrlKey
  }
}

function useNewWindow(event: MouseEvent): boolean {
  return event.shiftKey
}
