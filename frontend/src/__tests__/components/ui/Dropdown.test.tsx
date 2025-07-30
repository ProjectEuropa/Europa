import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownTrigger,
} from '@/components/ui/dropdown';

describe('Dropdown Components', () => {
  describe('Dropdown', () => {
    it('should render trigger element', () => {
      render(
        <Dropdown>
          <DropdownTrigger>
            <button>Open Menu</button>
          </DropdownTrigger>
          <DropdownContent>
            <div>Menu Content</div>
          </DropdownContent>
        </Dropdown>
      );

      expect(screen.getByText('Open Menu')).toBeInTheDocument();
    });

    it('should not show menu initially', () => {
      render(
        <Dropdown>
          <DropdownTrigger>
            <button>Open Menu</button>
          </DropdownTrigger>
          <DropdownContent>
            <div>Menu Content</div>
          </DropdownContent>
        </Dropdown>
      );

      expect(screen.queryByText('Menu Content')).not.toBeInTheDocument();
    });

    it('should show menu when trigger is clicked', async () => {
      const user = userEvent.setup();

      render(
        <Dropdown>
          <DropdownTrigger>
            <button>Open Menu</button>
          </DropdownTrigger>
          <DropdownContent>
            <div>Menu Content</div>
          </DropdownContent>
        </Dropdown>
      );

      await user.click(screen.getByText('Open Menu'));

      expect(screen.getByText('Menu Content')).toBeInTheDocument();
    });

    it('should hide menu when trigger is clicked again', async () => {
      const user = userEvent.setup();

      render(
        <Dropdown>
          <DropdownTrigger>
            <button>Open Menu</button>
          </DropdownTrigger>
          <DropdownContent>
            <div>Menu Content</div>
          </DropdownContent>
        </Dropdown>
      );

      // Open menu
      await user.click(screen.getByText('Open Menu'));
      expect(screen.getByText('Menu Content')).toBeInTheDocument();

      // Close menu
      await user.click(screen.getByText('Open Menu'));
      expect(screen.queryByText('Menu Content')).not.toBeInTheDocument();
    });

    it('should call onOpenChange when menu state changes', async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();

      render(
        <Dropdown onOpenChange={onOpenChange}>
          <DropdownTrigger>
            <button>Open Menu</button>
          </DropdownTrigger>
          <DropdownContent>
            <div>Menu Content</div>
          </DropdownContent>
        </Dropdown>
      );

      await user.click(screen.getByText('Open Menu'));

      expect(onOpenChange).toHaveBeenCalledWith(true);
    });

    it('should be controlled when open prop is provided', () => {
      const { rerender } = render(
        <Dropdown open={false}>
          <DropdownTrigger>
            <button>Open Menu</button>
          </DropdownTrigger>
          <DropdownContent>
            <div>Menu Content</div>
          </DropdownContent>
        </Dropdown>
      );

      expect(screen.queryByText('Menu Content')).not.toBeInTheDocument();

      rerender(
        <Dropdown open={true}>
          <DropdownTrigger>
            <button>Open Menu</button>
          </DropdownTrigger>
          <DropdownContent>
            <div>Menu Content</div>
          </DropdownContent>
        </Dropdown>
      );

      expect(screen.getByText('Menu Content')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      render(
        <Dropdown className="custom-dropdown">
          <DropdownTrigger>
            <button>Open Menu</button>
          </DropdownTrigger>
          <DropdownContent>
            <div>Menu Content</div>
          </DropdownContent>
        </Dropdown>
      );

      const dropdown = screen
        .getByText('Open Menu')
        .closest('.custom-dropdown');
      expect(dropdown).toBeInTheDocument();
    });

    it('should have correct ARIA attributes', async () => {
      const user = userEvent.setup();

      render(
        <Dropdown>
          <DropdownTrigger>
            <button>Open Menu</button>
          </DropdownTrigger>
          <DropdownContent>
            <div>Menu Content</div>
          </DropdownContent>
        </Dropdown>
      );

      const triggerWrapper = screen.getByText('Open Menu').parentElement;
      expect(triggerWrapper).toHaveAttribute('tabIndex', '0');
      expect(triggerWrapper).toHaveAttribute('aria-expanded', 'false');

      await user.click(screen.getByText('Open Menu'));

      expect(triggerWrapper).toHaveAttribute('aria-expanded', 'true');
      const menu = screen.getByRole('menu');
      expect(menu).toBeInTheDocument();
    });
  });

  describe('DropdownItem', () => {
    it('should render item content', async () => {
      const user = userEvent.setup();

      render(
        <Dropdown>
          <DropdownTrigger>
            <button>Menu</button>
          </DropdownTrigger>
          <DropdownContent>
            <DropdownItem>Menu Item</DropdownItem>
          </DropdownContent>
        </Dropdown>
      );

      // Open menu first to see the item
      await user.click(screen.getByText('Menu'));
      expect(screen.getByText('Menu Item')).toBeInTheDocument();
    });

    it('should call onClick when clicked', async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();

      render(
        <Dropdown>
          <DropdownTrigger>
            <button>Menu</button>
          </DropdownTrigger>
          <DropdownContent>
            <DropdownItem onClick={onClick}>Clickable Item</DropdownItem>
          </DropdownContent>
        </Dropdown>
      );

      // Open menu first
      await user.click(screen.getByText('Menu'));
      await user.click(screen.getByText('Clickable Item'));

      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('should not call onClick when disabled', async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();

      render(
        <Dropdown>
          <DropdownTrigger>
            <button>Menu</button>
          </DropdownTrigger>
          <DropdownContent>
            <DropdownItem onClick={onClick} disabled>
              Disabled Item
            </DropdownItem>
          </DropdownContent>
        </Dropdown>
      );

      // Open menu first
      await user.click(screen.getByText('Menu'));
      await user.click(screen.getByText('Disabled Item'));

      expect(onClick).not.toHaveBeenCalled();
    });

    it('should apply disabled styles when disabled', async () => {
      const user = userEvent.setup();

      render(
        <Dropdown>
          <DropdownTrigger>
            <button>Menu</button>
          </DropdownTrigger>
          <DropdownContent>
            <DropdownItem disabled>Disabled Item</DropdownItem>
          </DropdownContent>
        </Dropdown>
      );

      // Open menu first
      await user.click(screen.getByText('Menu'));
      const item = screen.getByText('Disabled Item');
      expect(item).toHaveClass('opacity-50');
    });

    it('should apply custom className', async () => {
      const user = userEvent.setup();

      render(
        <Dropdown>
          <DropdownTrigger>
            <button>Menu</button>
          </DropdownTrigger>
          <DropdownContent>
            <DropdownItem className="custom-item">Custom Item</DropdownItem>
          </DropdownContent>
        </Dropdown>
      );

      // Open menu first
      await user.click(screen.getByText('Menu'));
      const item = screen.getByText('Custom Item');
      expect(item).toHaveClass('custom-item');
    });

    it('should have correct ARIA attributes', async () => {
      const user = userEvent.setup();

      render(
        <Dropdown>
          <DropdownTrigger>
            <button>Menu</button>
          </DropdownTrigger>
          <DropdownContent>
            <DropdownItem>Menu Item</DropdownItem>
          </DropdownContent>
        </Dropdown>
      );

      // Open menu first
      await user.click(screen.getByText('Menu'));
      const item = screen.getByText('Menu Item');
      expect(item).toHaveAttribute('role', 'menuitem');
      expect(item).toHaveAttribute('tabIndex', '0');
    });

    it('should have tabIndex -1 when disabled', async () => {
      const user = userEvent.setup();

      render(
        <Dropdown>
          <DropdownTrigger>
            <button>Menu</button>
          </DropdownTrigger>
          <DropdownContent>
            <DropdownItem disabled>Disabled Item</DropdownItem>
          </DropdownContent>
        </Dropdown>
      );

      // Open menu first
      await user.click(screen.getByText('Menu'));
      const item = screen.getByText('Disabled Item');
      expect(item).toHaveAttribute('tabIndex', '-1');
    });

    it('should handle keyboard events', async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();

      render(
        <Dropdown>
          <DropdownTrigger>
            <button>Menu</button>
          </DropdownTrigger>
          <DropdownContent>
            <DropdownItem onClick={onClick}>Keyboard Item</DropdownItem>
          </DropdownContent>
        </Dropdown>
      );

      // Open menu first
      await user.click(screen.getByText('Menu'));
      const item = screen.getByText('Keyboard Item');

      // Simulate Enter key press
      fireEvent.keyDown(item, { key: 'Enter', code: 'Enter' });

      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('Dropdown with DropdownItems', () => {
    it('should render complete dropdown menu', async () => {
      const user = userEvent.setup();
      const onItem1Click = vi.fn();
      const onItem2Click = vi.fn();

      render(
        <Dropdown>
          <DropdownTrigger>
            <button>Menu</button>
          </DropdownTrigger>
          <DropdownContent>
            <DropdownItem onClick={onItem1Click}>Item 1</DropdownItem>
            <DropdownItem onClick={onItem2Click}>Item 2</DropdownItem>
            <DropdownItem disabled>Disabled Item</DropdownItem>
          </DropdownContent>
        </Dropdown>
      );

      // Open menu
      await user.click(screen.getByText('Menu'));

      // Verify all items are visible
      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 2')).toBeInTheDocument();
      expect(screen.getByText('Disabled Item')).toBeInTheDocument();

      // Click on items
      await user.click(screen.getByText('Item 1'));
      expect(onItem1Click).toHaveBeenCalledTimes(1);

      // Reopen menu for second item
      await user.click(screen.getByText('Menu'));
      await user.click(screen.getByText('Item 2'));
      expect(onItem2Click).toHaveBeenCalledTimes(1);
    });

    it('should handle complex menu structure', async () => {
      const user = userEvent.setup();

      render(
        <Dropdown>
          <DropdownTrigger>
            <span>Complex Menu</span>
          </DropdownTrigger>
          <DropdownContent>
            <DropdownItem>
              <div>
                <strong>Bold Item</strong>
                <p>With description</p>
              </div>
            </DropdownItem>
            <DropdownItem>
              <span>🎉 Item with emoji</span>
            </DropdownItem>
          </DropdownContent>
        </Dropdown>
      );

      await user.click(screen.getByText('Complex Menu'));

      expect(screen.getByText('Bold Item')).toBeInTheDocument();
      expect(screen.getByText('With description')).toBeInTheDocument();
      expect(screen.getByText('🎉 Item with emoji')).toBeInTheDocument();
    });
  });
});
