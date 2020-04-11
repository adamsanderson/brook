import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { useAlternateFeed } from '../redux/modules/feeds'
import { selectItem } from '../redux/modules/ui'
import views from '../redux/modules/views'
import FeedDetail from '../components/FeedDetail'
import FeedDetailToolbar from '../containers/FeedDetailToolbar'
import ErrorBoundary from '../components/ErrorBoundary'

ItemPanel.propTypes = {
  feed: PropTypes.object,
  itemNodes: PropTypes.array.isRequired, 
  useAlternateFeed: PropTypes.func.isRequired,
  onClickItem: PropTypes.func.isRequired,
}

function ItemPanel({feed, itemNodes, useAlternateFeed, onClickItem}){
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

const mapStateToProps = (state, props) => ({
  itemNodes: (props.feed.items || []).map(item => ({
    item,
    isUnread: views.selectors.isItemUnread(state, item)
  }))
})

export default connect(mapStateToProps, {
  useAlternateFeed,
  onClickItem: selectItem
})(ItemPanel)