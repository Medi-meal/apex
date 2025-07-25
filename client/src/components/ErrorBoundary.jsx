import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    // Optionally log error info
  }
  render() {
    if (this.state.hasError) {
      return <h2 style={{ color: '#0a2342', textAlign: 'center', marginTop: '3rem' }}>Something went wrong. Please refresh the page.</h2>;
    }
    return this.props.children;
  }
} 