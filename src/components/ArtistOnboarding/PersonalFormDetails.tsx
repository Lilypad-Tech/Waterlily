import { useContext } from 'react';
import { FormikProps } from 'formik';
import { FormData } from '@/definitions';
import {
  Box,
  Typography,
  Tooltip,
  TextField,
  InputAdornment,
} from '@mui/material';
import { WalletOutlined, DescriptionOutlined } from '@mui/icons-material';
import { defaultWalletState, WalletContext } from '@/context';
import { formStepSections } from '@/definitions';
import { FormTextField, ArtistUpload } from '..';
import {
  iconStyle,
  biographyStartAdornment,
  biographyEndAdornment,
  biographyIcon,
  uploadContainer,
} from '@/styles';

/** Form Step 0 */
export const PersonalFormDetails = ({
  formik,
}: {
  formik: FormikProps<FormData>;
}) => {
  const { values, errors, touched, handleChange, handleBlur } = formik;
  const { walletState = defaultWalletState.walletState } =
    useContext(WalletContext);
  console.log('values', values);
  return (
    <Box key={formStepSections[0]}>
      {/* most of these fields the same. Just map it */}
      <Typography color="primary" variant="h5">
        Personal Details
      </Typography>
      <FormTextField fieldKey="name" formik={formik} step={0} />
      <FormTextField fieldKey="email" formik={formik} step={0} />
      {/* TODO: turn into dependent - can choose charity instead + better validation */}
      <Tooltip
        title="The address payments will be sent to. Must be an f4 ethereum address"
        placement="top-start"
      >
        <TextField
          id="walletAddress"
          name="walletAddress"
          label="Wallet Address"
          variant="outlined"
          required
          fullWidth
          value={(values.walletAddress = walletState.accounts[0])} //values.walletAddress} // = walletState.accounts[0] || '')}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.walletAddress && Boolean(errors.walletAddress)}
          helperText={touched.walletAddress && errors.walletAddress}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <WalletOutlined sx={iconStyle} />
              </InputAdornment>
            ),
          }}
        />
      </Tooltip>
      <FormTextField fieldKey="nationality" formik={formik} step={0} />
      <Tooltip
        title="Tell us about yourself and your art!"
        placement="top-start"
      >
        <TextField
          id="biography"
          name="biography"
          label="Biography"
          placeholder="Your biography"
          variant="outlined"
          required
          fullWidth
          multiline
          minRows={3}
          value={values.biography}
          onBlur={handleBlur}
          onChange={handleChange}
          error={touched.biography && Boolean(errors.biography)}
          helperText={touched.biography && errors.biography}
          InputProps={{
            startAdornment: (
              <Box sx={biographyStartAdornment}>
                <DescriptionOutlined sx={biographyIcon} />
              </Box>
            ),
            endAdornment: (
              <Box sx={biographyEndAdornment}>
                {formik.values.biography.length}/350
              </Box>
            ),
          }}
          inputProps={{
            maxLength: 350,
          }}
        />
      </Tooltip>
      <Box sx={uploadContainer}>
        {/* TODO: add error handling & fix this */}
        <Box sx={{ width: '80%' }}>
          <ArtistUpload maxFiles={1} formik={formik} name="avatar" />
        </Box>
      </Box>
    </Box>
  );
};
