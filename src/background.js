import { createBackgroundStore } from './redux/store'
import { initErrorHandler } from './util/errorHandler'

import { changeTab } from "./redux/modules/activeTab"
import { fetchAll } from "./redux/modules/feeds"
import { forgetFeeds } from "./redux/modules/discovery"
import options from "./redux/modules/options"
import { onPopupStateChange } from './util/onPopupStateChange'

const MINUTE = 60 * 1000

initErrorHandler()

const store = createBackgroundStore()
// Close the sidebar when the popup is triggered.
// In order to receive events here, you need to not have a popup, and you need to trigger
// open/close events on sidebarAction and browserAction from a direct user event.
browser.browserAction.onClicked.addListener(() => {
  const state = store.getState()
  const viewMode = options.selectors.getViewMode(state)

  if (viewMode === 'sidebar') {
    browser.sidebarAction.open()
  } else {
    browser.sidebarAction.close()
    browser.browserAction.setPopup({popup: "popup.html"})
    browser.browserAction.openPopup()
    browser.browserAction.setPopup({popup: ""})
  }
})

// Track when tabs change
browser.tabs.onActivated.addListener(tabInfo => store.dispatch(changeTab(tabInfo.tabId)))
browser.tabs.onUpdated.addListener(tabId => store.dispatch(changeTab(tabId)))
browser.tabs.onRemoved.addListener(tabId => store.dispatch(forgetFeeds(tabId)))

onPopupStateChange(store, (popupState => {
  if (popupState.isUnread && popupState.viewMode !== 'sidebar') {
    browser.browserAction.setIcon({path: "images/Brook-Notifications.svg"})
  } else if (popupState.canSubscribe) {
    browser.browserAction.setIcon({path: "images/Brook-Subscribe.svg"})
  } else {
    browser.browserAction.setIcon({path: "images/Brook.svg"})
  }
}))

// Schedule fetching feeds every 15m
setInterval(() => {
  if (navigator.onLine) {
    store.dispatch(fetchAll())
  }
}, 15 * MINUTE)