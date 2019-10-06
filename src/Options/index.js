import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'

import App from './App'
import ModalRoot from "../modals"
import ToastRoot from "../toasts"
import { createProxyStore } from '../redux/store'
import { initErrorHandler } from '../util/errorHandler'

initErrorHandler()

const store = createProxyStore()

const mountNode = document.body

const unsubscribe = store.subscribe(() => {
  // Wait until the first update, then unsubscribe,
  // and handle the rest of the message lifecyle normally.
  // https://github.com/tshaddix/webext-redux/wiki/Advanced-Usage#initializing-ui-components
  unsubscribe()

  ReactDOM.render(
    <Provider store={store}>
      <div>
        <App/>
        <ToastRoot/>
        <ModalRoot/>
      </div>
    </Provider>,
    mountNode
  )
})