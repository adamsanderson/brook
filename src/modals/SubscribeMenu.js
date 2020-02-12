import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { addFeed } from '../redux/modules/feeds'
import FullPageLayout from './layouts/FullPageLayout'
import SubscribeList from '../components/SubscribeList'

class SubscribeMenu extends React.Component {
  static propTypes = {
    feeds: PropTypes.array.isRequired,
    closeModal: PropTypes.func.isRequired,
    addFeed: PropTypes.func.isRequired,
  }

  render() {
    return (
      <FullPageLayout {...this.props}>
        <p>
          Subscribe to:
        </p>
        <SubscribeList feeds={this.props.feeds} onSubscribe={this.handleSubscription} />
      </FullPageLayout>
    )
  }

  handleSubscription = (feed) => {
    this.props.closeModal()
    this.props.addFeed(feed, {fetch: true})
  }
}

const mapStateToProps = (state, props) => ({
  // state...
})

export default connect(mapStateToProps, {
  addFeed,
})(SubscribeMenu)