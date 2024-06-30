import { ReactNode } from 'react';
import {
  FieldValues,
  FormProvider as RHFormProvider,
  UseFormReturn,
} from 'react-hook-form';

interface FormProps<T extends FieldValues> {
  children: ReactNode;
  onSubmit?: () => void;
  methods: UseFormReturn<T>;
  style?: Record<string, any>;
}

function FormProvider<T extends FieldValues>({
  children,
  onSubmit,
  methods,
  style,
}: FormProps<T>) {
  return (
    <RHFormProvider {...methods}>
      <form onSubmit={onSubmit} style={style}>
        {children}
      </form>
    </RHFormProvider>
  );
}

export default FormProvider;
