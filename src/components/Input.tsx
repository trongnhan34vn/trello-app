import clsx from 'clsx';
import React, { type ReactNode } from 'react';

interface Props {
  name: string;
  value?: string;
  className?: string;
  onChange?: (e: React.InputHTMLAttributes<HTMLInputElement>) => void;
  onBlur?: () => void;
  disabled?: boolean;
  placeholder?: string;
  type?: React.HTMLInputTypeAttribute;
  hidden?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}
const Input = ({
  name,
  value,
  className,
  onBlur,
  onChange,
  disabled,
  placeholder,
  type = 'text',
  hidden,
  leftIcon,
  rightIcon,
}: Props) => {
  return (
    <div className="relative w-full">
      {/* icon left */}
      {leftIcon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60">{leftIcon}</div>
      )}

      <input
        type={type}
        name={name}
        hidden={hidden}
        disabled={disabled}
        onChange={onChange}
        onBlur={onBlur}
        value={value}
        placeholder={placeholder}
        className={clsx(
          'mt-1 block w-full rounded-lg border-2 border-transparent bg-white/5 py-2 text-sm/6 text-white transition-all duration-200 ease-in',
          'focus:not-data-focus:outline-none focus:border-white/25 data-focus:outline-2 data-focus:-outline-offset-2 hover:border-white/25 data-focus:outline-white/25',
          leftIcon ? 'pl-10' : 'pl-3',
          rightIcon ? 'pr-10' : 'pr-3',
          className,
          disabled ? 'cursor-not-allowed bg-gray-200' : '',
        )}
      />

      {/* icon right */}
      {rightIcon && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60">{rightIcon}</div>
      )}
    </div>
  );
};

export default Input;
