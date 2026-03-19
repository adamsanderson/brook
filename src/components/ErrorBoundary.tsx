import React, { type ErrorInfo, type ReactNode } from 'react'

import { reportError } from '../util/errorHandler'

const DEFAULT_ERROR_MESSAGE = "An error has occurred"

type Props = {
  message?: string
  className?: string
  children?: ReactNode
}

type State = {
  hasError: boolean
}

export default class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false }

  componentDidUpdate() {
    if (this.state.hasError) {
      this.setState({ hasError: false })
    }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    this.setState({ hasError: true })
    reportError(error, info as unknown as Record<string, unknown>)
  }

  render() {
    const message = this.props.message ?? DEFAULT_ERROR_MESSAGE
    const className = this.props.className ?? ""

    if (this.state.hasError) {
      return (
        <div className={`ErrorState hasError ${className}`}>
          {message}
        </div>
      )
    }

    return this.props.children
  }
}
