import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'

import App from './App'
import { initErrorHandler } from '../util/errorHandler'
import { createProxyStore } from '../redux/store'

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
}).catch(err => {
  console.error("Error initializing Brook/Options", err)
})
