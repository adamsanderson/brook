import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'

import {Store} from 'react-chrome-redux'

import App from './App'
import ModalRoot from "../modals";

const store = new Store({
  portName: 'Brook'
})

const mountNode = document.body

const unsubscribe = store.subscribe(() => {
  // Wait until the first update, then unsubscribe,
  // and handle the rest of the message lifecyle normally.
  // https://github.com/tshaddix/react-chrome-redux/wiki/Advanced-Usage#initializing-ui-components
  unsubscribe()

  ReactDOM.render(
    <Provider store={store}>
      <div style={{height: "100%"}}>
        <App/>
        <ModalRoot/>
      </div>
    </Provider>,
    mountNode
  )
})