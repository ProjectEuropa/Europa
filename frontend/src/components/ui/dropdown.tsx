'use client';

import type React from 'react';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface DropdownContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onOpenChange?: (open: boolean) => void;
}

const DropdownContext = createContext<DropdownContextType | undefined>(
  undefined
);

const useDropdownContext = () => {
  const context = useContext(DropdownContext);
  if (!context) {
    throw new Error('Dropdown components must be used within a Dropdown');
  }
  return context;
};

interface DropdownProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

export function Dropdown({
  children,
  open,
  onOpenChange,
  className,
}: DropdownProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;

  const setIsOpen = (newOpen: boolean) => {
    if (!isControlled) {
      setInternalOpen(newOpen);
    }
    onOpenChange?.(newOpen);
  };

  const dropdownRef = useRef<HTMLDivElement>(null);

  // クリック外でメニューを閉じる
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, setIsOpen]);

  // Escapeキーでメニューを閉じる
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, setIsOpen]);

  return (
    <DropdownContext.Provider value={{ isOpen, setIsOpen, onOpenChange }}>
      <div ref={dropdownRef} className={cn('relative', className)}>
        {children}
      </div>
    </DropdownContext.Provider>
  );
}

interface DropdownTriggerProps {
  children: React.ReactNode;
  className?: string;
}

export function DropdownTrigger({ children, className }: DropdownTriggerProps) {
  const { isOpen, setIsOpen } = useDropdownContext();

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setIsOpen(!isOpen);
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={className}
      aria-expanded={isOpen}
      aria-haspopup="true"
    >
      {children}
    </div>
  );
}

interface DropdownContentProps {
  children: React.ReactNode;
  className?: string;
}

export function DropdownContent({ children, className }: DropdownContentProps) {
  const { isOpen } = useDropdownContext();

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className={cn(
        'absolute top-full left-0 z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md',
        className
      )}
      role="menu"
    >
      {children}
    </div>
  );
}

interface DropdownItemProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export function DropdownItem({
  children,
  onClick,
  disabled = false,
  className,
}: DropdownItemProps) {
  const { setIsOpen } = useDropdownContext();

  const handleClick = () => {
    if (!disabled && onClick) {
      onClick();
      setIsOpen(false);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if ((event.key === 'Enter' || event.key === ' ') && !disabled) {
      event.preventDefault();
      handleClick();
    }
  };

  return (
    <div
      role="menuitem"
      tabIndex={disabled ? -1 : 0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={cn(
        'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors',
        disabled
          ? 'pointer-events-none opacity-50'
          : 'focus:bg-accent focus:text-accent-foreground hover:bg-accent hover:text-accent-foreground',
        className
      )}
      aria-disabled={disabled}
    >
      {children}
    </div>
  );
}
