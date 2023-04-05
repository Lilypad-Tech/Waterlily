import { ReactNode } from 'react';
import { Formik, FormikProps } from 'formik';
import { Tooltip, TextField, InputAdornment, Box } from '@mui/material';
import {
  DescriptionOutlined,
  EmailOutlined,
  LanguageOutlined,
  PaletteOutlined,
  PermIdentityOutlined,
  PublicOutlined,
} from '@mui/icons-material';
import {
  biographyEndAdornment,
  biographyIcon,
  biographyStartAdornment,
  iconStyle,
} from '@/styles';
import { FormData } from '@/definitions';

enum IconInputType {
  START = 'start',
  END = 'end',
}

interface IconType {
  [IconInputType.START]?: ReactNode;
  [IconInputType.END]?: ReactNode;
}

interface FieldType {
  component: string;
  id: string;
  name: string;
  label: string;
  placeholder?: string;
  inputProps?: IconInputType[];
  icons?: IconType;
  tooltip: string;
  multiline?: boolean;
  minRows?: number;
  required: boolean;
}

type FormValuesType<K extends keyof FormData> = {
  [P in K]?: FieldType;
};

type FormType<K extends keyof FormData> = {
  [key: string]: FormValuesType<K>[];
};

export const artistSignupFields: FormType<keyof FormData> = {
  values0: [
    {
      name: {
        component: 'textfield',
        id: 'name',
        name: 'name',
        label: 'Name',
        required: true,
        inputProps: [IconInputType.START],
        icons: {
          start: (
            <InputAdornment position={'start'}>
              <PermIdentityOutlined sx={iconStyle} />
            </InputAdornment>
          ),
        },
        tooltip: 'Name will be displayed on the website',
      },
      email: {
        component: 'textfield',
        id: 'email',
        name: 'email',
        label: 'Email',
        required: true,
        inputProps: [IconInputType.START],
        icons: {
          start: (
            <InputAdornment position={'start'}>
              <EmailOutlined sx={iconStyle} />
            </InputAdornment>
          ),
        },
        tooltip: 'For Waterlily admin to contact you!',
      },
      nationality: {
        component: 'textfield',
        id: 'nationality',
        name: 'nationality',
        label: 'Nationality/Cultural Heritage',
        required: false,
        inputProps: [IconInputType.START],
        icons: {
          start: (
            <InputAdornment position={'start'}>
              <PublicOutlined sx={iconStyle} />
            </InputAdornment>
          ),
        },
        tooltip: 'Optional. Cultural heritage can be an important influence!',
      },
      biography: {
        component: 'textfield',
        id: 'biography',
        name: 'biography',
        label: 'Biography',
        required: true,
        placeholder: 'Your biography',
        tooltip: 'Tell us about yourself and your art!',
        inputProps: [IconInputType.START, IconInputType.END],
        icons: {
          start: (
            <Box sx={biographyStartAdornment}>
              <DescriptionOutlined sx={biographyIcon} />
            </Box>
          ),
          end: (
            <Box sx={biographyEndAdornment}>
              {/* {formik.values.biography.length} */}
              /350
            </Box>
          ),
        },
      },
    },
  ],
  values1: [
    {
      style: {
        component: 'textfield',
        id: 'style',
        name: 'style',
        label: 'Style',
        required: true,
        inputProps: [IconInputType.START],
        icons: {
          start: (
            <InputAdornment position="start">
              <PaletteOutlined sx={iconStyle} />
            </InputAdornment>
          ),
        },
        tooltip:
          'What is the predominate style of artwork you usually create? 1-2 words',
      },
      portfolio: {
        component: 'textfield',
        id: 'portfolio',
        name: 'portfolio',
        label: 'Portfolio',
        placeholder: 'https://www.waterlily.ai',
        required: true,
        inputProps: [IconInputType.START],
        icons: {
          start: (
            <InputAdornment position="start">
              <LanguageOutlined sx={iconStyle} />
            </InputAdornment>
          ),
        },
        tooltip:
          'What is the predominate style of artwork you usually create? 1-2 words',
      },
    },
  ],
};

export const FormTextField = ({
  fieldKey,
  formik: { values, errors, touched, handleChange, handleBlur },
  step,
}: {
  fieldKey: keyof FormData;
  formik: FormikProps<FormData>;
  step: number;
}) => {
  // const { values, errors, touched, handleChange, handleBlur } = formik;
  let stepKey: string = 'values' + step;
  let data = artistSignupFields[stepKey][0][fieldKey];
  if (!data) {
    return <></>;
  }

  const renderTextField = () => {
    const inputProps: any = {};

    if (data?.inputProps) {
      if (data.inputProps.includes(IconInputType.START)) {
        inputProps.startAdornment = data.icons?.start;
      }

      if (data.inputProps.includes(IconInputType.END)) {
        inputProps.endAdornment = data.icons?.end;
      }
    }
    return (
      <TextField
        id={fieldKey}
        name={fieldKey}
        label={data?.label}
        variant="outlined"
        required={data?.required}
        fullWidth
        multiline={data?.multiline}
        minRows={data?.minRows}
        value={values[fieldKey]}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched[fieldKey] && Boolean(errors[fieldKey])}
        helperText={
          touched[fieldKey] && errors[fieldKey]
            ? String(errors[fieldKey])
            : undefined
        }
        InputProps={inputProps}
      />
    );
  };

  return data.tooltip ? (
    <Tooltip title={data?.tooltip} placement="top-start">
      {renderTextField()}
    </Tooltip>
  ) : (
    renderTextField()
  );
};
