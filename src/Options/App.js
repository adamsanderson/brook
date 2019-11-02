import React from 'react'

import ErrorBoundary from '../components/ErrorBoundary'
import OptionsForm from '../containers/OptionsForm'

export default class App extends React.Component {
  render() {
    return (
      <ErrorBoundary message="An error ocurred.">
        <OptionsForm/>
      </ErrorBoundary>
    )
  }
}