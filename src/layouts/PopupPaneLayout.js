import React from 'react'

import FeedPanel from '../containers/FeedPanel'
import NodePanel from '../containers/NodePanel'

export default class PopupPaneLayout extends React.PureComponent {
  render() {
    return (
      <div className="layout-vertical">
        <div className="layout-flex-3">
          <FeedPanel />
        </div>
        <div className="layout-flex-2">
          <NodePanel />
        </div>
      </div>
    )
  }
}