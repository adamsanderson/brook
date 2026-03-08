import FeedPanel from '../containers/FeedPanel'
import NodePanel from '../containers/NodePanel'

export default function DualPaneLayout() {
  return (
    <div className="layout-vertical">
      <div className="layout-flex-2">
        <FeedPanel />
      </div>
      <div className="layout-flex-1">
        <NodePanel />
      </div>
    </div>
  )
}
