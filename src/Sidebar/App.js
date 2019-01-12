import React from 'react'
import PropTypes from 'prop-types'

import ErrorBoundary from '../components/ErrorBoundary'
import withLayout from '../layouts/withLayout'
import DualPaneLayout from '../layouts/DualPaneLayout'
import SinglePaneLayout from '../layouts/SinglePaneLayout'

const SINGLE_PANE = "SINGLE_PANE"
const DUAL_PANE = "DUAL_PANE"

class App extends React.Component {

  static propTypes = {
   layout: PropTypes.string.isRequired
  }

  render() {
    const {layout} = this.props
    
    return (
      <ErrorBoundary message="An error ocurred while running Brook.">
        {
          layout === DUAL_PANE ?
            <DualPaneLayout/> :
            <SinglePaneLayout/>
        }
      </ErrorBoundary>
    )
  }
}

export default withLayout(App, ({width, height}) => {
  if (height <= 360) {
    return SINGLE_PANE
  } else {
    return DUAL_PANE
  }
})