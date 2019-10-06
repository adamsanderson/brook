import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import options, { setViewMode } from '../redux/modules/options'

class OptionsForm extends React.Component {

  static propTypes = {
    viewMode: PropTypes.string.isRequired,
    setViewMode: PropTypes.func.isRequired,
  }

  render() {
    const { viewMode } = this.props

    return (
      <React.Fragment>
        <h4>View Options</h4>
        <div className='layout-column-aligned'>
          <label htmlFor='brook-view-option'>View feeds in</label>
          <div>
            <select id='brook-view-option' onChange={this.handleViewMode}>
              <option value='sidebar' selected={viewMode === 'sidebar'}>Sidebar</option>
              <option value='popup' selected={viewMode === 'popup'}>Popup</option>
            </select>
          </div>
        </div>
      </React.Fragment>
    )
  }

  handleViewMode = (event) => {
    const viewMode = event.target.value
    this.props.setViewMode(viewMode)

    // Due to the browser extension API, this must be a direct response to user input,
    // and cannot happen in a middleware.
    if (viewMode === 'sidebar') {
      browser.sidebarAction.open()
    } else {
      browser.sidebarAction.close()
    }
  }
}

const mapStateToProps = (state) => ({
  viewMode: options.selectors.getViewMode(state),
})

export default connect(mapStateToProps, {
  setViewMode
})(OptionsForm)