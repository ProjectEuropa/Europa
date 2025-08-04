import { describe, expect, it } from 'vitest';
import type {
  ButtonProps,
  ButtonSize,
  ButtonVariant,
  LoadingProps,
  ModalProps,
  PaginationProps,
  SkeletonProps,
  TabItem,
  TabsProps,
  ToastType,
} from '@/types/ui';

describe('UI Types', () => {
  describe('ButtonVariant', () => {
    it('should accept valid button variants', () => {
      const variants: ButtonVariant[] = [
        'primary',
        'secondary',
        'danger',
        'ghost',
      ];

      variants.forEach(variant => {
        const buttonVariant: ButtonVariant = variant;
        expect(['primary', 'secondary', 'danger', 'ghost']).toContain(
          buttonVariant
        );
      });
    });
  });

  describe('ButtonSize', () => {
    it('should accept valid button sizes', () => {
      const sizes: ButtonSize[] = ['sm', 'md', 'lg'];

      sizes.forEach(size => {
        const buttonSize: ButtonSize = size;
        expect(['sm', 'md', 'lg']).toContain(buttonSize);
      });
    });
  });

  describe('ButtonProps', () => {
    it('should define button properties correctly', () => {
      const buttonProps: ButtonProps = {
        variant: 'primary',
        size: 'md',
        loading: false,
        disabled: false,
        children: 'Click me',
        onClick: () => {},
        type: 'button',
        className: 'custom-button',
      };

      expect(buttonProps.variant).toBe('primary');
      expect(buttonProps.size).toBe('md');
      expect(buttonProps.loading).toBe(false);
      expect(buttonProps.disabled).toBe(false);
      expect(buttonProps.children).toBe('Click me');
      expect(buttonProps.type).toBe('button');
      expect(buttonProps.className).toBe('custom-button');
    });

    it('should work with minimal required properties', () => {
      const minimalProps: ButtonProps = {
        children: 'Minimal Button',
      };

      expect(minimalProps.children).toBe('Minimal Button');
      expect(minimalProps.variant).toBeUndefined();
      expect(minimalProps.size).toBeUndefined();
    });
  });

  describe('ModalProps', () => {
    it('should define modal properties correctly', () => {
      const modalProps: ModalProps = {
        isOpen: true,
        onClose: () => {},
        title: 'Test Modal',
        children: 'Modal content',
        size: 'md',
        closeOnOverlayClick: true,
      };

      expect(modalProps.isOpen).toBe(true);
      expect(modalProps.title).toBe('Test Modal');
      expect(modalProps.children).toBe('Modal content');
      expect(modalProps.size).toBe('md');
      expect(modalProps.closeOnOverlayClick).toBe(true);
    });

    it('should work with required properties only', () => {
      const minimalModal: ModalProps = {
        isOpen: false,
        onClose: () => {},
        title: 'Simple Modal',
        children: 'Content',
      };

      expect(minimalModal.isOpen).toBe(false);
      expect(minimalModal.title).toBe('Simple Modal');
      expect(minimalModal.size).toBeUndefined();
      expect(minimalModal.closeOnOverlayClick).toBeUndefined();
    });
  });

  describe('ToastType', () => {
    it('should define toast properties correctly', () => {
      const toast: ToastType = {
        id: 'toast-1',
        type: 'success',
        title: 'Success!',
        message: 'Operation completed successfully',
        duration: 5000,
      };

      expect(toast.id).toBe('toast-1');
      expect(toast.type).toBe('success');
      expect(toast.title).toBe('Success!');
      expect(toast.message).toBe('Operation completed successfully');
      expect(toast.duration).toBe(5000);
    });

    it('should work with different toast types', () => {
      const toastTypes: ToastType['type'][] = [
        'success',
        'error',
        'warning',
        'info',
      ];

      toastTypes.forEach(type => {
        const toast: ToastType = {
          id: `toast-${type}`,
          type,
          title: `${type} message`,
        };

        expect(toast.type).toBe(type);
        expect(toast.title).toBe(`${type} message`);
      });
    });

    it('should work without optional properties', () => {
      const minimalToast: ToastType = {
        id: 'minimal-toast',
        type: 'info',
        title: 'Info',
      };

      expect(minimalToast.message).toBeUndefined();
      expect(minimalToast.duration).toBeUndefined();
    });
  });

  describe('LoadingProps', () => {
    it('should define loading properties correctly', () => {
      const loadingProps: LoadingProps = {
        size: 'lg',
        color: '#00c8ff',
        text: 'Loading...',
      };

      expect(loadingProps.size).toBe('lg');
      expect(loadingProps.color).toBe('#00c8ff');
      expect(loadingProps.text).toBe('Loading...');
    });

    it('should work with all properties optional', () => {
      const emptyLoading: LoadingProps = {};

      expect(emptyLoading.size).toBeUndefined();
      expect(emptyLoading.color).toBeUndefined();
      expect(emptyLoading.text).toBeUndefined();
    });
  });

  describe('SkeletonProps', () => {
    it('should define skeleton properties correctly', () => {
      const skeletonProps: SkeletonProps = {
        width: '100%',
        height: 20,
        className: 'custom-skeleton',
      };

      expect(skeletonProps.width).toBe('100%');
      expect(skeletonProps.height).toBe(20);
      expect(skeletonProps.className).toBe('custom-skeleton');
    });

    it('should accept both string and number for dimensions', () => {
      const stringDimensions: SkeletonProps = {
        width: '200px',
        height: '50px',
      };

      const numberDimensions: SkeletonProps = {
        width: 200,
        height: 50,
      };

      expect(typeof stringDimensions.width).toBe('string');
      expect(typeof stringDimensions.height).toBe('string');
      expect(typeof numberDimensions.width).toBe('number');
      expect(typeof numberDimensions.height).toBe('number');
    });
  });

  describe('PaginationProps', () => {
    it('should define pagination properties correctly', () => {
      const paginationProps: PaginationProps = {
        currentPage: 2,
        totalPages: 10,
        onPageChange: (page: number) => console.log(page),
        showFirstLast: true,
        showPrevNext: true,
      };

      expect(paginationProps.currentPage).toBe(2);
      expect(paginationProps.totalPages).toBe(10);
      expect(paginationProps.showFirstLast).toBe(true);
      expect(paginationProps.showPrevNext).toBe(true);
    });

    it('should work with required properties only', () => {
      const minimalPagination: PaginationProps = {
        currentPage: 1,
        totalPages: 5,
        onPageChange: () => {},
      };

      expect(minimalPagination.currentPage).toBe(1);
      expect(minimalPagination.totalPages).toBe(5);
      expect(minimalPagination.showFirstLast).toBeUndefined();
      expect(minimalPagination.showPrevNext).toBeUndefined();
    });
  });

  describe('TabItem', () => {
    it('should define tab item properties correctly', () => {
      const tabItem: TabItem = {
        id: 'tab-1',
        label: 'First Tab',
        content: 'Tab content',
        disabled: false,
      };

      expect(tabItem.id).toBe('tab-1');
      expect(tabItem.label).toBe('First Tab');
      expect(tabItem.content).toBe('Tab content');
      expect(tabItem.disabled).toBe(false);
    });

    it('should work without optional disabled property', () => {
      const tabItem: TabItem = {
        id: 'tab-2',
        label: 'Second Tab',
        content: 'Another content',
      };

      expect(tabItem.disabled).toBeUndefined();
    });
  });

  describe('TabsProps', () => {
    it('should define tabs properties correctly', () => {
      const tabItems: TabItem[] = [
        { id: 'tab1', label: 'Tab 1', content: 'Content 1' },
        { id: 'tab2', label: 'Tab 2', content: 'Content 2' },
      ];

      const tabsProps: TabsProps = {
        items: tabItems,
        defaultActiveId: 'tab1',
        onTabChange: (id: string) => console.log(id),
      };

      expect(tabsProps.items).toHaveLength(2);
      expect(tabsProps.defaultActiveId).toBe('tab1');
      expect(typeof tabsProps.onTabChange).toBe('function');
    });

    it('should work with items only', () => {
      const tabItems: TabItem[] = [
        { id: 'single', label: 'Single Tab', content: 'Single Content' },
      ];

      const minimalTabs: TabsProps = {
        items: tabItems,
      };

      expect(minimalTabs.items).toHaveLength(1);
      expect(minimalTabs.defaultActiveId).toBeUndefined();
      expect(minimalTabs.onTabChange).toBeUndefined();
    });
  });

  describe('Type Compatibility', () => {
    it('should allow proper type assignments', () => {
      // Button variant assignment
      const variant: ButtonVariant = 'primary';
      expect(variant).toBe('primary');

      // Modal size assignment
      const modalSize: ModalProps['size'] = 'lg';
      expect(modalSize).toBe('lg');

      // Toast type assignment
      const toastType: ToastType['type'] = 'error';
      expect(toastType).toBe('error');
    });
  });
});
