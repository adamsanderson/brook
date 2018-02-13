import React from 'react'
import PropTypes from 'prop-types'

FileButton.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
}
export default function FileButton({className, children, ...props}) {
  return (
    <label className={`Button ${className || ""}`}>
      { children }
      <input type="file" className="layout-visually-hidden" {...props} />
    </label>
  )
}