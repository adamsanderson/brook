import browser from 'webextension-polyfill'

import { createBackgroundStore } from '../redux/store'
import { initErrorHandler } from '../util/errorHandler'

import { changeTab } from '../redux/modules/activeTab'
import { fetchAll } from '../redux/modules/feeds'
import { forgetFeeds } from '../redux/modules/discovery'
import { getNotificationState, onPopupStateChange } from '../util/onPopupStateChange'
import { openSidebar } from '../util/sidebarAction'

initErrorHandler()

let store: Awaited<ReturnType<typeof createBackgroundStore>>
const storeReady = createBackgroundStore().then(s => { store = s })

// Listeners
browser.action.onClicked.addListener((tabInfo) =>
  void handleActionClick(tabInfo)
)

async function handleActionClick(tabInfo: browser.Tabs.Tab) {
  try {
    await openSidebar(tabInfo.windowId)
  } catch (error) {
    console.error("Could not open sidebar", error)
  }

  // Set and clear the popup.
  // If the popup is set when this action is called, the popup will trigger,
  // ignoring the browser action.
  await storeReady
  if (getNotificationState(store.getState()).canSubscribe) {
    await browser.action.setPopup({ popup: '/src/SubscribePopup/index.html' })
    await browser.action.openPopup({ windowId: tabInfo.windowId })
    await browser.action.setPopup({ popup: '' })
  }
}

// These can wake the page, so they must be registered before any async work.
browser.tabs.onActivated.addListener((tabInfo) => {
  void storeReady
    .then(() => browser.tabs.get(tabInfo.tabId))
    .then((tab) => {
      store.dispatch(changeTab({
        tabId: tabInfo.tabId,
        url: tab.url
      }))
    })
})

browser.tabs.onUpdated.addListener((tabId, _changes, tab) =>
  void storeReady
    .then(() => {
      store.dispatch(changeTab({
        tabId,
        url: tab.url
      }))
    })
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