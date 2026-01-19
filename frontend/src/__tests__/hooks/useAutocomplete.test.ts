import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useAutocomplete, type UseAutocompleteOptions } from '@/hooks/useAutocomplete';
import type { SearchSuggestion } from '@/hooks/useSearchSuggestions';

const createMockSuggestions = (count: number): SearchSuggestion[] => {
  return Array.from({ length: count }, (_, i) => ({
    value: `suggestion-${i}`,
    type: 'tag' as const,
    score: count - i,
  }));
};

const createKeyboardEvent = (key: string): React.KeyboardEvent<HTMLInputElement> => ({
  key,
  preventDefault: vi.fn(),
} as unknown as React.KeyboardEvent<HTMLInputElement>);

describe('useAutocomplete', () => {
  const defaultOptions: UseAutocompleteOptions = {
    suggestions: createMockSuggestions(5),
    enabled: true,
    isComposing: false,
    onExecuteSearch: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('初期状態', () => {
    it('should initialize with default values', () => {
      const { result } = renderHook(() => useAutocomplete(defaultOptions));

      expect(result.current.isFocused).toBe(false);
      expect(result.current.selectedIndex).toBe(-1);
      expect(result.current.showAutocomplete).toBe(false);
    });

    it('should have refs initialized', () => {
      const { result } = renderHook(() => useAutocomplete(defaultOptions));

      expect(result.current.formRef).toBeDefined();
      expect(result.current.inputRef).toBeDefined();
    });
  });

  describe('showAutocomplete', () => {
    it('should show autocomplete when focused, enabled, not composing, and has suggestions', () => {
      const { result } = renderHook(() => useAutocomplete(defaultOptions));

      act(() => {
        result.current.handleFocus();
      });

      expect(result.current.showAutocomplete).toBe(true);
    });

    it('should not show autocomplete when disabled', () => {
      const { result } = renderHook(() =>
        useAutocomplete({ ...defaultOptions, enabled: false })
      );

      act(() => {
        result.current.handleFocus();
      });

      expect(result.current.showAutocomplete).toBe(false);
    });

    it('should not show autocomplete when composing', () => {
      const { result } = renderHook(() =>
        useAutocomplete({ ...defaultOptions, isComposing: true })
      );

      act(() => {
        result.current.handleFocus();
      });

      expect(result.current.showAutocomplete).toBe(false);
    });

    it('should not show autocomplete when no suggestions', () => {
      const { result } = renderHook(() =>
        useAutocomplete({ ...defaultOptions, suggestions: [] })
      );

      act(() => {
        result.current.handleFocus();
      });

      expect(result.current.showAutocomplete).toBe(false);
    });

    it('should not show autocomplete when not focused', () => {
      const { result } = renderHook(() => useAutocomplete(defaultOptions));

      expect(result.current.showAutocomplete).toBe(false);
    });
  });

  describe('handleFocus', () => {
    it('should set isFocused to true', () => {
      const { result } = renderHook(() => useAutocomplete(defaultOptions));

      expect(result.current.isFocused).toBe(false);

      act(() => {
        result.current.handleFocus();
      });

      expect(result.current.isFocused).toBe(true);
    });
  });

  describe('closeFocus', () => {
    it('should close focus and reset selected index', () => {
      const { result } = renderHook(() => useAutocomplete(defaultOptions));

      act(() => {
        result.current.handleFocus();
      });

      expect(result.current.isFocused).toBe(true);

      act(() => {
        result.current.closeFocus();
      });

      expect(result.current.isFocused).toBe(false);
      expect(result.current.selectedIndex).toBe(-1);
    });
  });

  describe('resetSelectedIndex', () => {
    it('should reset selected index to -1', () => {
      const { result } = renderHook(() => useAutocomplete(defaultOptions));

      act(() => {
        result.current.handleFocus();
        result.current.handleSuggestionHover(2);
      });

      expect(result.current.selectedIndex).toBe(2);

      act(() => {
        result.current.resetSelectedIndex();
      });

      expect(result.current.selectedIndex).toBe(-1);
    });
  });

  describe('キーボードナビゲーション', () => {
    it('should handle ArrowDown key - move to next item', () => {
      const { result } = renderHook(() => useAutocomplete(defaultOptions));

      act(() => {
        result.current.handleFocus();
      });

      const event = createKeyboardEvent('ArrowDown');

      act(() => {
        result.current.handleKeyDown(event);
      });

      expect(result.current.selectedIndex).toBe(0);
      expect(event.preventDefault).toHaveBeenCalled();
    });

    it('should handle ArrowDown key - wrap to first item when at end', () => {
      const { result } = renderHook(() => useAutocomplete(defaultOptions));

      act(() => {
        result.current.handleFocus();
        result.current.handleSuggestionHover(4); // Last item (0-indexed, 5 items)
      });

      const event = createKeyboardEvent('ArrowDown');

      act(() => {
        result.current.handleKeyDown(event);
      });

      expect(result.current.selectedIndex).toBe(0);
    });

    it('should handle ArrowUp key - move to previous item', () => {
      const { result } = renderHook(() => useAutocomplete(defaultOptions));

      act(() => {
        result.current.handleFocus();
        result.current.handleSuggestionHover(2);
      });

      const event = createKeyboardEvent('ArrowUp');

      act(() => {
        result.current.handleKeyDown(event);
      });

      expect(result.current.selectedIndex).toBe(1);
      expect(event.preventDefault).toHaveBeenCalled();
    });

    it('should handle ArrowUp key - wrap to last item when at start', () => {
      const { result } = renderHook(() => useAutocomplete(defaultOptions));

      act(() => {
        result.current.handleFocus();
        result.current.handleSuggestionHover(0);
      });

      const event = createKeyboardEvent('ArrowUp');

      act(() => {
        result.current.handleKeyDown(event);
      });

      expect(result.current.selectedIndex).toBe(4); // Last item
    });

    it('should handle Enter key - execute search with selected item', () => {
      const onExecuteSearch = vi.fn();
      const { result } = renderHook(() =>
        useAutocomplete({ ...defaultOptions, onExecuteSearch })
      );

      act(() => {
        result.current.handleFocus();
        result.current.handleSuggestionHover(2);
      });

      const event = createKeyboardEvent('Enter');

      act(() => {
        result.current.handleKeyDown(event);
      });

      expect(onExecuteSearch).toHaveBeenCalledWith('suggestion-2');
      expect(event.preventDefault).toHaveBeenCalled();
      expect(result.current.isFocused).toBe(false);
      expect(result.current.selectedIndex).toBe(-1);
    });

    it('should not execute search on Enter when no item selected', () => {
      const onExecuteSearch = vi.fn();
      const { result } = renderHook(() =>
        useAutocomplete({ ...defaultOptions, onExecuteSearch })
      );

      act(() => {
        result.current.handleFocus();
      });

      const event = createKeyboardEvent('Enter');

      act(() => {
        result.current.handleKeyDown(event);
      });

      expect(onExecuteSearch).not.toHaveBeenCalled();
    });

    it('should handle Escape key - close autocomplete and blur input', () => {
      const { result } = renderHook(() => useAutocomplete(defaultOptions));

      // Mock blur function
      const blurMock = vi.fn();
      Object.defineProperty(result.current.inputRef, 'current', {
        value: { blur: blurMock },
        writable: true,
      });

      act(() => {
        result.current.handleFocus();
        result.current.handleSuggestionHover(1);
      });

      const event = createKeyboardEvent('Escape');

      act(() => {
        result.current.handleKeyDown(event);
      });

      expect(result.current.isFocused).toBe(false);
      expect(result.current.selectedIndex).toBe(-1);
      expect(event.preventDefault).toHaveBeenCalled();
      expect(blurMock).toHaveBeenCalled();
    });

    it('should handle Tab key - close autocomplete', () => {
      const { result } = renderHook(() => useAutocomplete(defaultOptions));

      act(() => {
        result.current.handleFocus();
        result.current.handleSuggestionHover(1);
      });

      const event = createKeyboardEvent('Tab');

      act(() => {
        result.current.handleKeyDown(event);
      });

      expect(result.current.isFocused).toBe(false);
      expect(result.current.selectedIndex).toBe(-1);
    });

    it('should not handle keyboard events when autocomplete is hidden', () => {
      const { result } = renderHook(() =>
        useAutocomplete({ ...defaultOptions, enabled: false })
      );

      act(() => {
        result.current.handleFocus();
      });

      const event = createKeyboardEvent('ArrowDown');

      act(() => {
        result.current.handleKeyDown(event);
      });

      expect(result.current.selectedIndex).toBe(-1);
      expect(event.preventDefault).not.toHaveBeenCalled();
    });
  });

  describe('handleSuggestionSelect', () => {
    it('should execute search and close autocomplete', () => {
      const onExecuteSearch = vi.fn();
      const { result } = renderHook(() =>
        useAutocomplete({ ...defaultOptions, onExecuteSearch })
      );

      act(() => {
        result.current.handleFocus();
      });

      act(() => {
        result.current.handleSuggestionSelect('selected-value');
      });

      expect(onExecuteSearch).toHaveBeenCalledWith('selected-value');
      expect(result.current.isFocused).toBe(false);
      expect(result.current.selectedIndex).toBe(-1);
    });
  });

  describe('handleSuggestionHover', () => {
    it('should update selected index on hover', () => {
      const { result } = renderHook(() => useAutocomplete(defaultOptions));

      act(() => {
        result.current.handleSuggestionHover(3);
      });

      expect(result.current.selectedIndex).toBe(3);
    });
  });

  describe('外側クリック', () => {
    it('should close autocomplete on outside click', () => {
      const { result } = renderHook(() => useAutocomplete(defaultOptions));

      // Mock formRef.current.contains to return false (click outside)
      const mockFormElement = {
        contains: vi.fn().mockReturnValue(false),
      };
      Object.defineProperty(result.current.formRef, 'current', {
        value: mockFormElement,
        writable: true,
      });

      act(() => {
        result.current.handleFocus();
        result.current.handleSuggestionHover(2);
      });

      expect(result.current.isFocused).toBe(true);
      expect(result.current.selectedIndex).toBe(2);

      // Simulate outside click
      act(() => {
        const mouseEvent = new MouseEvent('mousedown', { bubbles: true });
        document.dispatchEvent(mouseEvent);
      });

      expect(result.current.isFocused).toBe(false);
      expect(result.current.selectedIndex).toBe(-1);
    });

    it('should not close autocomplete on inside click', () => {
      const { result } = renderHook(() => useAutocomplete(defaultOptions));

      // Create a mock element for the click target
      const mockClickTarget = document.createElement('div');

      // Mock formRef.current.contains to return true (click inside)
      const mockFormElement = {
        contains: vi.fn().mockReturnValue(true),
      };
      Object.defineProperty(result.current.formRef, 'current', {
        value: mockFormElement,
        writable: true,
      });

      act(() => {
        result.current.handleFocus();
      });

      expect(result.current.isFocused).toBe(true);

      // Simulate inside click
      act(() => {
        const mouseEvent = new MouseEvent('mousedown', { bubbles: true });
        Object.defineProperty(mouseEvent, 'target', { value: mockClickTarget });
        document.dispatchEvent(mouseEvent);
      });

      expect(result.current.isFocused).toBe(true);
    });
  });

  describe('クリーンアップ', () => {
    it('should remove event listener on unmount', () => {
      const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');

      const { unmount } = renderHook(() => useAutocomplete(defaultOptions));

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        'mousedown',
        expect.any(Function)
      );

      removeEventListenerSpy.mockRestore();
    });
  });
});
