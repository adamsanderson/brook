import React, {Component, PropTypes} from 'react'

export default ({className, children, ...props}) => {
  return (
    <label className={`Button ${className || ""}`}>
      { children }
      <input type="file" className="layout-visually-hidden" {...props} />
    </label>
  )
}