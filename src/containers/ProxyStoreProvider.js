import React from 'react'
import PropTypes from 'prop-types'
import { Provider, connect } from 'react-redux'

ProxyStoreProvider.propTypes = {
  children: PropTypes.node.isRequired,
  store: PropTypes.object.isRequired,
}

function ProxyStoreProvider({children, store}) {
  return (
    <Provider store={store}>
      <ReduxLoader>{children}</ReduxLoader>
    </Provider>
  )
}

// The store is not guaranteed to have been synchronized when connected
// components mount.
//
// See: https://github.com/tshaddix/webext-redux/issues/5
const mapStateToProps = (state, _props) => ({
  isInitialized: Object.keys(state).length > 0
})

// Until the proxy store has synchronized, this connected component will
// not render anything.
const ReduxLoader = connect(mapStateToProps)(
  ({children, isInitialized}) => isInitialized ? children : null
)

export default ProxyStoreProvider