import { FC, ReactElement } from 'react';
import { Box } from '@mui/material';
import { Images } from '@/assets';
import Image from 'next/image';

const { src, alt } = Images.logoHorizontal;

type ParrotLoaderProps = {
  
};

export const ParrotLoader: FC<ParrotLoaderProps> = (): ReactElement => {
  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      m: 1,
      pt: 2,
      pb: 2,
    }}>
      <Box sx={{ ml: 2, mr: 2 }}>
        <Image src={Images.parrotIn.src} alt={Images.parrotIn.alt} height={40} />
      </Box>
      <Box sx={{ ml: 2, mr: 2 }}>
        <Image src={Images.logoHorizontal.src} alt={Images.logoHorizontal.alt} height={40} />
      </Box>
      <Box sx={{ ml: 2, mr: 2 }}>
        <Image src={Images.parrotOut.src} alt={Images.parrotOut.alt} height={40} />
      </Box>   
    </Box>
  )
};
