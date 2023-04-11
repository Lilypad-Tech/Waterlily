import { SxProps } from '@mui/material';
import { CSSProperties } from 'react';

export const boxStyle: SxProps = {
  display: 'flex',
  justifyContent: 'center',
  padding: '1rem',
};

export const cardStyle: SxProps = {
  width: 300,
  padding: 0,
  margin: 0,
};

export const cardHeaderStyle: SxProps = {
  height: '140px',
  padding: '0.5rem',
  paddingTop: '1.5rem',
};

export const cardMediaContainer: SxProps = {
  height: '255px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  //backgroundColor: '#fff',
  // mb: 1,
};

export const cardMediaStyle: SxProps = {
  '& .MuiCardMedia-img': {
    border: '1px solid #fff',
  }, //not working
  padding: 0,
  margin: 0,
  maxHeight: 200,
  minWidth: 280,
  // borderBottom: '1px solid white',
  pointerEvents: 'none',
};

export const cardMediaContentsStyle: SxProps = {
  // border: '1px solid #fff',
  cursor: 'point',
  position: 'relative',
};

export const modalContainer: SxProps = {
  width: '100%',
  minWidth: 280,
  cursor: 'pointer',
};

export const openModalIconStyle: SxProps = {
  position: 'absolute',
  top: '0.1rem',
  right: '0.2rem',
};

export const stepperStyle: SxProps = {
  width: '100%',
  position: 'relative',
  // top: '-1rem',
  padding: '0 0.2rem',
  background: 'transparent',
  // height: 0,
};

export const cardActionStyle: SxProps = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'flex-end',
  paddingTop: '0.5rem',
};
