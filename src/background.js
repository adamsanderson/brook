import store from './redux/store'
import { wrapStore } from 'react-chrome-redux'

import { changeTab } from "./redux/modules/activeTab";

wrapStore(store, {portName: 'Brook'})

// Track when tabs change
browser.tabs.onActivated.addListener(tabInfo => store.dispatch(changeTab(tabInfo.tabId)))
browser.tabs.onUpdated.addListener(tabId => store.dispatch(changeTab(tabId)))