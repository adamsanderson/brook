import React from 'react'
import { createRoot } from 'react-dom/client'

import App from './App'
import { createProxyStore } from '../redux/store'
import { initErrorHandler } from '../util/errorHandler'
import ProxyStoreProvider from '../containers/ProxyStoreProvider'

initErrorHandler()

const store = createProxyStore()

const root = createRoot(document.body)
root.render(
  <ProxyStoreProvider store={store}>
    <div>
      <App/>
    </div>
  </ProxyStoreProvider>
)