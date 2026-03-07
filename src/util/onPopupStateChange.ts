import type { Store } from 'redux'

import discovery from '../redux/modules/discovery'
import activeTab from '../redux/modules/activeTab'
import popup from '../redux/modules/popup'
import options from '../redux/modules/options'
import type { RootState } from '../redux/types'

export type NotificationState = {
  canSubscribe: boolean
  isUnread: boolean
  viewMode: 'sidebar' | 'fullwidth'
}

export function onPopupStateChange(
  store: Store<RootState>,
  callback: (state: NotificationState) => void
): void {
  let lastState: NotificationState = {
    canSubscribe: false,
    isUnread: false,
    viewMode: 'sidebar',
  }

  store.subscribe(() => {
    const state = store.getState()
    const nextState = getNotificationState(state)
    if (
      nextState.canSubscribe !== lastState.canSubscribe ||
      nextState.isUnread !== lastState.isUnread ||
      nextState.viewMode !== lastState.viewMode
    ) {
      lastState = nextState
      callback(nextState)
    }
  })
}

export function getNotificationState(state: RootState): NotificationState {
  const tabId = activeTab.selectors.getActiveTabId(state)
  const unsubscribedFeeds = tabId
    ? discovery.selectors.unsubscribedFeeds(state, tabId)
    : []

  return {
    canSubscribe: unsubscribedFeeds.length > 0,
    isUnread: popup.selectors.isUnread(state),
    viewMode: options.selectors.getViewMode(state),
  }
}
