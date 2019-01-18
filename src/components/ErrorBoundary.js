import React from 'react'
import PropTypes from 'prop-types'
import { reportError } from '../util/errorHandler'

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
    this.setState({ hasError: true })

    reportError(error, info)
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