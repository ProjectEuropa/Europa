import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Component, type ErrorInfo, type PropsWithChildren } from 'react';
import { Button } from '@/components/ui/button';

interface SumDownloadErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

interface SumDownloadErrorBoundaryProps extends PropsWithChildren {
  fallback?: React.ComponentType<{ error?: Error; retry: () => void }>;
}

export class SumDownloadErrorBoundary extends Component<
  SumDownloadErrorBoundaryProps,
  SumDownloadErrorBoundaryState
> {
  constructor(props: SumDownloadErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): SumDownloadErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
    console.error(
      'SumDownload Error Boundary caught an error:',
      error,
      errorInfo
    );
  }

  retry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  override render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return (
          <FallbackComponent error={this.state.error} retry={this.retry} />
        );
      }

      return (
        <div className="flex flex-col items-center justify-center py-12 px-4">
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-8 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="h-6 w-6 text-destructive" />
              <h2 className="text-lg font-semibold text-destructive">
                エラーが発生しました
              </h2>
            </div>

            <p className="text-sm text-muted-foreground mb-4">
              一括ダウンロード機能でエラーが発生しました。ページを再読み込みしてください。
            </p>

            {this.state.error && (
              <details className="mb-4">
                <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">
                  エラーの詳細
                </summary>
                <pre className="text-xs text-muted-foreground mt-2 p-2 bg-muted/50 rounded overflow-auto">
                  {this.state.error.message}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}

            <div className="flex gap-2">
              <Button onClick={this.retry} className="flex-1 gap-2">
                <RefreshCw className="h-4 w-4" />
                再試行
              </Button>
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
                className="flex-1"
              >
                ページを再読み込み
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
