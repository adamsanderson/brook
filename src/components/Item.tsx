import React from 'react'

import StatusIndicator from '../components/icons/StatusIndicator'
import type { FeedItem } from '../redux/types'

export type DisplayItem = FeedItem & {
  error?: string
  data?: unknown
}

type Props = {
  item: DisplayItem
  isUnread?: boolean
  onClick?: (item: DisplayItem) => void
  style?: React.CSSProperties
  className?: string
}

class Item extends React.PureComponent<Props> {
  render() {
    const { item, style } = this.props
    const isUnread = this.props.isUnread ?? false
    const className = this.props.className ?? ""
    const readClass = isUnread ? "isUnread" : "isRead"
    const error = item.error

    return (
      <div className={`Item ${readClass} ${className}`} style={style}>
        <StatusIndicator isUnread={isUnread} hasError={!!error} />
        {error ? this.renderError() : this.renderLink(item)}
      </div>
    )
  }

  renderLink(item: DisplayItem) {
    return (
      <a href={item.url} onClick={ this.handleClick } title={item.title}>
        {item.title}
      </a>
    )
  }

  renderError() {
    return (
      <span className="hasError" onClick={ this.handleClick }> Parse Error</span>
    )
  }

  handleClick = (event: React.MouseEvent<HTMLElement>) => {
    const item = this.props.item

    if (item.error) {
      console.error("Brook Item Error:", item.error)
      console.error(item.data)
    } else {
      this.props.onClick?.(item)
    }

    event.preventDefault()
  }
}

export default Item
