import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { FileDropZone } from '@/components/upload/FileDropZone';

const mockOnFileSelect = vi.fn();

const defaultProps = {
  onFileSelect: mockOnFileSelect,
  accept: '.che',
  maxSize: 25 * 1024, // 25KB
};

describe('FileDropZone', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render drop zone correctly', () => {
    render(<FileDropZone {...defaultProps} />);

    expect(screen.getByText('ファイルをドラッグ&ドロップ')).toBeInTheDocument();
    expect(
      screen.getByText('またはクリックしてファイルを選択')
    ).toBeInTheDocument();
    expect(screen.getByText('対応形式: .che')).toBeInTheDocument();
    expect(screen.getByText('最大サイズ: 25KB')).toBeInTheDocument();
  });
});
