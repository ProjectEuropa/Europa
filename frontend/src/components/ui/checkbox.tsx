import { Check } from 'lucide-react';
import type { ComponentPropsWithoutRef } from 'react';
import { forwardRef } from 'react';

import { cn } from '@/lib/utils';

interface CheckboxProps extends Omit<ComponentPropsWithoutRef<'input'>, 'type'> {
  onCheckedChange?: (checked: boolean) => void;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, onCheckedChange, ...props }, ref) => {
    return (
      <div className="relative inline-flex items-center">
        <input
          type="checkbox"
          ref={ref}
          className={cn(
            'peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 checked:bg-primary checked:text-primary-foreground appearance-none',
            className
          )}
          onChange={(e) => onCheckedChange?.(e.target.checked)}
          {...props}
        />
        {props.checked && (
          <Check className="absolute h-3 w-3 text-primary-foreground pointer-events-none left-0.5 top-0.5" />
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export { Checkbox };