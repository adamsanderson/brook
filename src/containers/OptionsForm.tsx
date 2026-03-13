import React from 'react'
import browser from 'webextension-polyfill'
import { connect, ConnectedProps } from 'react-redux'

import options, { setViewMode } from '../redux/modules/options'
import { OptionsImage } from '../components/images'
import type { RootState } from '../redux/types'

const VIEW_MODE_HINTS = {
  sidebar: 'Clicking the Brook toolbar icon will show your feeds in the sidebar.',
  popup: 'Feeds will appear in a popup when you click the Brook toolbar icon.',
} as const

const mapStateToProps = (state: RootState) => ({
  viewMode: options.selectors.getViewMode(state),
})

const connector = connect(mapStateToProps, {
  setViewMode
})

class OptionsForm extends React.Component<ConnectedProps<typeof connector>> {
  render() {
    const { viewMode } = this.props

    return (
      <>
        <h4>View Options</h4>
        <div className='layout-form-grid Form'>
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
        <OptionsImage className='layout-trailing' />
      </>
    )
  }

  handleViewMode = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const viewMode = event.target.value as 'sidebar' | 'popup'
    this.props.setViewMode(viewMode)

    // Due to the browser extension API, this must be a direct response to user input,
    // and cannot happen in a middleware.
    if (viewMode === 'sidebar') {
      browser.sidebarAction.open().catch((error) => {
        console.warn('Could not open sidebar', error)
      })
    } else {
      browser.sidebarAction.close().catch((error) => {
        console.warn('Could not close sidebar', error)
      })
    }
  }
}

export default connector(OptionsForm)
