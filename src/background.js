import store from './redux/store'
import { wrapStore } from 'react-chrome-redux'

import { changeTab } from "./redux/modules/activeTab"
import { fetchAll } from "./redux/modules/feeds"
import { forgetFeeds } from "./redux/modules/discovery"

const MINUTE = 60 * 1000

wrapStore(store, {portName: 'Brook'})

// Track when tabs change
browser.tabs.onActivated.addListener(tabInfo => store.dispatch(changeTab(tabInfo.tabId)))
browser.tabs.onUpdated.addListener(tabId => store.dispatch(changeTab(tabId)))
browser.tabs.onRemoved.addListener(tabId => store.dispatch(forgetFeeds(tabId)))

// Schedule fetching feeds every 15m
setInterval(() => {
  if (navigator.onLine) {
    store.dispatch(fetchAll())
  }
}, 15 * MINUTE)