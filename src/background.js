import { createBackgroundStore } from './redux/store'
import { initErrorHandler } from './util/errorHandler'

import { changeTab } from "./redux/modules/activeTab"
import { fetchAll } from "./redux/modules/feeds"
import { forgetFeeds } from "./redux/modules/discovery"
import { onNotificationStateChange } from './util/onNotificationStateChange'

const MINUTE = 60 * 1000

initErrorHandler()

createBackgroundStore().then(store => {
  // Track when tabs change
  browser.tabs.onActivated.addListener(tabInfo => store.dispatch(changeTab(tabInfo.tabId)))
  browser.tabs.onUpdated.addListener(tabId => store.dispatch(changeTab(tabId)))
  browser.tabs.onRemoved.addListener(tabId => store.dispatch(forgetFeeds(tabId)))

  onNotificationStateChange(store, (state => {
    if (state.canSubscribe) {
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
})