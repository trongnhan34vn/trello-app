import clsx from 'clsx';
import { DayPicker } from 'react-day-picker';
import { Controller, useFormContext } from 'react-hook-form';
import FormErrorMessage from './FormErrorMessage';

export enum DayPickerMode {
  RANGE = 'range',
  MULTIPLE = 'multiple',
  SINGLE = 'single',
}


interface IProps {
  containerClassName?: string;
  label?: string;
  rules?: any;
  name: string;
  mode: DayPickerMode;
}
const DatePickerField = ({ containerClassName, label, rules, name, mode }: IProps) => {
  const { control } = useFormContext();

  return (
    <div className={clsx('mb-4', containerClassName)}>
      {label && (
        <label htmlFor="" className="text-white text-sm mb-1 block font-semibold">
          {label} {rules?.required && <span className="text-red-500">*</span>}
        </label>
      )}
      <Controller
        control={control}
        rules={rules}
        name={name}
        render={({ field: { onChange, value }, fieldState: { error } }) => {
          return (
            <>
              <DayPicker
                className="w-full"
                mode={mode as any}
                selected={value}
                onSelect={onChange}
              />

              <FormErrorMessage message={error?.message || ''} />
            </>
          );
        }}
      />
    </div>
  );
};

export default DatePickerField;
