import React from 'react'
import { connect, ConnectedProps } from 'react-redux'

import { addFeed } from '../redux/modules/feeds'
import type { FeedInput } from '../redux/types'
import FullPageLayout from './layouts/FullPageLayout'

type OwnProps = {
  closeModal: () => void
}

type State = {
  url: string
}

const connector = connect(null, {
  addFeed,
})

class AddByUrlMenu extends React.Component<OwnProps & ConnectedProps<typeof connector>, State> {
  state: State = {
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

  handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ url: event.target.value })
  }

  handleAdd = (_event: React.MouseEvent<HTMLButtonElement>) => {
    this.props.closeModal()
    const feed: FeedInput = { url: this.state.url }
    this.props.addFeed(feed, { fetch: true })
  }
}

export default connector(AddByUrlMenu)
