import React from 'react'
import isEqual from 'react-fast-compare'

import StatusIndicator from '../components/icons/StatusIndicator'
import feeds from '../redux/modules/feeds'
import FeedEditor from './FeedEditor'
import type { Feed as FeedType } from '../redux/types'

type Props = {
  feed: FeedType
  isUnread?: boolean
  onClick?: (feed: FeedType) => void
  onRename?: (feed: FeedType, title: string) => void
  style?: React.CSSProperties
  className?: string
}

type FeedElementProps = {
  title: string
  className?: string
  href?: string
  children: React.ReactNode
}

class Feed extends React.Component<Props> {
  // Feeds are evaluated and rendered any time that the user interacts
  // with the feed tree. Unfortunately not all props can be easily compared
  // since the drag and drop wrapper's `allowDrop` is regenerated on each render.
  //
  // To work around this for now, we implement a custom `shouldComponentUpdate`.
  shouldComponentUpdate(nextProps: Props) {
    if (this.props === nextProps) return false

    return (this.props.className !== nextProps.className) ||
      (this.props.style !== nextProps.style) ||
      (this.props.onClick !== nextProps.onClick) ||
      (this.props.isUnread !== nextProps.isUnread) ||
      (!isEqual(this.props.feed, nextProps.feed))
  }

  render() {
    const { feed, style, onRename } = this.props
    const isUnread = this.props.isUnread ?? false
    const className = this.props.className ?? ""
    const readClass = isUnread ? "isUnread" : "isRead"
    const error = feed.error

    return (
      <div
        className={`Feed ${readClass} ${className}`}
        style={style}
        onClick={this.handleClick}
      >
        <StatusIndicator isUnread={isUnread} hasError={!!error} isLoading={feed.isLoading} />
        {
          feed.isEditing
            ? <FeedEditor feed={feed} onRename={onRename} />
            : error ? this.renderError(feed) : this.renderFeed(feed)
        }
      </div>
    )
  }

  renderError(feed: FeedType) {
    const title = feeds.selectors.getFeedTitle(feed)
    return this.renderFeedElement({ title: feed.error || title, className: "hasError", href: feed.url, children: title })
  }

  renderFeed(feed: FeedType) {
    const title = feeds.selectors.getFeedTitle(feed)
    return this.renderFeedElement({
      title,
      href: feed.url,
      children: title
    })
  }

  // renderFeedElement allows us to switch the element easily based on whether there's an onClick handler.
  renderFeedElement(attrs: FeedElementProps) {
    if (this.props.onClick) {
      return <a title={attrs.title} className={attrs.className} href={attrs.href} onClick={noopLinkHandler}>{attrs.children}</a>
    }

    return <span title={attrs.title} className={attrs.className}>{attrs.children}</span>
  }

  handleClick = () => {
    this.props.onClick?.(this.props.feed)
  }
}

function noopLinkHandler(event: React.MouseEvent<HTMLAnchorElement>) {
  event.preventDefault()
}

export default Feed
