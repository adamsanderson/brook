import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'

import App from './App'
import ModalRoot from "../modals"
import ToastRoot from "../toasts"
import linkHandler from "../util/linkHandler"
import createAutoCloseHandler from '../util/autoCloseHandler'
import { createProxyStore } from '../redux/store'
import { initErrorHandler } from '../util/errorHandler'
import { openPopup, closePopup } from '../redux/modules/popup'

initErrorHandler()

const store = createProxyStore()
const autoCloseHandler = createAutoCloseHandler(store)

const mountNode = document.body

const unsubscribe = store.subscribe(() => {
  // Wait until the first update, then unsubscribe,
  // and handle the rest of the message lifecyle normally.
  // https://github.com/tshaddix/webext-redux/wiki/Advanced-Usage#initializing-ui-components
  unsubscribe()

  // Track popup visibility
  store.dispatch(openPopup())
  window.addEventListener("unload", (ev) => store.dispatch(closePopup()), { once: true, passive: true})

  ReactDOM.render(
    <Provider store={store}>
      <div className="Root-popup" onClick={linkHandler} onMouseLeave={autoCloseHandler}>
        <App/>
        <ToastRoot/>
        <ModalRoot/>
      </div>
    </Provider>,
    mountNode
  )
})