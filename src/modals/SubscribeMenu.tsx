import React from 'react'
import { connect, ConnectedProps } from 'react-redux'

import { addFeed } from '../redux/modules/feeds'
import type { Feed } from '../redux/types'
import FullPageLayout from './layouts/FullPageLayout'
import SubscribeList from '../components/SubscribeList'

type OwnProps = {
  feeds: Feed[]
  closeModal: () => void
}

const connector = connect(null, {
  addFeed,
})

class SubscribeMenu extends React.Component<OwnProps & ConnectedProps<typeof connector>> {

  render() {
    return (
      <FullPageLayout>
        <p>
          Subscribe to:
        </p>
        <SubscribeList feeds={this.props.feeds} onSubscribe={this.handleSubscription} />
      </FullPageLayout>
    )
  }

  handleSubscription = (feed: Feed) => {
    this.props.closeModal()
    this.props.addFeed(feed, { fetch: true })
  }
}

export default connector(SubscribeMenu)
