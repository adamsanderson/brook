import React, {Component, PropTypes} from 'react'

export default ({isExpanded}) => {
  const expansionClass = isExpanded ? "isExpanded" : "isCollapsed"

  return (
    <svg className={"Icon Folder " + expansionClass} xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" aria-labelledby="title">
      <title id="title">Folder</title>
      <path d="M 6,6 L 20,16 L 6,26"/>
    </svg>
  )
}