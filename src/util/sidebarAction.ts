import { Dispatch } from 'redux'
import browser from 'webextension-polyfill'

import { getNotificationState } from './onPopupStateChange'
import discovery from '../redux/modules/discovery'
import { openModal } from '../redux/modules/modal'
import { MODALS } from '../modals'
import type { RootState } from '../redux/types'

export function openSubscribeMenuIfNeeded(state: RootState, dispatch: Dispatch, tabId: number): void {
  const notificationState = getNotificationState(state)
  if (notificationState.canSubscribe) {
    const feeds = discovery.selectors.unsubscribedFeeds(state, tabId)
    dispatch(openModal(MODALS.SubscribeMenu, { feeds }))
  }
}

export async function openSidebar(windowId?: number): Promise<void> {
  // Be careful, browsers are very strict about what counts as a user action.  
  // Even checking in firefox to see if the sidebar is open will cause this to fail.
  if (__BROWSER__ === 'chrome') {
    const wid = windowId ?? (await chrome.windows.getLastFocused({ windowTypes: ['normal'] })).id!
    await chrome.sidePanel.open({ windowId: wid })
  } else {
    await browser.sidebarAction.open()
  }
}
