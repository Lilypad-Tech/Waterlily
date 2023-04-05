import { SxProps } from '@mui/material';
import { CSSProperties } from 'react';

export const container: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  paddingBottom: '2rem',
};

export const description: CSSProperties = {
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: '1rem',
};

export const formikContainer: SxProps = {
  '& .MuiTextField-root': { m: 1, width: '80%' },
  padding: '2rem',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
};

export const stepperContainer: CSSProperties = {
  padding: '2rem 1rem 4rem 1rem',
  width: '80%',
  alignSelf: 'center',
};

export const biographyStartAdornment: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  marginRight: '2rem',
};

export const biographyIcon: CSSProperties = {
  position: 'absolute',
  top: '1rem',
  color: 'rgba(255, 255, 255, 0.7)',
};

export const biographyEndAdornment: CSSProperties = {
  fontSize: '12px',
  position: 'absolute',
  bottom: '0.1rem',
  right: '0.6rem',
};

export const uploadContainer: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

export const activeStepContainer: CSSProperties = {
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
};

export const iconStyle: CSSProperties = { color: 'rgba(255, 255, 255, 0.7)' };

export const dateContainer: SxProps = {
  display: 'flex',
  flexDirection: 'row',
  width: '100%',
  // justifyContent: 'space-between',
};

export const checkContainer: CSSProperties = {
  width: '80%',
  justifyContent: 'space-between',
  // paddingTop: '1rem',
};

export const stepButtonWrapper: CSSProperties = {
  width: '100%',
  padding: '1rem',
  display: 'flex',
  justifyContent: 'center',
};

export const stepButtonContainer: SxProps = {
  display: 'flex',
  flexDirection: 'row',
  pt: 2,
  width: '80%',
  justifyContent: 'space-between',
};
