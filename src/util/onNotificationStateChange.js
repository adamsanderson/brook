import discovery from "../redux/modules/discovery"
import activeTab from "../redux/modules/activeTab"

export function onNotificationStateChange(store, callback) {
    let lastState = {}

    function getNotificationState(store) {
        const state = store.getState()
        const tabId = activeTab.selectors.getActiveTabId(state)
        const unsubscribedFeeds = discovery.selectors.unsubscribedFeeds(state, tabId)

        const nextState = {
            canSubscribe: unsubscribedFeeds.length > 0
        }

        return nextState
    }

    store.subscribe((event) => {
        const nextState = getNotificationState(store)
        if (nextState.canSubscribe !== lastState.canSubscribe) {
            lastState = nextState
            callback(nextState)
        }
    })
}