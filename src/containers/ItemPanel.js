import React from 'react'
import PropTypes from 'prop-types'

import FeedDetail from '../components/FeedDetail'
import FeedDetailToolbar from '../containers/FeedDetailToolbar'
import ErrorBoundary from '../components/ErrorBoundary'

ItemPanel.propTypes = {
  feed: PropTypes.object,
  showBackButton: PropTypes.bool,
  showNextFeed: PropTypes.bool,
}

export default function ItemPanel({feed, showBackButton}){
  return (
    <ErrorBoundary message="An error ocurred while displaying this feed.">  
      <div className="Panel">
        <FeedDetailToolbar feed={feed} showBackButton={showBackButton} />
        <div className="Panel-body">
          <FeedDetail feed={feed} />
        </div>
      </div>
    </ErrorBoundary>
  )
}