import React from 'react'
import throttle from 'lodash/throttle'

export default function withLayout(WrappedComponent, layoutSelector) {
  return class extends React.Component {
    static displayName = `withLayout(${WrappedComponent.displayName})`

    constructor(props) {
      super(props)
      
      this.state = this.evaluateDimensions()
    }

    componentDidMount() {
      window.addEventListener('resize', this.handleResize)
    }

    componentWillUnmount() {
      window.removeEventListener('resize', this.handleResize)
    }

    handleResize = throttle(
      (_event) => {
        this.setState(this.evaluateDimensions())
      }, 
      100 // Throttle period
    )

    evaluateDimensions() {
      const width = window.innerWidth
      const height = window.innerHeight
      const layout = layoutSelector({width, height})
      
      return {layout}
    }

    render() {
      return <WrappedComponent {...this.state} {...this.props} />
    }
  }
}