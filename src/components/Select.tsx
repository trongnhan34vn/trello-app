import debounce from 'lodash/debounce';
import { useMemo, type ReactNode } from 'react';
import AsyncSelect from 'react-select/async';
import type { Option } from '../types/select.type';
import { clsx } from 'clsx';

const DEBOUNCE_MS = 500;
interface IProps {
  options: (inputValue: string) => Promise<Option[]>;
  label?: string;
  rules?: any;
  name: string;
  isSearchable?: boolean;
  isMulti?: boolean;
  placeholder?: string;
  value?: any;
  defaultValue?: any;
  onChange?: (value: any) => void;
  disabled?: boolean;
  containerClassName?: string;
  isHiddenDropdownIcon?: boolean;
  startIcon?: ReactNode
}
const Select = ({
  options,
  name,
  isSearchable,
  defaultValue,
  isMulti,
  placeholder,
  onChange,
  value,
  disabled,
  containerClassName,
  isHiddenDropdownIcon,
  startIcon,
}: IProps) => {
  const loadOptions = useMemo(() => {
    const debounced = debounce((inputValue: string, resolve: (opts: Option[]) => void) => {
      options(inputValue)
        .then(resolve)
        .catch(() => resolve([]));
    }, DEBOUNCE_MS);
    return (inputValue: string) =>
      new Promise<Option[]>((resolve) => {
        debounced(inputValue, resolve);
      });
  }, [options]);
  return (
    <div className={clsx(disabled && 'cursor-not-allowed', containerClassName, 'relative')}>
      {startIcon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10">
          {startIcon}
        </div>
      )}
      <AsyncSelect
        isDisabled={disabled}
        menuPortalTarget={document.body}
        classNamePrefix="react-select"
        defaultOptions
        isMulti={isMulti}
        isSearchable={isSearchable}
        inputId={name}
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        onChange={(val) => {
          onChange?.(val);
        }}
        loadOptions={loadOptions}
        value={value}
        styles={{
          menuPortal: (base) => ({ ...base, zIndex: 20 }),
          container: (base) => ({ ...base, width: '100%' }),
          control: (base, state) => ({
            ...base,
            width: '100%',
            minHeight: '44px',
            backgroundColor: 'rgb(255 255 255 / 0.05)',
            borderRadius: '0.5rem',
            borderWidth: '2px',
            borderStyle: 'solid',
            borderColor: state.isFocused ? '#FFFFFF40' : 'transparent',
            boxShadow: 'none',
            transition: 'all 200ms ease-in',
            ':hover': {
              borderColor: '#FFFFFF40',
            },
          }),
          valueContainer: (base) => ({
            ...base,
            padding: startIcon ? '0.25rem 0.75rem 0.25rem 2.5rem' : '0.25rem 0.75rem',
          }),
          input: (base) => ({
            ...base,
            margin: 0,
            padding: 0,
            color: '#FFFFFF',
            fontSize: '0.875rem',
          }),
          placeholder: (base) => ({
            ...base,
            color: 'rgb(255 255 255 / 0.6)',
            fontSize: '0.875rem',
          }),
          singleValue: (base) => ({
            ...base,
            color: '#FFFFFF',
            fontSize: '0.875rem',
          }),
          multiValue: (base) => ({
            ...base,
            backgroundColor: 'rgb(255 255 255 / 0.1)',
            borderRadius: '0.25rem',
          }),
          multiValueLabel: (base) => ({
            ...base,
            color: '#FFFFFF',
            fontSize: '0.75rem',
          }),
          multiValueRemove: (base) => ({
            ...base,
            color: 'rgb(255 255 255 / 0.7)',
            ':hover': {
              backgroundColor: 'transparent',
              color: '#FFFFFF',
            },
          }),
          indicatorSeparator: (base) => ({ ...base, display: 'none' }),
          dropdownIndicator: (base, state) =>
            isHiddenDropdownIcon
              ? { display: 'none' }
              : {
                ...base,
                padding: '0.5rem',
                color: state.isFocused ? '#FFFFFF' : 'rgb(255 255 255 / 0.6)',
                ':hover': { color: '#FFFFFF' },
              },
          clearIndicator: (base) => ({
            ...base,
            padding: '0.5rem',
            color: 'rgb(255 255 255 / 0.6)',
            ':hover': { color: '#FFFFFF' },
          }),
          menu: (base) => ({
            ...base,
            backgroundColor: 'var(--color-bg-tertiary)',
            border: `1px solid #FFFFFF40`,
            overflow: 'hidden',
            zIndex: 50,
          }),
          menuList: (base) => ({ ...base, padding: 4 }),
          option: (base, state) => ({
            ...base,
            fontSize: '0.875rem',
            borderRadius: '0.25rem',
            backgroundColor: state.isSelected
              ? 'var(--color-bg-secondary)'
              : state.isFocused
                ? 'var(--color-bg-card)'
                : 'transparent',
            color: 'var(--color-text-primary)',
            cursor: 'pointer',
            ':active': { backgroundColor: 'var(--color-bg-secondary)' },
          }),
        }}
      />
    </div>
  );
};

export default Select;
