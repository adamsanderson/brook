import React from 'react'
import PropTypes from 'prop-types'

function BundledImage({src, ...rest}) {
  return (
    <img {...rest} src={browser.runtime.getURL('dist/'+src)} />
  )
}

BundledImage.propTypes = {
  src: PropTypes.string,
}

export default BundledImage