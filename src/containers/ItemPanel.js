import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { useAlternateFeed } from '../redux/modules/feeds'
import FeedDetail from '../components/FeedDetail'
import FeedDetailToolbar from '../containers/FeedDetailToolbar'
import ErrorBoundary from '../components/ErrorBoundary'

ItemPanel.propTypes = {
  feed: PropTypes.object,
  useAlternateFeed: PropTypes.func.isRequired,
}

function ItemPanel({feed, useAlternateFeed}){
  return (
    <ErrorBoundary message="An error ocurred while displaying this feed.">  
      <div className="Panel">
        <FeedDetailToolbar feed={feed} />
        <div className="Panel-body">
          <FeedDetail feed={feed} onUseAlternate={useAlternateFeed} />
        </div>
      </div>
    </ErrorBoundary>
  )
}

const mapStateToProps = (state, props) => ({
  //
})

export default connect(mapStateToProps, {
  useAlternateFeed,
})(ItemPanel)