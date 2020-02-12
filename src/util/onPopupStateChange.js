import discovery from "../redux/modules/discovery"
import activeTab from "../redux/modules/activeTab"
import popup from "../redux/modules/popup"
import options from "../redux/modules/options"

export function onPopupStateChange(store, callback) {
  let lastState = {}

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

export function getNotificationState(state) {
  const tabId = activeTab.selectors.getActiveTabId(state)
  const unsubscribedFeeds = discovery.selectors.unsubscribedFeeds(state, tabId)

  const nextState = {
    canSubscribe: unsubscribedFeeds.length > 0,
    isUnread: popup.selectors.isUnread(state),
    viewMode: options.selectors.getViewMode(state),
  }

  return nextState
}