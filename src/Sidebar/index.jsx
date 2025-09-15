import React from 'react'
import { createRoot } from 'react-dom/client'

import App from './App'
import ModalRoot from "../modals"
import ToastRoot from "../toasts"
import linkHandler from "../util/linkHandler"
import { initErrorHandler } from '../util/errorHandler'
import ProxyStoreProvider from '../containers/ProxyStoreProvider'
import { createProxyStore } from '../redux/store'

initErrorHandler()

const store = createProxyStore()

const root = createRoot(document.body)
root.render(
  <ProxyStoreProvider store={store}>
    <div className="Root" onClick={linkHandler}>
      <App/>
      <ToastRoot/>
      <ModalRoot/>
    </div>
  </ProxyStoreProvider>
)