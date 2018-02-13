import store from './redux/store'
import { wrapStore } from 'react-chrome-redux'

import { changeTab } from "./redux/modules/activeTab"
import { fetchAll } from "./redux/modules/feeds"

wrapStore(store, {portName: 'Brook'})

// Track when tabs change
browser.tabs.onActivated.addListener(tabInfo => store.dispatch(changeTab(tabInfo.tabId)))
browser.tabs.onUpdated.addListener(tabId => store.dispatch(changeTab(tabId)))

// Schedule fetching feeds every 15m
setInterval(() => {
  store.dispatch(fetchAll())
}, 15 * 60 * 1000)