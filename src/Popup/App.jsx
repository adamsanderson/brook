import React from 'react'

import ErrorBoundary from '../components/ErrorBoundary'
import PopupPaneLayout from '../layouts/PopupPaneLayout'

class App extends React.Component {
  render() {
    return (
      <ErrorBoundary message="An error occurred while running Brook.">
        <PopupPaneLayout/>
      </ErrorBoundary>
    )
  }
}

export default App