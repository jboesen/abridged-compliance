import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({ error, errorInfo });
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  private handleReset = (): void => {
    // Clear the error state and retry
    this.setState({ hasError: false, error: null, errorInfo: null });
    
    // Reload the page if needed
    if (this.state.error?.message?.includes('connection')) {
      window.location.reload();
    }
  };

  public render(): ReactNode {
    if (this.state.hasError) {
      // If a custom fallback is provided, use it
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
          <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <AlertCircle className="h-8 w-8 text-red-500" />
              <h2 className="text-xl font-semibold">Something went wrong</h2>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-700 mb-2">
                {this.state.error?.message?.includes('connection')
                  ? "We couldn't establish a connection. This might be due to network issues or the server being unavailable."
                  : "We encountered an unexpected error."}
              </p>
              <p className="text-sm text-gray-500">
                Please try refreshing the page or come back later.
              </p>
            </div>

            <Button 
              onClick={this.handleReset}
              className="w-full flex items-center justify-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Retry
            </Button>
          </div>
        </div>
      );
    }

    // If there's no error, render children normally
    return this.props.children;
  }
}

export default ErrorBoundary;
