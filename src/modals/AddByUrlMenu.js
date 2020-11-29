import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { addFeed } from '../redux/modules/feeds'
import FullPageLayout from './layouts/FullPageLayout'

class AddByUrlMenu extends React.Component {
  static propTypes = {
    closeModal: PropTypes.func.isRequired,
    addFeed: PropTypes.func.isRequired,
  }

  state = {
    url: ""
  }

  render() {
    const url = this.state.url

    return (
      <FullPageLayout {...this.props}>
        <p>
          Manually add a feed:
        </p>
        <div className='layout-horizontal layout-gap'>
          <input className="layout-flex-1" type='url' placeholder='http://example.com/feed' value={url} onChange={this.handleUrlChange} />
          <button className="Button isActive" onClick={this.handleAdd} disabled={url.length < 3}>
            Add
          </button>
        </div>
      </FullPageLayout>
    )
  }

  handleUrlChange = (event) => {
    this.setState({ url: event.target.value })
  }

  handleAdd = (event) => {
    this.props.closeModal()
    this.props.addFeed({url: this.state.url}, { fetch: true })
  }
}

const mapStateToProps = (state, props) => ({
  // state...
})

export default connect(mapStateToProps, {
  addFeed,
})(AddByUrlMenu)