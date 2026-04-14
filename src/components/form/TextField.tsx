import React from "react";
import {
  Controller,
  useFormContext,
  type RegisterOptions,
} from "react-hook-form";
import Input from "../Input";
import FormErrorMessage from "./FormErrorMessage";

interface IProps {
  label?: string;
  placeholder?: string;
  type?: React.HTMLInputTypeAttribute;
  rules?: RegisterOptions;
  name: string;
  hidden?: boolean
}
const TextField = ({
  type,
  placeholder,
  label,
  name,
  rules,
  hidden
}: IProps) => {
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
              <Input
                value={value}
                name={name}
                onBlur={onBlur}
                onChange={onChange}
                className={`${error ? ' border-red-500!' : ''}`}
                type={type}
                hidden={hidden}
                placeholder={placeholder}
              />
              <FormErrorMessage message={error?.message || ""} />
            </>
          );
        }}
      />
    </div>
  );
};

export default TextField;
