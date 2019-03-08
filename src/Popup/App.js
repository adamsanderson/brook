import React from 'react'

import ErrorBoundary from '../components/ErrorBoundary'

import SinglePaneLayout from '../layouts/SinglePaneLayout'

class App extends React.Component {
  render() {
    return (
      <ErrorBoundary message="An error ocurred while running Brook.">
        <SinglePaneLayout/>
      </ErrorBoundary>
    )
  }
}

export default App