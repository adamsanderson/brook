import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import layout, {DUAL_PANE} from '../redux/modules/layout'
import ErrorBoundary from '../components/ErrorBoundary'
import DualPaneLayout from '../layouts/DualPaneLayout'
import SinglePaneLayout from '../layouts/SinglePaneLayout'

class App extends React.Component {

  static propTypes = {
    currentLayout: PropTypes.string.isRequired
  }

  render() {
    const {currentLayout} = this.props

    return (
      <ErrorBoundary message="An error ocurred while running Brook.">
        {
          currentLayout === DUAL_PANE ?
            <DualPaneLayout/> :
            <SinglePaneLayout/>
        }
      </ErrorBoundary>
    )
  }
}

const mapStateToProps = (state) => ({
  currentLayout: layout.selectors.getLayout(state)
})

export default connect(mapStateToProps, {
  // 
})(App)