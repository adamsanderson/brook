import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { clearSelection, selectFeed } from '../redux/modules/ui'

import ReturnIcon from 'react-feather/dist/icons/corner-left-up'
import NextIcon from 'react-feather/dist/icons/arrow-right'
import views from '../redux/modules/views'

class FeedDetailToolbar extends React.PureComponent {

  static propTypes = {
    feed: PropTypes.object.isRequired,
    nextFeed: PropTypes.object,
    clearSelection: PropTypes.func.isRequired,
    selectFeed: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)
    
    this.handleReturn = this.handleReturn.bind(this)
    this.handleNextFeed = this.handleNextFeed.bind(this)
  }

  render() {
    return (
      <div className="Panel-footer layout-spread">
        {
          this.props.nextFeed ?
            this.renderWithNextFeed() :
            this.renderWithoutNextFeed()
        }
      </div>
    )
  }
  
  renderWithNextFeed() {
    return (
      <React.Fragment>
        <span className="isActionable" onClick={this.handleReturn}>
          <ReturnIcon className="Icon" />
        </span>
        <span className="isActionable" onClick={this.handleNextFeed}>
          {this.props.nextFeed.title}
          <NextIcon className="Icon"/>
        </span>
        
      </React.Fragment>
    )
  }

  renderWithoutNextFeed() {
    return (
      <React.Fragment>
        <span className="isActionable" onClick={this.handleReturn}>
          <ReturnIcon className="Icon" onClick={this.handleReturn} />
          See all feeds
        </span>
      </React.Fragment>
    )
  }

  handleReturn() {
    this.props.clearSelection()
  }

  handleNextFeed() {
    this.props.selectFeed(this.props.nextFeed)
  }
}

const mapStateToProps = (state, props) => ({
  nextFeed: views.selectors.nextFeed(state, props.feed)
})

export default connect(mapStateToProps, {
  clearSelection,
  selectFeed
})(FeedDetailToolbar)