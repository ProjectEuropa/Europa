import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Icons from '@/components/Icons';

describe('Icons', () => {
  describe('Logo', () => {
    it('should render with default props', () => {
      const { container } = render(<Icons.Logo />);
      const svg = container.querySelector('svg');

      expect(svg).toBeInTheDocument();
      expect(svg).toHaveAttribute('width', '30');
      expect(svg).toHaveAttribute('height', '30');
      expect(svg).toHaveAttribute('viewBox', '0 0 40 40');
    });

    it('should render with custom size', () => {
      const { container } = render(<Icons.Logo size={50} />);
      const svg = container.querySelector('svg');

      expect(svg).toHaveAttribute('width', '50');
      expect(svg).toHaveAttribute('height', '50');
    });

    it('should render with custom colors', () => {
      const { container } = render(
        <Icons.Logo color="#ff0000" secondaryColor="#00ff00" />
      );
      const svg = container.querySelector('svg');

      expect(svg).toBeInTheDocument();
    });
  });

  describe('Favicon', () => {
    it('should render with default props', () => {
      const { container } = render(<Icons.Favicon />);
      const svg = container.querySelector('svg');

      expect(svg).toBeInTheDocument();
      expect(svg).toHaveAttribute('width', '32');
      expect(svg).toHaveAttribute('height', '32');
      expect(svg).toHaveAttribute('viewBox', '0 0 32 32');
    });

    it('should render with custom size and colors', () => {
      const { container } = render(
        <Icons.Favicon size={64} color="#ff0000" secondaryColor="#00ff00" />
      );
      const svg = container.querySelector('svg');

      expect(svg).toHaveAttribute('width', '64');
      expect(svg).toHaveAttribute('height', '64');
    });
  });

  describe('TeamSearch', () => {
    it('should render with default props', () => {
      const { container } = render(<Icons.TeamSearch />);
      const svg = container.querySelector('svg');

      expect(svg).toBeInTheDocument();
      expect(svg).toHaveAttribute('width', '40');
      expect(svg).toHaveAttribute('height', '40');
    });

    it('should render with custom size and color', () => {
      const { container } = render(
        <Icons.TeamSearch size={24} color="#ff0000" />
      );
      const svg = container.querySelector('svg');

      expect(svg).toHaveAttribute('width', '24');
      expect(svg).toHaveAttribute('height', '24');
    });
  });

  describe('MatchSearch', () => {
    it('should render correctly', () => {
      const { container } = render(<Icons.MatchSearch />);
      const svg = container.querySelector('svg');

      expect(svg).toBeInTheDocument();
      expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
    });
  });

  describe('Upload', () => {
    it('should render correctly', () => {
      const { container } = render(<Icons.Upload />);
      const svg = container.querySelector('svg');

      expect(svg).toBeInTheDocument();
      expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
    });
  });

  describe('TeamDownload', () => {
    it('should render correctly', () => {
      const { container } = render(<Icons.TeamDownload />);
      const svg = container.querySelector('svg');

      expect(svg).toBeInTheDocument();
    });
  });

  describe('MatchDownload', () => {
    it('should render correctly', () => {
      const { container } = render(<Icons.MatchDownload />);
      const svg = container.querySelector('svg');

      expect(svg).toBeInTheDocument();
    });
  });

  describe('Information', () => {
    it('should render correctly', () => {
      const { container } = render(<Icons.Information />);
      const svg = container.querySelector('svg');

      expect(svg).toBeInTheDocument();
    });
  });

  describe('Register', () => {
    it('should render with default size', () => {
      const { container } = render(<Icons.Register />);
      const svg = container.querySelector('svg');

      expect(svg).toBeInTheDocument();
      expect(svg).toHaveAttribute('width', '20');
      expect(svg).toHaveAttribute('height', '20');
    });
  });

  describe('Login', () => {
    it('should render with default size', () => {
      const { container } = render(<Icons.Login />);
      const svg = container.querySelector('svg');

      expect(svg).toBeInTheDocument();
      expect(svg).toHaveAttribute('width', '20');
      expect(svg).toHaveAttribute('height', '20');
    });
  });

  describe('Guidelines', () => {
    it('should render correctly', () => {
      const { container } = render(<Icons.Guidelines />);
      const svg = container.querySelector('svg');

      expect(svg).toBeInTheDocument();
    });
  });

  describe('Arrow', () => {
    it('should render correctly', () => {
      const { container } = render(<Icons.Arrow />);
      const svg = container.querySelector('svg');

      expect(svg).toBeInTheDocument();
    });
  });

  describe('Search', () => {
    it('should render with default color', () => {
      const { container } = render(<Icons.Search />);
      const svg = container.querySelector('svg');

      expect(svg).toBeInTheDocument();
      expect(svg).toHaveAttribute('width', '20');
      expect(svg).toHaveAttribute('height', '20');
    });
  });

  describe('Logout', () => {
    it('should render correctly', () => {
      const { container } = render(<Icons.Logout />);
      const svg = container.querySelector('svg');

      expect(svg).toBeInTheDocument();
    });
  });

  describe('Social Media Icons', () => {
    it('should render Twitter icon', () => {
      const { container } = render(<Icons.Twitter />);
      const svg = container.querySelector('svg');

      expect(svg).toBeInTheDocument();
      expect(svg).toHaveAttribute('width', '24');
      expect(svg).toHaveAttribute('height', '24');
    });

    it('should render Facebook icon', () => {
      const { container } = render(<Icons.Facebook />);
      const svg = container.querySelector('svg');

      expect(svg).toBeInTheDocument();
    });

    it('should render LinkedIn icon', () => {
      const { container } = render(<Icons.LinkedIn />);
      const svg = container.querySelector('svg');

      expect(svg).toBeInTheDocument();
    });

    it('should render Instagram icon', () => {
      const { container } = render(<Icons.Instagram />);
      const svg = container.querySelector('svg');

      expect(svg).toBeInTheDocument();
    });

    it('should render Share icon', () => {
      const { container } = render(<Icons.Share />);
      const svg = container.querySelector('svg');

      expect(svg).toBeInTheDocument();
    });
  });

  describe('Menu Icons', () => {
    it('should render Menu icon', () => {
      const { container } = render(<Icons.Menu />);
      const svg = container.querySelector('svg');

      expect(svg).toBeInTheDocument();
      expect(svg).toHaveAttribute('width', '24');
      expect(svg).toHaveAttribute('height', '24');
    });

    it('should render Close icon', () => {
      const { container } = render(<Icons.Close />);
      const svg = container.querySelector('svg');

      expect(svg).toBeInTheDocument();
    });
  });

  describe('Icon Customization', () => {
    it('should accept custom size for all icons', () => {
      const customSize = 48;
      const icons = [
        <Icons.Logo key="logo" size={customSize} />,
        <Icons.TeamSearch key="teamsearch" size={customSize} />,
        <Icons.Upload key="upload" size={customSize} />,
        <Icons.Menu key="menu" size={customSize} />,
      ];

      icons.forEach((icon, _index) => {
        const { container } = render(icon);
        const svg = container.querySelector('svg');
        expect(svg).toHaveAttribute('width', customSize.toString());
        expect(svg).toHaveAttribute('height', customSize.toString());
      });
    });

    it('should accept custom color for all icons', () => {
      const customColor = '#ff5500';
      const icons = [
        <Icons.TeamSearch key="teamsearch" color={customColor} />,
        <Icons.Upload key="upload" color={customColor} />,
        <Icons.Login key="login" color={customColor} />,
        <Icons.Menu key="menu" color={customColor} />,
      ];

      icons.forEach(icon => {
        const { container } = render(icon);
        const svg = container.querySelector('svg');
        expect(svg).toBeInTheDocument();
      });
    });
  });

  describe('SVG Structure', () => {
    it('should have proper SVG namespace', () => {
      const { container } = render(<Icons.Logo />);
      const svg = container.querySelector('svg');

      expect(svg).toHaveAttribute('xmlns', 'http://www.w3.org/2000/svg');
    });

    it('should have fill="none" attribute', () => {
      const { container } = render(<Icons.TeamSearch />);
      const svg = container.querySelector('svg');

      expect(svg).toHaveAttribute('fill', 'none');
    });

    it('should contain path elements', () => {
      const { container } = render(<Icons.Arrow />);
      const paths = container.querySelectorAll('path');

      expect(paths.length).toBeGreaterThan(0);
    });
  });
});
