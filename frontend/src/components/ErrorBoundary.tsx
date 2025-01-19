import { Component, ReactNode, ErrorInfo } from "react";

export default class ErrorBoundary extends Component<
  {
    fallback: ReactNode;
    onReset: () => void;
    children?: ReactNode;
  },
  { hasError: boolean }
> {
  constructor(props: { fallback: ReactNode; onReset: () => void }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
  }

  resetError = () => {
    this.setState({ hasError: false });
    this.props.onReset();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div>
          {this.props.fallback}
          <button onClick={this.resetError}>Retry</button>
        </div>
      );
    }
    return this.props.children;
  }
}
