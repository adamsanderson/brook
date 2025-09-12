import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import options, { setViewMode } from '../redux/modules/options'
import { OptionsImage } from '../components/images'

const VIEW_MODE_HINTS = {
  sidebar: 'Clicking the Brook toolbar icon will show your feeds in the sidebar.',
  popup: 'Feeds will appear in a popup when you click the Brook toolbar icon.',
}

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
        <div className='layout-column-aligned Form'>
          <label htmlFor='brook-view-option'>View feeds in</label>
          <div>
            <div className='Form-control'>
              <select id='brook-view-option' onChange={this.handleViewMode} value={viewMode}>
                <option value='sidebar'>Sidebar</option>
                <option value='popup'>Popup</option>
              </select>
            </div>
            <div className='Form-hint'>
              {VIEW_MODE_HINTS[viewMode]}
            </div>
          </div>
        </div>
        <OptionsImage className='layout-trailing'/>
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