import FeedPanel from '../containers/FeedPanel'
import NodePanel from '../containers/NodePanel'

export default function PopupPaneLayout() {
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
