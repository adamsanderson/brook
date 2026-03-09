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

const MINUTE = 60 * 1000

initErrorHandler()

const store = createBackgroundStore()
// Close the sidebar when the popup is triggered.
// In order to receive events here, you need to not have a popup, and you need to trigger
// open/close events on sidebarAction and browserAction from a direct user event.
browser.browserAction.onClicked.addListener(
  () => void handleBrowserActionClick()
)

async function handleBrowserActionClick() {
  const state = store.getState()
  const viewMode = options.selectors.getViewMode(state)

  if (viewMode === 'sidebar') {
    const popupState = getNotificationState(state)
    if (popupState.canSubscribe) {
      await openPopup(subscribePopupURL)
    } else {
      await browser.browserAction.setPopup({ popup: "" })
      await browser.sidebarAction.open()
    }
  } else {
    await openPopup(popupURL)
  }
}

// Open a custom popup and then reset the popup URL for the next caller.
async function openPopup(url: string) {
  await browser.browserAction.setPopup({ popup: url })
  await browser.browserAction.openPopup()
  // Reset to default popup
  await browser.browserAction.setPopup({ popup: "" })
}

// Track when tabs change
browser.tabs.onActivated.addListener(tabInfo => store.dispatch(changeTab(tabInfo.tabId)))
browser.tabs.onUpdated.addListener(tabId => store.dispatch(changeTab(tabId)))
browser.tabs.onRemoved.addListener(tabId => store.dispatch(forgetFeeds(tabId)))

// Set up browser action badge styling
browser.browserAction.setBadgeTextColor({ color: '#FFFFFF' }).then(
  () => browser.browserAction.setBadgeBackgroundColor({ color: '#617CBA' })
).catch((error) => {
  console.warn('Could not style badge', error)
})

// Update badge based on page state.
onPopupStateChange(store, popupState => {
  if (popupState.isUnread && popupState.viewMode !== 'sidebar') {
    browser.browserAction.setBadgeText({ text: '★' }).catch((error) => {
      console.warn('Could not update badge', error)
    })
  } else if (popupState.canSubscribe) {
    browser.browserAction.setBadgeText({ text: '✚' }).catch((error) => {
      console.warn('Could not update badge', error)
    })
  } else {
    browser.browserAction.setBadgeText({ text: '' }).catch((error) => {
      console.warn('Could not update badge', error)
    })
  }
})

// Schedule fetching feeds every 15m
setInterval(() => {
  if (navigator.onLine) {
    store.dispatch(fetchAll())
  }
}, 15 * MINUTE)
