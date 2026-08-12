import sitemap from '@/app/sitemap';
import { describe, it, expect } from 'vitest';

describe('Sitemap', () => {
  it('should return valid sitemap array with required routes', () => {
    const result = sitemap();

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(5);

    const urls = result.map(item => item.url);
    expect(urls).toContain('https://project-europa.work');
    expect(urls).toContain('https://project-europa.work/about');
    expect(urls).toContain('https://project-europa.work/search/match');

    result.forEach(item => {
      expect(item.url).toBeDefined();
      expect(item.lastModified).toBeInstanceOf(Date);
    });
  });
});
