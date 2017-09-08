import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'

import {Store} from 'react-chrome-redux'

import App from './App'

const store = new Store({
  portName: 'Brook'
})

const mountNode = document.createElement('div')
document.body.appendChild(mountNode)

ReactDOM.render(
  <Provider store={store}>
      <App/>
  </Provider>,
  mountNode
)