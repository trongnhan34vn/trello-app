import clsx from 'clsx';
import { Controller, useFormContext } from 'react-hook-form';
import TextEditor from '../TextEditor';
import FormErrorMessage from './FormErrorMessage';

interface IProps {
  label?: string;
  name: string;
  rules?: any;
  containerClassName?: string;
}
const TextEditorField = ({ name, label, rules, containerClassName }: IProps) => {
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
              <TextEditor value={value} onChange={onChange} />
              <FormErrorMessage message={error?.message || ''} />
            </>
          );
        }}
      />
    </div>
  );
};

export default TextEditorField;
