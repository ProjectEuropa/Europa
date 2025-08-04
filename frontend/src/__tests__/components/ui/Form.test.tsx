import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import {
  DateField,
  EmailField,
  FileField,
  FormField,
  PasswordField,
  SelectField,
  TextareaField,
  TextField,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

describe('Form Components', () => {
  describe('FormField', () => {
    it('should render form field with label', () => {
      render(
        <FormField name="test" label="Test Label">
          <Input />
        </FormField>
      );

      expect(screen.getByText('Test Label')).toBeInTheDocument();
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('should show required indicator when required', () => {
      render(
        <FormField name="test" label="Test Label" required>
          <Input />
        </FormField>
      );

      expect(screen.getByText('*')).toBeInTheDocument();
    });

    it('should show error message when error exists', () => {
      render(
        <FormField name="test" label="Test Label" error="Test error">
          <Input />
        </FormField>
      );

      expect(screen.getByText('Test error')).toBeInTheDocument();
      expect(screen.getByText('Test error')).toHaveClass('text-red-400');
    });

    it('should apply error styles to label when error exists', () => {
      render(
        <FormField name="test" label="Test Label" error="Test error">
          <Input />
        </FormField>
      );

      const label = screen.getByText('Test Label');
      expect(label).toHaveClass('text-red-400');
    });

    it('should apply custom className', () => {
      render(
        <FormField name="test" label="Test Label" className="custom-class">
          <Input />
        </FormField>
      );

      const container = screen.getByText('Test Label').closest('div');
      expect(container).toHaveClass('custom-class');
    });

    it('should set aria-invalid when error exists', () => {
      render(
        <FormField name="test" label="Test Label" error="Test error">
          <Input />
        </FormField>
      );

      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-invalid', 'true');
    });
  });

  describe('TextField', () => {
    it('should render text input field', () => {
      render(<TextField name="text" label="Text Field" />);

      expect(screen.getByText('Text Field')).toBeInTheDocument();
      expect(screen.getByRole('textbox')).toBeInTheDocument();
      expect(screen.getByRole('textbox')).toHaveAttribute('type', 'text');
    });

    it('should apply error styles when error exists', () => {
      render(
        <TextField name="text" label="Text Field" error="Error message" />
      );

      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('border-red-500');
    });

    it('should show placeholder', () => {
      render(
        <TextField name="text" label="Text Field" placeholder="Enter text" />
      );

      expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
    });
  });

  describe('PasswordField', () => {
    it('should render password input field', () => {
      render(<PasswordField name="password" label="Password Field" />);

      expect(screen.getByText('Password Field')).toBeInTheDocument();
      const input = screen.getByLabelText('Password Field');
      expect(input).toHaveAttribute('type', 'password');
    });
  });

  describe('EmailField', () => {
    it('should render email input field', () => {
      render(<EmailField name="email" label="Email Field" />);

      expect(screen.getByText('Email Field')).toBeInTheDocument();
      expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email');
    });
  });

  describe('TextareaField', () => {
    it('should render textarea field', () => {
      render(<TextareaField name="textarea" label="Textarea Field" />);

      expect(screen.getByText('Textarea Field')).toBeInTheDocument();
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('should apply error styles when error exists', () => {
      render(
        <TextareaField
          name="textarea"
          label="Textarea Field"
          error="Error message"
        />
      );

      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveClass('border-red-500');
    });
  });

  describe('FileField', () => {
    it('should render file input field', () => {
      render(<FileField name="file" label="File Field" />);

      expect(screen.getByText('File Field')).toBeInTheDocument();
      const input = screen.getByLabelText('File Field');
      expect(input).toHaveAttribute('type', 'file');
    });

    it('should apply accept attribute', () => {
      render(<FileField name="file" label="File Field" accept=".jpg,.png" />);

      const input = screen.getByLabelText('File Field');
      expect(input).toHaveAttribute('accept', '.jpg,.png');
    });

    it('should apply multiple attribute', () => {
      render(<FileField name="file" label="File Field" multiple />);

      const input = screen.getByLabelText('File Field');
      expect(input).toHaveAttribute('multiple');
    });
  });

  describe('DateField', () => {
    it('should render date input field', () => {
      render(<DateField name="date" label="Date Field" />);

      expect(screen.getByText('Date Field')).toBeInTheDocument();
      const input = screen.getByLabelText('Date Field');
      expect(input).toHaveAttribute('type', 'date');
    });

    it('should apply min and max attributes', () => {
      render(
        <DateField
          name="date"
          label="Date Field"
          min="2023-01-01"
          max="2023-12-31"
        />
      );

      const input = screen.getByLabelText('Date Field');
      expect(input).toHaveAttribute('min', '2023-01-01');
      expect(input).toHaveAttribute('max', '2023-12-31');
    });
  });

  describe('SelectField', () => {
    const options = [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' },
      { value: 'option3', label: 'Option 3', disabled: true },
    ];

    it('should render select field with options', () => {
      render(
        <SelectField name="select" label="Select Field" options={options} />
      );

      expect(screen.getByText('Select Field')).toBeInTheDocument();
      expect(screen.getByRole('combobox')).toBeInTheDocument();
      expect(screen.getByText('Option 1')).toBeInTheDocument();
      expect(screen.getByText('Option 2')).toBeInTheDocument();
      expect(screen.getByText('Option 3')).toBeInTheDocument();
    });

    it('should render default placeholder option', () => {
      render(
        <SelectField name="select" label="Select Field" options={options} />
      );

      expect(screen.getByText('選択してください')).toBeInTheDocument();
    });

    it('should disable options when specified', () => {
      render(
        <SelectField name="select" label="Select Field" options={options} />
      );

      const option3 = screen.getByRole('option', { name: 'Option 3' });
      expect(option3).toBeDisabled();
    });

    it('should apply error styles when error exists', () => {
      render(
        <SelectField
          name="select"
          label="Select Field"
          options={options}
          error="Error message"
        />
      );

      const select = screen.getByRole('combobox');
      expect(select).toHaveClass('border-red-500');
    });
  });
});
