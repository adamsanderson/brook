import views from "../redux/modules/views"

const TWO_SECONDS = 2000

/**
 * Hold your nose folks.  This will auto close the popup window if an item has recently been viewed
 * and the user mouses out of the popup window to engage with the story.
 *
 * This is written to directly access the store since it is used near the very top of the app hierarchy,
 * but only get called rarely.
 *
 * @param {*} store - Application's redux store
 * @param {*} timeout in ms
 */
export default function createAutoCloseHandler(store, timeout=TWO_SECONDS) {
    return function autoCloseHandler() {
        const state = store.getState()
        const duration = Date.now() - views.selectors.itemLastViewedAt(state)

        if (duration <= timeout) {
            window.close()
        }
    }
}