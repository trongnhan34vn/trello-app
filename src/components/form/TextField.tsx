import React, { type ReactNode } from "react";
import {
  Controller,
  useFormContext,
  type RegisterOptions,
} from "react-hook-form";
import Input from "../Input";
import FormErrorMessage from "./FormErrorMessage";
import clsx from "clsx";

interface IProps {
  label?: string | ReactNode;
  placeholder?: string;
  type?: React.HTMLInputTypeAttribute;
  rules?: RegisterOptions;
  name: string;
  hidden?: boolean;
  containerClassName?: string;
  disabled?: boolean
}
const TextField = ({
  type,
  placeholder,
  label,
  name,
  rules,
  hidden,
  containerClassName,
  disabled
}: IProps) => {
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
        render={({ field: { onBlur, onChange, value }, fieldState: { error } }) => {
          return (
            <>
              <Input
                disabled={disabled}
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
