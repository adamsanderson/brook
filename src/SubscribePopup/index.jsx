import React from 'react'
import { createRoot } from 'react-dom/client'

import App from './App'
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
    </div>
  </ProxyStoreProvider>
)