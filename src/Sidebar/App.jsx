import React from 'react'

import ErrorBoundary from '../components/ErrorBoundary'
import DualPaneLayout from '../layouts/DualPaneLayout'

export default class App extends React.Component {
  render() {
    return (
      <ErrorBoundary message="An error ocurred while running Brook.">
        <DualPaneLayout/>
      </ErrorBoundary>
    )
  }
}