import { Store, UnknownAction } from "redux"
import browser from "webextension-polyfill"
import type { RootState, WebExtAction } from './types'

const DISPATCH_TYPE = "BROOK_DISPATCH_CHANNEL" as const

type DispatchMessage = {
  type: typeof DISPATCH_TYPE
  action: UnknownAction
}

/**
 * Connects a redux store the extension's messaging channel to listen for
 * action dispatches.
 *
 * This allows content scripts which may not need the entire redux state
 * to send messages to the backend.
 *
 * @param store – Redux store to be connected
 */
export function connectStore(store: Store<RootState>) {
  browser.runtime.onMessage.addListener((message, sender, _sendResponse): true => {
    if (isDispatchMessage(message) && message.action) {
      const actionWithSender: UnknownAction & WebExtAction = {
        ...message.action,
        _sender: sender as WebExtAction['_sender'],
      }
      store.dispatch(actionWithSender)
    }
    // Return true to appease the type definition for the callback.
    return true
  })

  return store
}

/**
 * Type guard to check if a message is a dispatch message
 */
function isDispatchMessage(message: unknown): message is DispatchMessage {
  return (
    typeof message === 'object' &&
    message !== null &&
    'type' in message &&
    'action' in message &&
    (message as Record<string, unknown>).type === DISPATCH_TYPE
  )
}

/**
 * Dispatches an action via the extension's messaging channel
 *
 * @param action - Redux action to dispatch
 */
export function dispatch(action: UnknownAction): Promise<unknown> {
  return browser.runtime.sendMessage({
    type: DISPATCH_TYPE,
    action
  })
}