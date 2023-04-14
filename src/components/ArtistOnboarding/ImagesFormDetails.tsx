import { FormikProps } from 'formik';
import {
  Box,
  Typography,
  Tooltip,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import { FormData, formStepSections } from '@/definitions';
import { ArtistUpload } from '..';
import { activeStepContainer, checkContainer } from '@/styles';

/** Form Step 2 */
export const ImagesFormDetails = ({
  formik,
}: {
  formik: FormikProps<FormData>;
}) => {
  const { values, errors, touched, handleChange, handleBlur } = formik;
  return (
    <Box key={formStepSections[2]}>
      <Typography color="primary" variant="h5">
        Upload Art & Verify
      </Typography>
      {/* TODO: refactor to a component */}
      <Box
        sx={{
          ...activeStepContainer,
          paddingTop: '1rem',
        }}
      >
        <Tooltip
          title="These images are ONLY used to train a model. After the model is trained they are removed & permanently deleted from the server. This is completely automated."
          placement="top-start"
        >
          <Box sx={{ width: '80%' }}>
            <ArtistUpload maxFiles={1000} formik={formik} name="images" />
          </Box>
        </Tooltip>
        <FormControlLabel
          id="originalArt"
          name="originalArt"
          value="originalArt"
          control={
            <Checkbox
              checked={Boolean(values.originalArt) || false}
              onChange={handleChange}
              onBlur={handleBlur}
              // error={Boolean(touched.originalArt && errors.originalArt)}
            />
          }
          label="Is your art your own original work?"
          labelPlacement="start"
          sx={{ ...checkContainer, paddingTop: '1rem' }}
        />
        <FormControlLabel
          id="trainingConsent"
          name="trainingConsent"
          value="trainingConsent"
          control={
            <Checkbox
              checked={Boolean(values.trainingConsent) || false}
              onChange={handleChange}
              onBlur={handleBlur}
              // error={touched.trainingConsent && Boolean(errors.trainingConsent)}
            />
          }
          label="Do you consent to having an ML Model trained on your artworks?"
          labelPlacement="start"
          sx={checkContainer}
        />
        <FormControlLabel
          id="legalContent"
          name="legalContent"
          value="legalContent"
          control={
            <Checkbox
              checked={Boolean(values.legalContent) || false}
              onChange={handleChange}
              onBlur={handleBlur}
              // error={touched.legalContent && Boolean(errors.legalContent)}
            />
          }
          label="Is this art legal content?"
          labelPlacement="start"
          sx={checkContainer}
        />
      </Box>
    </Box>
  );
};
