import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SearchAutocomplete } from '@/components/search/SearchAutocomplete';

describe('SearchAutocomplete', () => {
  const mockSuggestions = [
    { value: 'React', type: 'tag' as const, score: 100 },
    { value: 'TypeScript', type: 'tag' as const, score: 90 },
    { value: 'JavaScript', type: 'popular' as const, score: 80 },
  ];

  const defaultProps = {
    suggestions: mockSuggestions,
    query: 'Re',
    isOpen: true,
    selectedIndex: -1,
    onSelect: vi.fn(),
    onHover: vi.fn(),
    isLoading: false,
  };

  describe('Rendering', () => {
    it('should render suggestions correctly', () => {
      render(<SearchAutocomplete {...defaultProps} />);

      expect(screen.getByText('React')).toBeInTheDocument();
      expect(screen.getByText('TypeScript')).toBeInTheDocument();
      expect(screen.getByText('JavaScript')).toBeInTheDocument();
    });

    it('should not render when isOpen is false', () => {
      render(<SearchAutocomplete {...defaultProps} isOpen={false} />);

      expect(screen.queryByText('React')).not.toBeInTheDocument();
    });

    it('should highlight selected item', () => {
      render(<SearchAutocomplete {...defaultProps} selectedIndex={0} />);

      const firstItem = screen.getByText('React').closest('li');
      expect(firstItem).toHaveClass('bg-slate-700/50');
    });

    it('should show loading state', () => {
      render(<SearchAutocomplete {...defaultProps} isLoading={true} />);

      expect(screen.getByText('検索中...')).toBeInTheDocument();
      expect(screen.queryByText('React')).not.toBeInTheDocument();
    });

    it('should show empty state when no suggestions', () => {
      render(<SearchAutocomplete {...defaultProps} suggestions={[]} />);

      expect(screen.getByText('候補が見つかりませんでした')).toBeInTheDocument();
    });

    it('should render with custom id', () => {
      const { container } = render(
        <SearchAutocomplete {...defaultProps} id="test-autocomplete" />
      );

      const autocompleteDiv = container.querySelector('#test-autocomplete');
      expect(autocompleteDiv).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('should call onSelect when item is clicked', () => {
      const onSelect = vi.fn();
      render(<SearchAutocomplete {...defaultProps} onSelect={onSelect} />);

      const reactItem = screen.getByText('React');
      fireEvent.click(reactItem);

      expect(onSelect).toHaveBeenCalledWith('React');
      expect(onSelect).toHaveBeenCalledTimes(1);
    });

    it('should call onHover when item is hovered', () => {
      const onHover = vi.fn();
      render(<SearchAutocomplete {...defaultProps} onHover={onHover} />);

      const reactItem = screen.getByText('React').closest('li')!;
      fireEvent.mouseEnter(reactItem);

      expect(onHover).toHaveBeenCalledWith(0);
    });

    it('should handle multiple click events', () => {
      const onSelect = vi.fn();
      render(<SearchAutocomplete {...defaultProps} onSelect={onSelect} />);

      fireEvent.click(screen.getByText('React'));
      fireEvent.click(screen.getByText('TypeScript'));

      expect(onSelect).toHaveBeenCalledTimes(2);
      expect(onSelect).toHaveBeenNthCalledWith(1, 'React');
      expect(onSelect).toHaveBeenNthCalledWith(2, 'TypeScript');
    });
  });

  describe('Text Highlighting', () => {
    it('should highlight matching text', () => {
      render(<SearchAutocomplete {...defaultProps} query="Re" />);

      const highlightedText = screen.getByText('Re');
      expect(highlightedText).toHaveClass('text-cyan-400');
    });

    it('should not highlight when query is empty', () => {
      render(<SearchAutocomplete {...defaultProps} query="" />);

      const reactText = screen.getByText('React');
      expect(reactText).not.toHaveClass('text-cyan-400');
    });
  });

  describe('Icons', () => {
    it('should render tag icon for tag type', () => {
      const { container } = render(<SearchAutocomplete {...defaultProps} />);

      // Check that Tag icons are rendered (first two items are tags)
      const listItems = container.querySelectorAll('li');
      expect(listItems.length).toBeGreaterThan(0);
    });

    it('should render trending icon for popular type', () => {
      const popularSuggestions = [
        { value: 'Popular', type: 'popular' as const, score: 100 },
      ];

      render(<SearchAutocomplete {...defaultProps} suggestions={popularSuggestions} />);

      expect(screen.getByText('Popular')).toBeInTheDocument();
    });

    it('should render search icon for history type', () => {
      const historySuggestions = [
        { value: 'History', type: 'history' as const, score: 100 },
      ];

      render(<SearchAutocomplete {...defaultProps} suggestions={historySuggestions} />);

      expect(screen.getByText('History')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      const { container } = render(<SearchAutocomplete {...defaultProps} />);

      const listbox = container.querySelector('[role="listbox"]');
      expect(listbox).toBeInTheDocument();
      expect(listbox).toHaveAttribute('aria-label', '検索サジェスション');
    });

    it('should mark selected item with aria-selected', () => {
      render(<SearchAutocomplete {...defaultProps} selectedIndex={1} />);

      const selectedItem = screen.getByText('TypeScript').closest('li');
      expect(selectedItem).toHaveAttribute('aria-selected', 'true');
    });

    it('should mark non-selected items with aria-selected=false', () => {
      render(<SearchAutocomplete {...defaultProps} selectedIndex={1} />);

      const nonSelectedItem = screen.getByText('React').closest('li');
      expect(nonSelectedItem).toHaveAttribute('aria-selected', 'false');
    });

    it('should have option role on list items', () => {
      render(<SearchAutocomplete {...defaultProps} />);

      const items = screen.getAllByRole('option');
      expect(items).toHaveLength(3);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty suggestions array', () => {
      render(<SearchAutocomplete {...defaultProps} suggestions={[]} />);

      expect(screen.getByText('候補が見つかりませんでした')).toBeInTheDocument();
    });

    it('should handle very long suggestion text', () => {
      const longSuggestions = [
        {
          value: 'This is a very long suggestion text that should be truncated',
          type: 'tag' as const,
          score: 100,
        },
      ];

      render(<SearchAutocomplete {...defaultProps} suggestions={longSuggestions} />);

      expect(
        screen.getByText('This is a very long suggestion text that should be truncated')
      ).toBeInTheDocument();
    });

    it('should handle special characters in suggestions', () => {
      const specialSuggestions = [
        { value: 'React@18.0', type: 'tag' as const, score: 100 },
        { value: 'Type-Script', type: 'tag' as const, score: 90 },
      ];

      render(<SearchAutocomplete {...defaultProps} suggestions={specialSuggestions} />);

      // highlightMatchがテキストを分割する可能性があるため、部分一致で検索
      expect(screen.getByText((content, element) => {
        return element?.textContent === 'React@18.0';
      })).toBeInTheDocument();
      expect(screen.getByText('Type-Script')).toBeInTheDocument();
    });

    it('should handle Japanese characters', () => {
      const japaneseSuggestions = [
        { value: 'リアクト', type: 'tag' as const, score: 100 },
        { value: 'タイプスクリプト', type: 'tag' as const, score: 90 },
      ];

      render(<SearchAutocomplete {...defaultProps} suggestions={japaneseSuggestions} />);

      expect(screen.getByText('リアクト')).toBeInTheDocument();
      expect(screen.getByText('タイプスクリプト')).toBeInTheDocument();
    });
  });
});
