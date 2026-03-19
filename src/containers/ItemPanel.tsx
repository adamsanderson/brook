import { connect, ConnectedProps } from 'react-redux'

import { useAlternateFeed } from '../redux/modules/feeds'
import { selectItem } from '../redux/modules/ui'
import views from '../redux/modules/views'
import FeedDetail from '../components/FeedDetail'
import FeedDetailToolbar from '../containers/FeedDetailToolbar'
import ErrorBoundary from '../components/ErrorBoundary'
import type { Feed, RootState } from '../redux/types'

import type { ItemNode } from '../components/ItemList'

type OwnProps = {
  feed: Feed
}

const mapStateToProps = (state: RootState, props: OwnProps) => ({
  itemNodes: (props.feed.items || []).map(item => ({
    item,
    isUnread: views.selectors.isItemUnread(state, item)
  })) as ItemNode[]
})

const connector = connect(mapStateToProps, {
  useAlternateFeed,
  onClickItem: selectItem
})

function ItemPanel({ feed, itemNodes, useAlternateFeed, onClickItem }: OwnProps & ConnectedProps<typeof connector>) {
  return (
    <ErrorBoundary message="An error ocurred while displaying this feed.">
      <div className="Panel">
        <FeedDetailToolbar feed={feed} itemNodes={itemNodes} />
        <div className="Panel-body">
          <FeedDetail feed={feed} itemNodes={itemNodes} onUseAlternate={useAlternateFeed} onClickItem={onClickItem} />
        </div>
      </div>
    </ErrorBoundary>
  )
}

export default connector(ItemPanel)
