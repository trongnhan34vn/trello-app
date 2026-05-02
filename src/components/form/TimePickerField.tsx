import { TimePicker } from 'antd';
import { Controller, useFormContext } from 'react-hook-form';
import FormErrorMessage from './FormErrorMessage';
import clsx from 'clsx';
import dayjs from 'dayjs';

interface IProps {
  containerClassName?: string;
  label?: string;
  rules?: any;
  name: string;
  hasDisplayError?: boolean;
}

const TimePickerField = ({ containerClassName, label, rules, name, hasDisplayError = true }: IProps) => {
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
            <div className="w-full">
              <TimePicker
                value={value ? dayjs(value, 'HH:mm') : null}
                onChange={(_, timeString) => onChange(timeString)}
                format="HH:mm"
                allowClear={false}
                placeholder="00:00"
                className="w-full min-h-11"
              />
              {hasDisplayError && <FormErrorMessage message={error?.message || ''} />}
            </div>
          );
        }}
      />
    </div>
  );
};

export default TimePickerField;
