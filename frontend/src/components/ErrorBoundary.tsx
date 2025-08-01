import type React from 'react';
import { Component, type ErrorInfo, type PropsWithChildren } from 'react';
import { Button } from '@/components/ui/button';

interface ErrorBoundaryProps {
  fallback?: React.ReactNode;
  onReset?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

/**
 * エラー境界コンポーネント
 * Reactコンポーネントツリー内でJavaScriptエラーをキャッチし、
 * エラーが発生した場合にフォールバックUIを表示する
 */
export class ErrorBoundary extends Component<
  PropsWithChildren<ErrorBoundaryProps>,
  ErrorBoundaryState
> {
  constructor(props: PropsWithChildren<ErrorBoundaryProps>) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // エラー発生時の状態を更新
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // エラーログを出力
    console.error('Error caught by boundary:', error, errorInfo);
    // ここで外部のエラー報告サービスにエラーを送信することも可能
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  override render() {
    if (this.state.hasError) {
      // カスタムフォールバックがあればそれを使用
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // デフォルトのエラー表示
      return (
        <ErrorFallback error={this.state.error} onReset={this.handleReset} />
      );
    }

    return this.props.children;
  }
}

interface ErrorFallbackProps {
  error?: Error;
  onReset?: () => void;
}

/**
 * デフォルトのエラー表示コンポーネント
 */
export function ErrorFallback({ error, onReset }: ErrorFallbackProps) {
  return (
    <div className="p-6 rounded-lg bg-destructive/10 border border-destructive/30 flex flex-col items-center justify-center min-h-[200px] text-center">
      <h2 className="text-xl font-semibold text-destructive mb-2">
        エラーが発生しました
      </h2>
      {error && (
        <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
          {error.message ||
            'アプリケーションで予期しないエラーが発生しました。'}
        </p>
      )}
      {onReset && (
        <Button onClick={onReset} variant="outline" className="mt-2">
          再試行
        </Button>
      )}
    </div>
  );
}
