import browser from 'webextension-polyfill'

import { createBackgroundStore } from '../redux/store'
import { initErrorHandler } from '../util/errorHandler'

import { changeTab } from '../redux/modules/activeTab'
import { fetchAll } from '../redux/modules/feeds'
import { forgetFeeds } from '../redux/modules/discovery'
import { onPopupStateChange } from '../util/onPopupStateChange'
import { openSidebar, openSubscribeMenuIfNeeded } from '../util/sidebarAction'

initErrorHandler()

let store: Awaited<ReturnType<typeof createBackgroundStore>>
const storeReady = createBackgroundStore().then(s => { store = s })

// Listeners
browser.action.onClicked.addListener(tabInfo => {
  openSidebar(tabInfo.windowId)
    .catch((error) => console.error("Could not open sidebar", error))
  
  void storeReady.then(() =>
    openSubscribeMenuIfNeeded(store.getState(), store.dispatch, tabInfo.id ?? -1)
  )
})

// These can wake the page, so they must be registered before any async work.
browser.tabs.onActivated.addListener(tabInfo =>
  void storeReady.then(() => store.dispatch(changeTab(tabInfo.tabId)))
)
browser.tabs.onUpdated.addListener(tabId =>
  void storeReady.then(() => store.dispatch(changeTab(tabId)))
)
browser.tabs.onRemoved.addListener(tabId =>
  void storeReady.then(() => store.dispatch(forgetFeeds(tabId)))
)

browser.alarms.onAlarm.addListener(alarm => {
  if (alarm.name === 'fetchFeeds' && navigator.onLine) {
    void storeReady.then(() => store.dispatch(fetchAll()))
  }
})

// Post Store Setup

void storeReady.then(() => {
  // Set up browser action badge styling
  browser.action.setBadgeTextColor({ color: '#FFFFFF' }).then(
    () => browser.action.setBadgeBackgroundColor({ color: '#617CBA' })
  ).catch((error) => {
    console.warn('Could not style badge', error)
  })

  // Update badge based on page state.
  onPopupStateChange(store, popupState => {
    if (popupState.canSubscribe) {
      browser.action.setBadgeText({ text: '✚' }).catch((error) => {
        console.warn('Could not update badge', error)
      })
    } else {
      browser.action.setBadgeText({ text: '' }).catch((error) => {
        console.warn('Could not update badge', error)
      })
    }
  })

  // Schedule fetching feeds every 15m, persisting across event page restarts
  browser.alarms.create('fetchFeeds', { periodInMinutes: 15 })
})