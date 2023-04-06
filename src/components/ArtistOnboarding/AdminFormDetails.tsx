import { FormikProps } from 'formik';
import {
  Box,
  FormControlLabel,
  FormControl,
  FormLabel,
  Radio,
  RadioGroup,
} from '@mui/material';
import { FormData } from '@/definitions';
import { ArtistType } from '@/context';

/** Form Step 2 */
export const AdminFormDetails = ({
  formik,
}: {
  formik: FormikProps<FormData>;
}) => {
  const { values, errors, touched, handleChange, handleBlur } = formik;
  console.log('formik artistType', values.artistType);
  return (
    <Box id="admin stuff">
      <FormControl>
        <FormLabel id="artistType">Artist Type</FormLabel>
        <RadioGroup
          row
          aria-labelledby="artistType"
          defaultValue={ArtistType.Private}
          name="artistType"
          id="artistType"
          value={values.artistType}
          onChange={handleChange}
          onBlur={handleBlur}
        >
          <FormControlLabel
            value={ArtistType.Private}
            control={
              <Radio checked={values.artistType === ArtistType.Private} />
            }
            label={ArtistType.Private}
          />
          <FormControlLabel
            value={ArtistType.Public}
            control={
              <Radio checked={values.artistType === ArtistType.Public} />
            }
            label={ArtistType.Public}
          />
        </RadioGroup>
      </FormControl>
    </Box>
  );
};
