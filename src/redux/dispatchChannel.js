const DISPATCH_TYPE = "BROOK_DISPATCH_CHANNEL"

/**
 * Connects a redux store the extension's messaging channel to listen for
 * action dispatches.
 * 
 * This allows content scripts which may not need the entire redux state
 * to send messages to the backend.
 * 
 * @param {Store} store – Redux store to be connected
 */
export function connectStore(store) {
  browser.runtime.onMessage.addListener((message, sender, _sendResponse) => {
    if (message.type === DISPATCH_TYPE && message.action) {
      store.dispatch({
        ...message.action,
        _sender: sender,
      })
    }
  })

  return store
}

/**
 * Dispatches an action via the extension's messaging channel
 * 
 * @param {object} action 
 */
export function dispatch(action) {
  browser.runtime.sendMessage({
    type: DISPATCH_TYPE,
    action
  })
}