import { FC, ReactElement } from 'react';

type FormElement = {
  id: string;
  nam: string;
  label: string;
  placeholder: string;
};

interface FormComponentProps {
  id: string;
  nam: string;
  label: string;
  placeholder: string;
}

export const FormComponent: FC<FormComponentProps> = (): ReactElement => {
  return <div>form element</div>;
};
