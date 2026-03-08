import React from 'react'
import { connect, ConnectedProps } from 'react-redux'

import ui, { changeView, VIEWS } from '../redux/modules/ui'
import type { RootState } from '../redux/types'
import PopupLayout from "./layouts/PopupLayout"

type OwnProps = {
  position: React.CSSProperties
  closeModal: React.MouseEventHandler<HTMLDivElement>
}

const mapStateToProps = (state: RootState) => ({
  currentViewId: ui.selectors.currentViewId(state)
})

const connector = connect(mapStateToProps, {
  changeView,
})

class TreeViewMenu extends React.Component<OwnProps & ConnectedProps<typeof connector>> {

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

type TreeViewMenuItemProps = {
  changeView: (view: string) => void
  viewId: string
  isSelected?: boolean
}

class TreeViewMenuItem extends React.Component<TreeViewMenuItemProps> {

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

  handleClick = (_event: React.MouseEvent<HTMLAnchorElement>) => {
    this.props.changeView(this.props.viewId)
  }
}

export default connector(TreeViewMenu)
