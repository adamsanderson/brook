import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'

import App from './App'
import ModalRoot from "../modals"
import ToastRoot from "../toasts"
import linkHandler from "../util/linkHandler"
import { createProxyStore } from '../redux/store'

const store = createProxyStore()

const mountNode = document.body

const unsubscribe = store.subscribe(() => {
  // Wait until the first update, then unsubscribe,
  // and handle the rest of the message lifecyle normally.
  // https://github.com/tshaddix/react-chrome-redux/wiki/Advanced-Usage#initializing-ui-components
  unsubscribe()

  window.addEventListener("click", linkHandler)
  
  ReactDOM.render(
    <Provider store={store}>
      <div style={{height: "100%"}}>
        <App/>
        <ToastRoot/>
        <ModalRoot/>
      </div>
    </Provider>,
    mountNode
  )
})