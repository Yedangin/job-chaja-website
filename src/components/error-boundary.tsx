'use client';

/**
 * 에러 바운더리 컴포넌트 / Error boundary component
 * 페이지/섹션 레벨 에러를 캐치하여 사용자 친화적 UI 표시 (spec 12 §1-1)
 * Catches page/section-level errors and shows user-friendly UI
 */

import { Component, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
  /** 에러 시 표시할 대체 UI / Fallback UI to show on error */
  fallback?: ReactNode;
  /** 에러 제목 / Error title */
  title?: string;
  /** 에러 설명 / Error description */
  description?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center" role="alert">
          <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mb-4">
            <AlertTriangle className="w-7 h-7 text-red-500" />
          </div>
          <h3 className="text-base font-semibold text-gray-700 mb-1">
            {this.props.title || '오류가 발생했습니다'}
          </h3>
          <p className="text-sm text-gray-400 max-w-xs mb-1">
            {this.props.description || 'An unexpected error occurred.'}
          </p>
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <p className="text-xs text-red-400 max-w-md mt-2 font-mono">
              {this.state.error.message}
            </p>
          )}
          <button
            onClick={this.handleRetry}
            className="mt-5 inline-flex items-center gap-2 px-5 py-2 bg-gray-900 text-white text-sm font-semibold rounded-full hover:bg-gray-800 transition"
          >
            <RefreshCw className="w-4 h-4" />
            다시 시도 / Retry
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
