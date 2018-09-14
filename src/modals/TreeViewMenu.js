import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import ui, { changeView, VIEWS } from '../redux/modules/ui'
import PopupLayout from "./layouts/PopupLayout"

class TreeViewMenu extends React.Component {
  
  static propTypes = {
    position: PropTypes.object.isRequired, 
    closeModal: PropTypes.func.isRequired, 
    changeView: PropTypes.func.isRequired,
    currentViewId: PropTypes.string.isRequired,
  }

  render() {    
    const { position, closeModal, changeView, currentViewId } = this.props
    
    return (
      <PopupLayout position={position} onClose={closeModal}>
        {Object.keys(VIEWS).map(viewId => (
          <TreeViewMenuItem 
            key={ viewId }
            viewId={ viewId } 
            changeView={ changeView } 
            isSelected={ currentViewId === viewId }
          />
        ))}
      </PopupLayout>
    )
  }
}

class TreeViewMenuItem extends React.Component {
  static propTypes = {
    changeView: PropTypes.func.isRequired,
    viewId: PropTypes.string.isRequired,
    isSelected: PropTypes.bool,
  }

  render() {
    const { viewId, isSelected } = this.props
    const view = VIEWS[viewId]

    return (
      <div>
        <a
          className={ isSelected ? "isSelected" : ""} 
          onClick={ this.handleClick }
        > 
          { isSelected !== undefined && 
            <span className="MenuItemRadioButton" />
          }
          { view.longName } 
        </a>
      </div>
    )
  }

  handleClick = (event) => {
    this.props.changeView(this.props.viewId)
  }
}

const mapStateToProps = (state, props) => ({
  currentViewId: ui.selectors.currentViewId(state)
})

export default connect(mapStateToProps, {
  changeView,
})(TreeViewMenu)