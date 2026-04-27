import browser from 'webextension-polyfill'

import { createBackgroundStore } from '../redux/store'
import { initErrorHandler } from '../util/errorHandler'

import { changeTab } from '../redux/modules/activeTab'
import { fetchAll } from '../redux/modules/feeds'
import { forgetFeeds } from '../redux/modules/discovery'
import options from '../redux/modules/options'
import { onPopupStateChange, getNotificationState } from '../util/onPopupStateChange'

// These paths are not guaranteed, but they seem to work for now:
const subscribePopupURL = '/src/SubscribePopup/index.html'
const popupURL = '/src/Popup/index.html'

initErrorHandler()

let store: Awaited<ReturnType<typeof createBackgroundStore>>
const storeReady = createBackgroundStore().then(s => { store = s })

// Listeners
// These can wake the page, so they must be registered before any async work.

browser.action.onClicked.addListener(
  // In order to receive events here, you need to not have a popup, and you need to trigger
  // open/close events on sidebarAction and action from a direct user event.
  () => void storeReady.then(() => handleBrowserActionClick())
)

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
    if (popupState.isUnread && popupState.viewMode !== 'sidebar') {
      browser.action.setBadgeText({ text: '★' }).catch((error) => {
        console.warn('Could not update badge', error)
      })
    } else if (popupState.canSubscribe) {
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

// ── Handlers ────────────────────────────────────────────────────────────

async function handleBrowserActionClick() {
  const state = store.getState()
  const viewMode = options.selectors.getViewMode(state)

  if (viewMode === 'sidebar') {
    const popupState = getNotificationState(state)
    if (popupState.canSubscribe) {
      await openPopup(subscribePopupURL)
    } else {
      await browser.action.setPopup({ popup: "" })
      await browser.sidebarAction.open()
    }
  } else {
    await openPopup(popupURL)
  }
}

// Open a custom popup and then reset the popup URL for the next caller.
async function openPopup(url: string) {
  await browser.action.setPopup({ popup: url })
  await browser.action.openPopup()
  // Reset to default popup
  await browser.action.setPopup({ popup: "" })
}
