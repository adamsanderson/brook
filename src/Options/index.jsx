import React from 'react'
import ReactDOM from 'react-dom'

import App from './App'
import { createProxyStore } from '../redux/store'
import { initErrorHandler } from '../util/errorHandler'
import ProxyStoreProvider from '../containers/ProxyStoreProvider'

initErrorHandler()

const store = createProxyStore()

ReactDOM.render(
  <ProxyStoreProvider store={store}>
    <div>
      <App/>
    </div>
  </ProxyStoreProvider>,
  document.body
)