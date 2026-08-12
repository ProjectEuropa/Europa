import robots from '@/app/robots';
import { describe, it, expect } from 'vitest';

describe('Robots', () => {
  it('should return valid robots configuration', () => {
    const result = robots();

    expect(result).toHaveProperty('rules');
    expect(result).toHaveProperty('sitemap');
    expect(result.sitemap).toBe('https://project-europa.work/sitemap.xml');

    const rules = Array.isArray(result.rules) ? result.rules[0] : result.rules;
    expect(rules.userAgent).toBe('*');
    expect(rules.allow).toBe('/');
  });
});
