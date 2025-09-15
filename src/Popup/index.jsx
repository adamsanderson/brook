import React from 'react'
import { createRoot } from 'react-dom/client'

import App from './App'
import ModalRoot from "../modals"
import ToastRoot from "../toasts"
import linkHandler from "../util/linkHandler"
import createAutoCloseHandler from '../util/autoCloseHandler'
import { createProxyStore } from '../redux/store'
import { initErrorHandler } from '../util/errorHandler'
import { openPopup, closePopup } from '../redux/modules/popup'
import ProxyStoreProvider from '../containers/ProxyStoreProvider'

initErrorHandler()

const store = createProxyStore()
const autoCloseHandler = createAutoCloseHandler(store)

// Track popup visibility
store.dispatch(openPopup())
window.addEventListener("unload", (ev) => store.dispatch(closePopup()), { once: true, passive: true})

const root = createRoot(document.body)
root.render(
  <ProxyStoreProvider store={store}>
    <div className="Root" onClick={linkHandler} onMouseLeave={autoCloseHandler}>
      <App/>
      <ToastRoot/>
      <ModalRoot/>
    </div>
  </ProxyStoreProvider>
)