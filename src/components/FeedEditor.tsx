import React from 'react'

import feeds from '../redux/modules/feeds'
import type { Feed } from '../redux/types'

type Props = {
  feed: Feed
  onRename?: (feed: Feed, title: string) => void
}

class FeedEditor extends React.PureComponent<Props> {
  private input: HTMLInputElement | null = null

  componentDidMount() {
    this.input?.select()
  }

  render() {
    const title = feeds.selectors.getFeedTitle(this.props.feed)

    return (
      <input
        defaultValue={title}
        ref={el => {
          this.input = el
        }}
        onBlur={this.handleSubmit}
        onKeyUp={this.handleKey}
      />
    )
  }

  handleSubmit = () => {
    const onRename = this.props.onRename
    if (!onRename || !this.input) return

    onRename(this.props.feed, this.input.value)
  }

  handleKey = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      this.handleSubmit()
      return
    }

    if (event.key === 'Escape' && this.input) {
      const title = feeds.selectors.getFeedTitle(this.props.feed)
      this.input.value = title
      this.input.blur()
    }
  }
}

export default FeedEditor
