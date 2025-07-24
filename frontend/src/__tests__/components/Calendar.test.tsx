import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Calendar from '@/components/Calendar';

describe('Calendar', () => {
  const mockOnSelect = vi.fn();
  const testDate = new Date('2024-01-15T10:30:00');

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('should render calendar with default props', () => {
      render(<Calendar initialDate={testDate} />);

      expect(screen.getByText('2024年1月')).toBeInTheDocument();
      expect(screen.getByText('今日')).toBeInTheDocument();
    });

    it('should render with custom initial date', () => {
      const customDate = new Date('2023-12-25');
      render(<Calendar initialDate={customDate} />);

      expect(screen.getByText('2023年12月')).toBeInTheDocument();
    });

    it('should render weekday headers', () => {
      render(<Calendar initialDate={testDate} />);

      const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
      weekdays.forEach(day => {
        expect(screen.getByText(day)).toBeInTheDocument();
      });
    });
  });

  describe('Size Variants', () => {
    it('should render small size calendar', () => {
      const { container } = render(<Calendar size="small" initialDate={testDate} />);

      expect(container.firstChild).toBeInTheDocument();
    });

    it('should render large size calendar', () => {
      const { container } = render(<Calendar size="large" initialDate={testDate} />);

      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('Navigation', () => {
    it('should have navigation buttons', () => {
      render(<Calendar initialDate={testDate} />);

      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThanOrEqual(3); // 前月、次月、今日ボタン
    });

    it('should have today button', () => {
      render(<Calendar initialDate={testDate} />);

      const todayButton = screen.getByText('今日');
      expect(todayButton).toBeInTheDocument();
    });
  });

  describe('Date Selection', () => {
    it('should call onSelect when date is clicked', async () => {
      const user = userEvent.setup();
      render(<Calendar initialDate={testDate} onSelect={mockOnSelect} />);

      // 15日をクリック
      const dayButton = screen.getByText('15');
      await user.click(dayButton);

      expect(mockOnSelect).toHaveBeenCalled();
    });
  });

  describe('Time Selection', () => {
    it('should render time selection when showTimeSelect is true', () => {
      render(<Calendar showTimeSelect={true} initialDate={testDate} />);

      expect(screen.getByText('時間:')).toBeInTheDocument();
    });

    it('should not render time selection by default', () => {
      render(<Calendar initialDate={testDate} />);

      expect(screen.queryByText('時間:')).not.toBeInTheDocument();
    });

    it('should render time set button when showTimeSelect is true', () => {
      render(<Calendar showTimeSelect={true} initialDate={testDate} />);

      expect(screen.getByText('時間を設定して閉じる')).toBeInTheDocument();
    });
  });

  describe('Events', () => {
    const mockEvents = [
      {
        date: '2024-01-15T00:00:00Z',
        title: 'テストイベント',
        details: 'イベントの詳細',
        url: 'https://example.com',
      },
    ];

    it('should display event indicators', () => {
      render(<Calendar initialDate={testDate} events={mockEvents} />);

      expect(screen.getByText('📅')).toBeInTheDocument();
      expect(screen.getByText('EVENT')).toBeInTheDocument();
    });

    it('should open event modal when event date is clicked', async () => {
      const user = userEvent.setup();
      render(<Calendar initialDate={testDate} events={mockEvents} />);

      const eventDay = screen.getByText('15');
      await user.click(eventDay);

      expect(screen.getByText('テストイベント')).toBeInTheDocument();
      expect(screen.getByText('イベントの詳細')).toBeInTheDocument();
    });
  });

  describe('Calendar Grid', () => {
    it('should render calendar days', () => {
      render(<Calendar initialDate={testDate} />);

      // 複数の「1」が存在する可能性があるため、getAllByTextを使用
      const ones = screen.getAllByText('1');
      expect(ones.length).toBeGreaterThan(0);

      expect(screen.getByText('15')).toBeInTheDocument();

      // 31日は前月と今月で複数存在する可能性があるため、getAllByTextを使用
      const thirtyOnes = screen.getAllByText('31');
      expect(thirtyOnes.length).toBeGreaterThan(0);
    });
  });

  describe('Accessibility', () => {
    it('should have proper button roles', () => {
      render(<Calendar initialDate={testDate} />);

      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
    });

    it('should have readable month/year display', () => {
      render(<Calendar initialDate={testDate} />);

      const monthYear = screen.getByText('2024年1月');
      expect(monthYear).toBeVisible();
    });
  });

  describe('Error Handling', () => {
    it('should handle empty events array', () => {
      expect(() => render(<Calendar initialDate={testDate} events={[]} />)).not.toThrow();
    });

    it('should render without crashing', () => {
      expect(() => render(<Calendar initialDate={testDate} />)).not.toThrow();
    });
  });
});
