import React, {Component, PropTypes} from 'react'

export default ({isUnread, hasError}) => {
  const readClass = isUnread ? "isUnread" : "isRead"
  const errorClass = hasError ? "hasError" : ""
  const title = hasError ? "Error" : isUnread ? "Unread" : "Read"

  return (
    <svg 
      className={`Icon StatusIndicator ${readClass} ${errorClass}`}
      xmlns="http://www.w3.org/2000/svg" 
      width="32" height="32" 
      viewBox="0 0 32 32" 
      aria-labelledby="title"
    >
      <title id="title">{title}</title>
      <circle cx="16" cy="16" r="8"/>
    </svg>
  )
}