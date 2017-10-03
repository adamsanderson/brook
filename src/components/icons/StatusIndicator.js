import React, {Component, PropTypes} from 'react'

export default ({isUnread}) => {
  const readClass = isUnread ? "isUnread" : "isRead"

  return (
    <svg className={"Icon StatusIndicator " + readClass} xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" aria-labelledby="title">
      <title id="title">Feed Indicator</title>
      <circle cx="16" cy="16" r="8"/>
    </svg>
  )
}