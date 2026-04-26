import { useMemo } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import AsyncSelect from 'react-select/async';
import type { Option } from '../../types/select.type';
import FormErrorMessage from './FormErrorMessage';
import { debounce } from 'lodash';

const DEBOUNCE_MS = 500;

interface IProps {
  options: (inputValue: string) => Promise<Option[]>;
  label?: string;
  rules?: any;
  name: string;
  isSearchable?: boolean;
  isMulti?: boolean;
  placeholder?: string;
}
const SelectField = ({
  options,
  label,
  rules,
  name,
  isSearchable,
  isMulti,
  placeholder,
}: IProps) => {
  const { control } = useFormContext();

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
    <div className="mb-5">
      {label && (
        <label htmlFor={name} className="text-sm text-white mb-1 block font-semibold">
          {label} {rules?.required && <span className="text-red-500">*</span>}
        </label>
      )}

      <Controller
        control={control}
        rules={rules}
        render={({ field: { onBlur, onChange, value }, fieldState: { error } }) => {
          return (
            <>
              <AsyncSelect
                menuPortalTarget={document.body}
                classNamePrefix="react-select"
                defaultOptions
                isMulti={isMulti}
                isSearchable={isSearchable}
                inputId={name}
                name={name}
                defaultValue={value}
                placeholder={placeholder}
                onBlur={onBlur}
                onChange={(val) => {
                  onChange(val);
                }}
                loadOptions={loadOptions}
                value={value}
                styles={{
                  menuPortal: (base) => ({ ...base, zIndex: 99999 }),
                  container: (base) => ({ ...base, width: '100%' }),
                  control: (base, state) => ({
                    ...base,
                    width: '100%',
                    minHeight: '44px',
                    backgroundColor: 'rgb(255 255 255 / 0.05)',
                    borderRadius: '0.5rem',
                    borderWidth: '2px',
                    borderStyle: 'solid',
                    borderColor: error
                      ? 'var(--color-error)'
                      : state.isFocused
                        ? '#FFFFFF40'
                        : 'transparent',
                    boxShadow: 'none',
                    transition: 'all 200ms ease-in',
                    ':hover': {
                      borderColor: error ? 'var(--color-error)' : '#FFFFFF40',
                    },
                  }),
                  valueContainer: (base) => ({
                    ...base,
                    padding: '0.25rem 0.75rem',
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
                  dropdownIndicator: (base, state) => ({
                    ...base,
                    padding: '0.5rem',
                    color: state.isFocused ? '#FFFFFF' : 'rgb(255 255 255 / 0.6)',
                    ':hover': { color: '#FFFFFF' },
                  }),
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
              <FormErrorMessage message={error?.message || ''} />
            </>
          );
        }}
        name={name}
      />
    </div>
  );
};

export default SelectField;
