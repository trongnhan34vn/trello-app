import clsx from 'clsx';
import React from 'react';

interface Props {
  name: string;
  value?: string;
  className?: string;
  onChange?: (e: React.InputHTMLAttributes<HTMLInputElement>) => void;
  onBlur?: () => void;
  disabled?: boolean;
  placeholder?: string;
  type?: React.HTMLInputTypeAttribute;
  hidden?: boolean
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
  hidden
}: Props) => {
  return (
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
        'mt-1 block w-full rounded-lg border-2 border-transparent bg-white/5 px-3 py-2 text-sm/6 transition-all duration-200 ease-in text-white',
        'focus:not-data-focus:outline-none focus:border-white/25 data-focus:outline-2 data-focus:-outline-offset-2 hover:border-white/25 data-focus:outline-white/25',
        className,
      )}
    />
  );
};

export default Input;
