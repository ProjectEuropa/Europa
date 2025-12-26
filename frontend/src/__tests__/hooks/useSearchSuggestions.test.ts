import { describe, expect, it } from 'vitest';
import { highlightMatch } from '@/hooks/useSearchSuggestions';

describe('useSearchSuggestions', () => {
  describe('highlightMatch', () => {
    it('should return full text as non-match when query is empty', () => {
      const result = highlightMatch('test tag', '');

      expect(result).toEqual([{ text: 'test tag', isMatch: false }]);
    });

    it('should return full text as non-match when query is whitespace', () => {
      const result = highlightMatch('test tag', '   ');

      expect(result).toEqual([{ text: 'test tag', isMatch: false }]);
    });

    it('should highlight matching substring at the start', () => {
      const result = highlightMatch('テスト', 'テス');

      expect(result).toEqual([
        { text: 'テス', isMatch: true },
        { text: 'ト', isMatch: false },
      ]);
    });

    it('should highlight matching substring in the middle', () => {
      const result = highlightMatch('abcdef', 'cd');

      expect(result).toEqual([
        { text: 'ab', isMatch: false },
        { text: 'cd', isMatch: true },
        { text: 'ef', isMatch: false },
      ]);
    });

    it('should highlight matching substring at the end', () => {
      const result = highlightMatch('hello world', 'world');

      expect(result).toEqual([
        { text: 'hello ', isMatch: false },
        { text: 'world', isMatch: true },
      ]);
    });

    it('should be case insensitive', () => {
      const result = highlightMatch('HelloWorld', 'low');

      expect(result).toEqual([
        { text: 'Hel', isMatch: false },
        { text: 'loW', isMatch: true },
        { text: 'orld', isMatch: false },
      ]);
    });

    it('should highlight entire text when it matches completely', () => {
      const result = highlightMatch('ACE', 'ace');

      expect(result).toEqual([
        { text: 'ACE', isMatch: true },
      ]);
    });

    it('should return full text as non-match when no match found', () => {
      const result = highlightMatch('hello', 'xyz');

      expect(result).toEqual([{ text: 'hello', isMatch: false }]);
    });

    it('should handle Japanese characters', () => {
      const result = highlightMatch('二脚タイプ', '脚タ');

      expect(result).toEqual([
        { text: '二', isMatch: false },
        { text: '脚タ', isMatch: true },
        { text: 'イプ', isMatch: false },
      ]);
    });

    it('should handle special characters', () => {
      const result = highlightMatch('test-tag_v2', '-tag');

      expect(result).toEqual([
        { text: 'test', isMatch: false },
        { text: '-tag', isMatch: true },
        { text: '_v2', isMatch: false },
      ]);
    });
  });
});
