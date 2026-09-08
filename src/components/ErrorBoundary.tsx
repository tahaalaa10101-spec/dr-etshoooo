"use client";

import React from "react";

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="flex min-h-[400px] items-center justify-center rounded-lg border border-border bg-surface p-8">
          <div className="text-center">
            <h2 className="mb-2 text-xl font-bold text-white">Something went wrong</h2>
            <p className="mb-4 text-gray-400">An unexpected error occurred. Please try again.</p>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="rounded-lg bg-accent px-6 py-2 text-sm font-medium text-surface hover:bg-accent/80"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
