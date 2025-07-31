import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import Footer from '@/components/Footer';

// Iconsコンポーネントのモック
vi.mock('@/components/Icons', () => ({
  default: {
    Logo: ({ size }: { size: number }) => (
      <div data-testid="logo-icon" data-size={size}>
        Logo
      </div>
    ),
  },
}));

describe('Footer', () => {
  beforeEach(() => {
    render(<Footer />);
  });

  it('should render footer element', () => {
    const footer = screen.getByRole('contentinfo');
    expect(footer).toBeInTheDocument();
  });

  it('should display EUROPA logo and title', () => {
    const logo = screen.getByTestId('logo-icon');
    const title = screen.getByText('EUROPA');

    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('data-size', '28');
    expect(title).toBeInTheDocument();
  });

  it('should display subtitle', () => {
    const subtitle = screen.getByText('カルネージハート EXA');
    expect(subtitle).toBeInTheDocument();
  });

  it('should display description', () => {
    const description = screen.getByText(
      /OKE共有とチームコラボレーションのための非公式カルネージハートEXAプラットフォーム/
    );
    expect(description).toBeInTheDocument();
  });

  it('should display copyright with current year', () => {
    const currentYear = new Date().getFullYear();
    const copyright = screen.getByText(
      `Team Project Europa 2016-${currentYear}`
    );
    expect(copyright).toBeInTheDocument();
  });

  describe('Navigation Links', () => {
    it('should render feature links', () => {
      const featureLinks = [
        { text: 'チームデータ検索', href: '/search/team' },
        { text: 'マッチデータ検索', href: '/search/match' },
        { text: 'チームデータ一括DL', href: '/sumdownload/team' },
        { text: 'マッチデータ一括DL', href: '/sumdownload/match' },
        { text: 'Information', href: '/info' },
      ];

      featureLinks.forEach(({ text, href }) => {
        const link = screen.getByRole('link', { name: text });
        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute('href', href);
      });
    });

    it('should render account links', () => {
      const accountLinks = [
        { text: 'ログイン', href: '/login' },
        { text: '新規登録', href: '/register' },
      ];

      accountLinks.forEach(({ text, href }) => {
        const link = screen.getByRole('link', { name: text });
        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute('href', href);
      });
    });

    it('should render legal and contact links', () => {
      const legalLinks = [
        { text: '私たちについて', href: '/about' },
        { text: 'プライバシーポリシー', href: '/privacy-policy' },
        { text: '利用規約', href: '/terms-of-service' },
        { text: 'よくある質問', href: '/faq' },
      ];

      legalLinks.forEach(({ text, href }) => {
        const link = screen.getByRole('link', { name: text });
        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute('href', href);
      });
    });

    it('should render external contact link with correct attributes', () => {
      const contactLink = screen.getByRole('link', { name: 'お問い合わせ' });
      expect(contactLink).toBeInTheDocument();
      expect(contactLink).toHaveAttribute(
        'href',
        'https://hp.project-europa.work/contact'
      );
      expect(contactLink).toHaveAttribute('target', '_blank');
      expect(contactLink).toHaveAttribute('rel', 'noopener');
    });
  });

  describe('Section Headers', () => {
    it('should display section headers', () => {
      const sectionHeaders = ['機能', 'アカウント', 'お問い合わせ・法的情報'];

      sectionHeaders.forEach(header => {
        expect(screen.getByText(header)).toBeInTheDocument();
      });
    });
  });

  describe('Styling', () => {
    it('should apply correct background styles to footer', () => {
      const footer = screen.getByRole('contentinfo');
      expect(footer).toHaveStyle({
        background: '#0a0e1a',
        borderTop: '1px solid #07324a',
        padding: '48px 0 32px 0',
      });
    });

    it('should have proper link styling', () => {
      const firstLink = screen.getByRole('link', { name: 'チームデータ検索' });
      expect(firstLink).toHaveStyle({
        color: '#b0c4d8',
        textDecoration: 'none',
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper semantic structure', () => {
      const footer = screen.getByRole('contentinfo');
      expect(footer.tagName).toBe('FOOTER');
    });

    it('should have accessible links', () => {
      const links = screen.getAllByRole('link');
      expect(links.length).toBeGreaterThan(0);

      links.forEach(link => {
        expect(link).toHaveAttribute('href');
      });
    });

    it('should have proper list structure', () => {
      const lists = screen.getAllByRole('list');
      expect(lists.length).toBe(3); // 機能、アカウント、法的情報の3つのリスト
    });
  });
});
