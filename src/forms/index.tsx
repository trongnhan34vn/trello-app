import { FormProvider, useForm, type DefaultValues, type FieldValues } from 'react-hook-form';

interface IProps<T extends FieldValues> {
  defaultValues: DefaultValues<T>;
  children: any;
  onSubmit: (data: T, methods?: any) => void;
}

const Form = <T extends FieldValues>({ defaultValues, children, onSubmit }: IProps<T>) => {
  const methods = useForm<T>({
    defaultValues,
  });

  const { handleSubmit } = methods;

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit((data) => onSubmit(data, methods))}>
        {typeof children === 'function' ? children(methods) : children}
      </form>
    </FormProvider>
  );
};


export default Form;
