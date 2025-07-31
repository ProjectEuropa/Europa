import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Tabs } from '@/components/ui/tabs';

const mockItems = [
  {
    id: 'tab1',
    label: 'Tab 1',
    content: <div>Content 1</div>,
  },
  {
    id: 'tab2',
    label: 'Tab 2',
    content: <div>Content 2</div>,
  },
  {
    id: 'tab3',
    label: 'Tab 3',
    content: <div>Content 3</div>,
    disabled: true,
  },
];

describe('Tabs', () => {
  it('should render all tabs', () => {
    render(<Tabs items={mockItems} />);

    expect(screen.getByRole('tab', { name: 'Tab 1' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Tab 2' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Tab 3' })).toBeInTheDocument();
  });

  it('should show first tab content by default', () => {
    render(<Tabs items={mockItems} />);
    expect(screen.getByText('Content 1')).toBeInTheDocument();
    // 他のタブコンテンツは非表示だが、DOMには存在する
    const tab2Content = screen.getByText('Content 2');
    expect(tab2Content.parentElement).toHaveClass('hidden');
  });

  it('should switch tabs when clicked', () => {
    render(<Tabs items={mockItems} />);

    const tab2 = screen.getByRole('tab', { name: 'Tab 2' });
    fireEvent.click(tab2);

    expect(screen.getByText('Content 2').parentElement).not.toHaveClass(
      'hidden'
    );
    expect(screen.getByText('Content 1').parentElement).toHaveClass('hidden');
  });

  it('should not switch to disabled tab', () => {
    render(<Tabs items={mockItems} />);

    const tab3 = screen.getByRole('tab', { name: 'Tab 3' });
    fireEvent.click(tab3);

    // 無効なタブをクリックしても、アクティブなタブは変わらない
    expect(screen.getByText('Content 1').parentElement).not.toHaveClass(
      'hidden'
    );
    expect(screen.getByText('Content 3').parentElement).toHaveClass('hidden');
  });

  it('should call onTabChange when tab is switched', () => {
    const onTabChange = vi.fn();
    render(<Tabs items={mockItems} onTabChange={onTabChange} />);

    const tab2 = screen.getByRole('tab', { name: 'Tab 2' });
    fireEvent.click(tab2);

    expect(onTabChange).toHaveBeenCalledWith('tab2');
  });

  it('should use defaultActiveId when provided', () => {
    render(<Tabs items={mockItems} defaultActiveId="tab2" />);
    expect(screen.getByText('Content 2')).toBeInTheDocument();
  });
});
