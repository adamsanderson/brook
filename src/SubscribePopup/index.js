import React from 'react'
import ReactDOM from 'react-dom'

import App from './App'
import linkHandler from "../util/linkHandler"
import { initErrorHandler } from '../util/errorHandler'
import ProxyStoreProvider from '../containers/ProxyStoreProvider'
import { createProxyStore } from '../redux/store'

initErrorHandler()

const store = createProxyStore()

ReactDOM.render( 
  <ProxyStoreProvider store={store}>
    <div className="Root" onClick={linkHandler}>
      <App/>
    </div>
  </ProxyStoreProvider>,
  document.body
)