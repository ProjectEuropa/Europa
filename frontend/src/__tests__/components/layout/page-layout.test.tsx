import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { PageLayout, Section, PageHeader } from '@/components/layout/page-layout';

// Header と Footer コンポーネントのモック
vi.mock('@/components/Header', () => ({
  default: ({ showMenu, variant }: { showMenu?: boolean; variant?: string }) => (
    <header data-testid="header" data-show-menu={showMenu} data-variant={variant}>
      Header
    </header>
  ),
}));

vi.mock('@/components/Footer', () => ({
  default: ({ variant }: { variant?: string }) => (
    <footer data-testid="footer" data-variant={variant}>
      Footer
    </footer>
  ),
}));

// focus-manager のモック
vi.mock('@/components/layout/focus-manager', () => ({
  SkipLink: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href} data-testid="skip-link">{children}</a>
  ),
  useFocusVisible: () => {},
}));

describe('PageLayout', () => {
  it('should render children with default layout', () => {
    render(
      <PageLayout>
        <div>Test Content</div>
      </PageLayout>
    );

    expect(screen.getByText('Test Content')).toBeInTheDocument();
    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  it('should hide header when showHeader is false', () => {
    render(
      <PageLayout showHeader={false}>
        <div>Test Content</div>
      </PageLayout>
    );

    expect(screen.queryByTestId('header')).not.toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  it('should hide footer when showFooter is false', () => {
    render(
      <PageLayout showFooter={false}>
        <div>Test Content</div>
      </PageLayout>
    );

    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.queryByTestId('footer')).not.toBeInTheDocument();
  });

  it('should pass headerProps to Header component', () => {
    render(
      <PageLayout headerProps={{ showMenu: false, variant: 'minimal' }}>
        <div>Test Content</div>
      </PageLayout>
    );

    const header = screen.getByTestId('header');
    expect(header).toHaveAttribute('data-show-menu', 'false');
    expect(header).toHaveAttribute('data-variant', 'minimal');
  });

  it('should pass footerProps to Footer component', () => {
    render(
      <PageLayout footerProps={{ variant: 'minimal' }}>
        <div>Test Content</div>
      </PageLayout>
    );

    const footer = screen.getByTestId('footer');
    expect(footer).toHaveAttribute('data-variant', 'minimal');
  });

  it('should render skip link', () => {
    render(
      <PageLayout>
        <div>Test Content</div>
      </PageLayout>
    );

    const skipLink = screen.getByTestId('skip-link');
    expect(skipLink).toHaveAttribute('href', '#main-content');
    expect(skipLink).toHaveTextContent('メインコンテンツにスキップ');
  });

  it('should apply custom className to main element', () => {
    render(
      <PageLayout className="custom-main-class">
        <div>Test Content</div>
      </PageLayout>
    );

    const main = screen.getByRole('main');
    expect(main).toHaveClass('custom-main-class');
  });

  it('should handle fullWidth prop', () => {
    render(
      <PageLayout fullWidth={true}>
        <div>Test Content</div>
      </PageLayout>
    );

    const main = screen.getByRole('main');
    expect(main).toHaveClass('flex-1');
    expect(main).not.toHaveClass('container');
  });

  it('should set correct maxWidth and padding classes', () => {
    render(
      <PageLayout maxWidth="lg" padding="lg">
        <div>Test Content</div>
      </PageLayout>
    );

    const main = screen.getByRole('main');
    expect(main).toHaveClass('max-w-lg');
    expect(main).toHaveClass('px-6');
    expect(main).toHaveClass('py-12');
  });
});

describe('Section', () => {
  it('should render children with section wrapper', () => {
    render(
      <Section>
        <div>Section Content</div>
      </Section>
    );

    expect(screen.getByText('Section Content')).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    render(
      <Section className="custom-section">
        <div>Section Content</div>
      </Section>
    );

    const section = screen.getByText('Section Content').closest('section');
    expect(section).toHaveClass('custom-section');
  });

  it('should set id when provided', () => {
    render(
      <Section id="test-section">
        <div>Section Content</div>
      </Section>
    );

    const section = screen.getByText('Section Content').closest('section');
    expect(section).toHaveAttribute('id', 'test-section');
  });
});

describe('PageHeader', () => {
  it('should render title', () => {
    render(
      <PageHeader title="Test Page" />
    );

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Test Page');
  });

  it('should render description when provided', () => {
    render(
      <PageHeader title="Test Page" description="This is a test page" />
    );

    expect(screen.getByText('This is a test page')).toBeInTheDocument();
  });

  it('should render action when provided', () => {
    render(
      <PageHeader 
        title="Test Page" 
        action={<button>Action Button</button>} 
      />
    );

    expect(screen.getByRole('button', { name: 'Action Button' })).toBeInTheDocument();
  });

  it('should have responsive layout classes', () => {
    const { container } = render(
      <PageHeader title="Test Page" />
    );

    const headerDiv = container.firstChild as HTMLElement;
    expect(headerDiv).toHaveClass('flex');
    expect(headerDiv).toHaveClass('flex-col');
    expect(headerDiv).toHaveClass('sm:flex-row');
  });
});