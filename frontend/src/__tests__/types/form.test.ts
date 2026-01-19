import { describe, expect, it } from 'vitest';
import type {
  DateInputProps,
  FileInputProps,
  FormFieldProps,
  FormState,
  SelectOption,
  ValidationError,
} from '@/types/form';

describe('Form Types', () => {
  describe('FormState', () => {
    it('should represent form state with generic data type', () => {
      interface UserFormData {
        name: string;
        email: string;
        age: number;
      }

      const formState: FormState<UserFormData> = {
        data: {
          name: 'John Doe',
          email: 'john@example.com',
          age: 30,
        },
        errors: {
          email: 'Invalid email format',
        },
        isSubmitting: false,
        isValid: false,
      };

      expect(formState.data.name).toBe('John Doe');
      expect(formState.data.email).toBe('john@example.com');
      expect(formState.data.age).toBe(30);
      expect(formState.errors.email).toBe('Invalid email format');
      expect(formState.isSubmitting).toBe(false);
      expect(formState.isValid).toBe(false);
    });

    it('should work with any data type when no generic is specified', () => {
      const formState: FormState<{ anything: string }> = {
        data: { anything: 'goes here' },
        errors: {},
        isSubmitting: true,
        isValid: true,
      };

      expect(formState.data.anything).toBe('goes here');
      expect(formState.isSubmitting).toBe(true);
      expect(formState.isValid).toBe(true);
    });

    it('should handle empty errors object', () => {
      const formState: FormState<{ name: string }> = {
        data: { name: 'Test' },
        errors: {},
        isSubmitting: false,
        isValid: true,
      };

      expect(Object.keys(formState.errors)).toHaveLength(0);
      expect(formState.isValid).toBe(true);
    });
  });

  describe('ValidationError', () => {
    it('should contain field and message', () => {
      const validationError: ValidationError = {
        field: 'email',
        message: 'Email is required',
      };

      expect(validationError.field).toBe('email');
      expect(validationError.message).toBe('Email is required');
    });

    it('should work with different field names and messages', () => {
      const errors: ValidationError[] = [
        {
          field: 'password',
          message: 'Password must be at least 8 characters',
        },
        { field: 'confirmPassword', message: 'Passwords do not match' },
      ];

      expect(errors).toHaveLength(2);
      expect(errors[0].field).toBe('password');
      expect(errors[1].field).toBe('confirmPassword');
    });
  });

  describe('FormFieldProps', () => {
    it('should contain required field properties', () => {
      const fieldProps: FormFieldProps = {
        name: 'username',
        label: 'Username',
        placeholder: 'Enter your username',
        required: true,
        disabled: false,
        error: 'Username is already taken',
      };

      expect(fieldProps.name).toBe('username');
      expect(fieldProps.label).toBe('Username');
      expect(fieldProps.placeholder).toBe('Enter your username');
      expect(fieldProps.required).toBe(true);
      expect(fieldProps.disabled).toBe(false);
      expect(fieldProps.error).toBe('Username is already taken');
    });

    it('should work with minimal required properties', () => {
      const fieldProps: FormFieldProps = {
        name: 'email',
        label: 'Email Address',
      };

      expect(fieldProps.name).toBe('email');
      expect(fieldProps.label).toBe('Email Address');
      expect(fieldProps.placeholder).toBeUndefined();
      expect(fieldProps.required).toBeUndefined();
      expect(fieldProps.disabled).toBeUndefined();
      expect(fieldProps.error).toBeUndefined();
    });
  });

  describe('SelectOption', () => {
    it('should contain value and label', () => {
      const option: SelectOption = {
        value: 'option1',
        label: 'Option 1',
        disabled: false,
      };

      expect(option.value).toBe('option1');
      expect(option.label).toBe('Option 1');
      expect(option.disabled).toBe(false);
    });

    it('should work without disabled property', () => {
      const option: SelectOption = {
        value: 'option2',
        label: 'Option 2',
      };

      expect(option.value).toBe('option2');
      expect(option.label).toBe('Option 2');
      expect(option.disabled).toBeUndefined();
    });

    it('should work with array of options', () => {
      const options: SelectOption[] = [
        { value: 'red', label: 'Red' },
        { value: 'green', label: 'Green' },
        { value: 'blue', label: 'Blue', disabled: true },
      ];

      expect(options).toHaveLength(3);
      expect(options[0].value).toBe('red');
      expect(options[2].disabled).toBe(true);
    });
  });

  describe('FileInputProps', () => {
    it('should extend FormFieldProps without placeholder', () => {
      const fileInputProps: FileInputProps = {
        name: 'avatar',
        label: 'Profile Picture',
        required: true,
        accept: 'image/*',
        multiple: false,
        maxSize: 5242880, // 5MB
      };

      expect(fileInputProps.name).toBe('avatar');
      expect(fileInputProps.label).toBe('Profile Picture');
      expect(fileInputProps.required).toBe(true);
      expect(fileInputProps.accept).toBe('image/*');
      expect(fileInputProps.multiple).toBe(false);
      expect(fileInputProps.maxSize).toBe(5242880);
      // placeholder should not be available
      expect('placeholder' in fileInputProps).toBe(false);
    });

    it('should work with minimal properties', () => {
      const fileInputProps: FileInputProps = {
        name: 'document',
        label: 'Upload Document',
      };

      expect(fileInputProps.name).toBe('document');
      expect(fileInputProps.label).toBe('Upload Document');
      expect(fileInputProps.accept).toBeUndefined();
      expect(fileInputProps.multiple).toBeUndefined();
      expect(fileInputProps.maxSize).toBeUndefined();
    });

    it('should allow multiple file selection', () => {
      const fileInputProps: FileInputProps = {
        name: 'attachments',
        label: 'Attachments',
        multiple: true,
        accept: '.pdf,.doc,.docx',
      };

      expect(fileInputProps.multiple).toBe(true);
      expect(fileInputProps.accept).toBe('.pdf,.doc,.docx');
    });
  });

  describe('DateInputProps', () => {
    it('should extend FormFieldProps with date constraints', () => {
      const dateInputProps: DateInputProps = {
        name: 'birthdate',
        label: 'Birth Date',
        placeholder: 'YYYY-MM-DD',
        required: true,
        min: '1900-01-01',
        max: '2024-12-31',
      };

      expect(dateInputProps.name).toBe('birthdate');
      expect(dateInputProps.label).toBe('Birth Date');
      expect(dateInputProps.placeholder).toBe('YYYY-MM-DD');
      expect(dateInputProps.required).toBe(true);
      expect(dateInputProps.min).toBe('1900-01-01');
      expect(dateInputProps.max).toBe('2024-12-31');
    });

    it('should work without min/max constraints', () => {
      const dateInputProps: DateInputProps = {
        name: 'eventDate',
        label: 'Event Date',
      };

      expect(dateInputProps.name).toBe('eventDate');
      expect(dateInputProps.label).toBe('Event Date');
      expect(dateInputProps.min).toBeUndefined();
      expect(dateInputProps.max).toBeUndefined();
    });

    it('should allow only min or max constraint', () => {
      const futureDate: DateInputProps = {
        name: 'futureEvent',
        label: 'Future Event',
        min: '2024-01-01',
      };

      const pastDate: DateInputProps = {
        name: 'pastEvent',
        label: 'Past Event',
        max: '2023-12-31',
      };

      expect(futureDate.min).toBe('2024-01-01');
      expect(futureDate.max).toBeUndefined();
      expect(pastDate.min).toBeUndefined();
      expect(pastDate.max).toBe('2023-12-31');
    });
  });
});
