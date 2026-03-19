import React from 'react'
import { connect, ConnectedProps } from 'react-redux'

import FeedTree from '../containers/FeedTree'
import FeedTreeToolbar from '../containers/FeedTreeToolbar'
import ErrorBoundary from '../components/ErrorBoundary'

import ui from '../redux/modules/ui'
import type { RootState } from '../redux/types'

const mapStateToProps = (state: RootState) => ({
  nodes: ui.selectors.currentNodeList(state),
})

const connector = connect(mapStateToProps)

class FeedPanel extends React.Component<ConnectedProps<typeof connector>> {
  private scrollingElement: HTMLDivElement | null = null

  componentDidMount() {
    if (this.scrollingElement) {
      const selectedEl = this.scrollingElement.querySelector('.isSelected')
      if (selectedEl instanceof HTMLElement) {
        selectedEl.scrollIntoView(true)
      }
    }
  }

  setScrollingElement = (el: HTMLDivElement | null) => {
    this.scrollingElement = el
  }

  render() {
    const { nodes } = this.props

    return (
      <ErrorBoundary message="An error ocurred while displaying your feeds.">
        <div className="Panel">
          <FeedTreeToolbar />
          <div className="Panel-body" ref={this.setScrollingElement}>
            <FeedTree nodes={nodes} />
          </div>
        </div>
      </ErrorBoundary>
    )
  }
}

export default connector(FeedPanel)
