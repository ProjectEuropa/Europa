import { render, screen } from '@testing-library/react';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { describe, expect, it } from 'vitest';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

// Test wrapper component that provides form context
const TestFormWrapper = ({
  children,
  defaultValues = {},
}: {
  children: React.ReactNode;
  defaultValues?: any;
}) => {
  const form = useForm({ defaultValues });
  return <Form {...form}>{children}</Form>;
};

describe('Form Components', () => {
  describe('FormField', () => {
    it('should render form field with label', () => {
      render(
        <TestFormWrapper>
          <FormField
            name="test"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Test Label</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </TestFormWrapper>
      );

      expect(screen.getByText('Test Label')).toBeInTheDocument();
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('should show error message when error exists', () => {
      const TestComponent = () => {
        const form = useForm({
          defaultValues: { test: '' },
          mode: 'onChange',
        });

        // Set error manually
        React.useEffect(() => {
          form.setError('test', { message: 'Test error' });
        }, [form]);

        return (
          <Form {...form}>
            <FormField
              name="test"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Test Label</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Form>
        );
      };

      render(<TestComponent />);

      expect(screen.getByText('Test error')).toBeInTheDocument();
    });

    it('should apply error styles to label when error exists', () => {
      const TestComponent = () => {
        const form = useForm({
          defaultValues: { test: '' },
          mode: 'onChange',
        });

        // Set error manually
        React.useEffect(() => {
          form.setError('test', { message: 'Test error' });
        }, [form]);

        return (
          <Form {...form}>
            <FormField
              name="test"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Test Label</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Form>
        );
      };

      render(<TestComponent />);

      const label = screen.getByText('Test Label');
      expect(label).toHaveClass('text-destructive');
    });

    it('should set aria-invalid when error exists', () => {
      const TestComponent = () => {
        const form = useForm({
          defaultValues: { test: '' },
          mode: 'onChange',
        });

        // Set error manually
        React.useEffect(() => {
          form.setError('test', { message: 'Test error' });
        }, [form]);

        return (
          <Form {...form}>
            <FormField
              name="test"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Test Label</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Form>
        );
      };

      render(<TestComponent />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-invalid', 'true');
    });

    it('should render form description', () => {
      render(
        <TestFormWrapper>
          <FormField
            name="test"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Test Label</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>This is a description</FormDescription>
              </FormItem>
            )}
          />
        </TestFormWrapper>
      );

      expect(screen.getByText('This is a description')).toBeInTheDocument();
    });

    it('should apply custom className to FormItem', () => {
      render(
        <TestFormWrapper>
          <FormField
            name="test"
            render={({ field }) => (
              <FormItem className="custom-class">
                <FormLabel>Test Label</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </TestFormWrapper>
      );

      const container = screen.getByText('Test Label').closest('div');
      expect(container).toHaveClass('custom-class');
    });
  });

  describe('FormItem', () => {
    it('should render form item with correct spacing', () => {
      render(
        <TestFormWrapper>
          <FormField
            name="test"
            render={({ field }) => (
              <FormItem data-testid="form-item">
                <FormLabel>Test Label</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </TestFormWrapper>
      );

      const formItem = screen.getByTestId('form-item');
      expect(formItem).toHaveClass('space-y-2');
    });
  });

  describe('FormLabel', () => {
    it('should render label with correct attributes', () => {
      render(
        <TestFormWrapper>
          <FormField
            name="test"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Test Label</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </TestFormWrapper>
      );

      const label = screen.getByText('Test Label');
      const input = screen.getByRole('textbox');
      expect(label).toHaveAttribute('for', input.id);
    });
  });

  describe('FormControl', () => {
    it('should pass correct props to input', () => {
      render(
        <TestFormWrapper>
          <FormField
            name="test"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Test Label</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter text" />
                </FormControl>
              </FormItem>
            )}
          />
        </TestFormWrapper>
      );

      const input = screen.getByPlaceholderText('Enter text');
      expect(input).toBeInTheDocument();
    });
  });
});
