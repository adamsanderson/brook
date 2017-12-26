import React, {Component, PropTypes} from 'react'

class PopupLayout extends Component {

  static propTypes = {
    position: PropTypes.object,
    onClose: PropTypes.func.isRequired,
  }

  render() {    
    const { position, children, onClose, ...rest } = this.props
    
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