import type { Store } from 'redux'

import views from '../redux/modules/views'
import type { RootState } from '../redux/types'

const TWO_SECONDS = 2000

/**
 * Auto close the popup window if an item has recently been viewed and the
 * user mouses out of the popup window to engage with the story.
 */
export default function createAutoCloseHandler(
  store: Store<RootState>,
  timeout = TWO_SECONDS
): () => void {
  return function autoCloseHandler(): void {
    const state = store.getState()
    const duration = Date.now() - views.selectors.itemLastViewedAt(state)

    if (duration <= timeout) {
      window.close()
    }
  }
}
