import { render, screen } from '@testing-library/react';
import { UploadProgress } from '@/components/upload/UploadProgress';

describe('UploadProgress', () => {
  it('should not render when status is idle', () => {
    const { container } = render(<UploadProgress progress={0} status="idle" />);

    expect(container.firstChild).toBeNull();
  });

  it('should render uploading state correctly', () => {
    render(
      <UploadProgress
        progress={50}
        status="uploading"
        fileName="test.che"
        fileSize={1024}
      />
    );

    expect(screen.getByText('test.che')).toBeInTheDocument();
    expect(screen.getByText('1.00 KB')).toBeInTheDocument();
    expect(screen.getByText('50%')).toBeInTheDocument();
    expect(screen.getByText('進行中')).toBeInTheDocument();
    expect(screen.getByText('アップロード中... 50%')).toBeInTheDocument();
  });

  it('should render success state correctly', () => {
    render(
      <UploadProgress
        progress={100}
        status="success"
        fileName="test.che"
        fileSize={1024}
      />
    );

    expect(screen.getByText('test.che')).toBeInTheDocument();
    expect(screen.getByText('アップロード完了')).toBeInTheDocument();
    expect(
      screen.getByText('ファイルが正常にアップロードされました。')
    ).toBeInTheDocument();
  });

  it('should render error state correctly', () => {
    render(
      <UploadProgress
        progress={0}
        status="error"
        fileName="test.che"
        fileSize={1024}
        error="アップロードに失敗しました"
      />
    );

    expect(screen.getByText('test.che')).toBeInTheDocument();
    expect(screen.getByText('アップロード失敗')).toBeInTheDocument();
    expect(screen.getByText('アップロードに失敗しました')).toBeInTheDocument();
  });

  it('should render without file information', () => {
    render(<UploadProgress progress={75} status="uploading" />);

    expect(screen.getByText('アップロード中... 75%')).toBeInTheDocument();
    expect(screen.queryByText(/KB/)).not.toBeInTheDocument();
  });

  it('should apply custom className', () => {
    const { container } = render(
      <UploadProgress
        progress={50}
        status="uploading"
        className="custom-class"
      />
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('should show progress bar only during uploading', () => {
    const { rerender } = render(
      <UploadProgress progress={50} status="uploading" />
    );

    expect(screen.getByRole('progressbar')).toBeInTheDocument();

    rerender(<UploadProgress progress={100} status="success" />);
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();

    rerender(<UploadProgress progress={0} status="error" />);
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
  });

  it('should format file size correctly', () => {
    render(
      <UploadProgress
        progress={50}
        status="uploading"
        fileName="test.che"
        fileSize={2048}
      />
    );

    expect(screen.getByText('2.00 KB')).toBeInTheDocument();
  });

  it('should handle zero progress', () => {
    render(<UploadProgress progress={0} status="uploading" />);

    expect(screen.getByText('0%')).toBeInTheDocument();
    expect(screen.getByText('アップロード中... 0%')).toBeInTheDocument();
  });

  it('should handle 100% progress', () => {
    render(<UploadProgress progress={100} status="uploading" />);

    expect(screen.getByText('100%')).toBeInTheDocument();
    expect(screen.getByText('アップロード中... 100%')).toBeInTheDocument();
  });
});
