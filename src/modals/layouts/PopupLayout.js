import React, {Component, PropTypes} from 'react'

class PopupLayout extends Component {

  static propTypes = {
    position: PropTypes.object,
    onClose: PropTypes.func.isRequired,
  }

  render() {    
    const { position, children, onClose } = this.props
    
    return (
      <div className="Modal" onClick={ onClose }>
        <div className="Menu" style={ position }>
          { children }
        </div>
      </div>
    )
  }

}

export default PopupLayout