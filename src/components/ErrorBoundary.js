import React from 'react'
import PropTypes from 'prop-types'

const DEFAULT_ERROR_MESSAGE = "An error has occurred"

export default class ErrorBoundary extends React.Component {

  static propTypes = {
    message: PropTypes.string,
    className: PropTypes.string,
    children: PropTypes.node,
  }

  static defaultProps = {
    message: DEFAULT_ERROR_MESSAGE,
    className: "",
  }

  constructor(props) {
      super(props)
      this.state = { error: null }
  }

  componentDidCatch(error, info) {
    console.warn("Error Boundary Invoked")
    this.setState({ hasError: true })
  }

  render() {
      if (this.state.hasError) {
          return (
            <div className={`ErrorState hasError ${this.props.className}`}>
              {this.props.message}
            </div>
          )
      } else {
          //when there's not an error, render children untouched
          return this.props.children
      }
  }
}