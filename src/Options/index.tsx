import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'

import App from './App'
import { initErrorHandler } from '../util/errorHandler'
import { createProxyStore } from '../redux/store'

initErrorHandler()

const store = createProxyStore()

store.ready().then(() => {
  const rootEl = document.querySelector('#root')
  if (!rootEl) {
    throw new Error("Root element not found")
  }
  const root = createRoot(rootEl)
  root.render(
    <Provider store={store}>
      <App />
    </Provider>
  )
}).catch(err => {
  console.error("Error initializing Brook/Options", err)
})
