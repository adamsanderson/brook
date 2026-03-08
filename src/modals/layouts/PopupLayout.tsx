import React from 'react'

type Props = {
  position: React.CSSProperties
  onClose: React.MouseEventHandler<HTMLDivElement>
  children: React.ReactNode
}

class PopupLayout extends React.Component<Props> {
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
