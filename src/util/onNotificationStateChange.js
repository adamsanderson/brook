import discovery from "../redux/modules/discovery"
import feeds from "../redux/modules/feeds"
import activeTab from "../redux/modules/activeTab"

export function onNotificationStateChange(store, callback) {
    let lastState = {}

    function getNotificationState(store) {
        const state = store.getState()
        const availableFeeds = discovery.selectors.availableFeeds(state, activeTab.selectors.getActiveTabId(state))
        const allFeedsByUrl = feeds.selectors.allFeedsByUrl(state)

        const hasFeeds = availableFeeds.length > 0
        const allSubscribed = availableFeeds.every(feed => allFeedsByUrl[feed.url])

        const nextState = {}

        if (hasFeeds && !allSubscribed) {
            nextState.canSubscribe = true
        } else {
            nextState.canSubscribe = false
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