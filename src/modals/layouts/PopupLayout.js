import React from 'react'
import PropTypes from 'prop-types'

class PopupLayout extends React.Component {

  static propTypes = {
    position: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
  }

  render() {    
    const { position, children, onClose } = this.props
    
    return (
      <div className="Modal PopupLayout" onClickCapture={ onClose }>
        <div className="Menu" style={ position }>
          { children }
        </div>
      </div>
    )
  }

}

export default PopupLayout