import { Textarea } from '@headlessui/react';
import { clsx } from 'clsx';
import { Controller, useFormContext } from 'react-hook-form';
import FormErrorMessage from './FormErrorMessage';

interface IProps {
  label?: string;
  rules?: any;
  name: string;
  placeholder?: string;
  rows?: number
}
const TextAreaField = ({ label, name, rules, placeholder, rows = 3 }: IProps) => {
  const { control } = useFormContext();
  return (
    <div className="mb-4">
      {label && (
        <label htmlFor="" className="text-white text-sm mb-1 block font-semibold">
          {label} {rules?.required && <span className="text-red-500">*</span>}
        </label>
      )}
      <Controller
        control={control}
        rules={rules}
        name={name}
        render={({ field: { onBlur, onChange, value }, fieldState: { error } }) => {
          return (
            <>
              <Textarea
                placeholder={placeholder}
                value={value}
                onBlur={onBlur}
                onChange={onChange}
                className={clsx(
                  'block w-full resize-none rounded-lg border-none bg-white/5 px-3 py-1.5 text-sm/6 text-white',
                  'focus:not-data-focus:outline-none data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-white/25',
                )}
                rows={rows}
              />
              <FormErrorMessage message={error?.message || ''} />
            </>
          );
        }}
      />
    </div>
  );
};

export default TextAreaField;
