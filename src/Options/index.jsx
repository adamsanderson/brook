import React from 'react'
import { createRoot } from 'react-dom/client'

import App from './App'
import { initErrorHandler } from '../util/errorHandler'
import { Provider } from "react-redux"
import { createProxyStore } from "../redux/store"

initErrorHandler()

const store = createProxyStore()

store.ready().then(() => {
  const root = createRoot(document.body)
  root.render(
    <Provider store={store}>
      <div>
        <App />
      </div>
    </Provider>
  )
})