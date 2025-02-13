import * as React from "react"
import Exception from "@scenes/common/Exception"
import withRouter from "@components/Layout/Router/withRouter"

class ErrorBoundaryWithRouter extends React.Component<any, any> {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  componentDidMount(): void {
    if (this.props.error) {
      this.setState({
        hasError: true,
        error: this.props.error,
        errorInfo: this.props.error,
      })
    }
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      hasError: true,
      error: error,
      errorInfo: errorInfo,
    })
  }

  render() {
    if (this.state.hasError) {
      return <Exception fromErrorBoundary={true} />
    }
    // Render children if there's no error
    return this.props.children
  }
}

export const ErrorBoundary = withRouter(ErrorBoundaryWithRouter)
