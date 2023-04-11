import { FormikProps } from 'formik';
import {
  Box,
  Typography,
  Tooltip,
  TextField,
  MenuItem,
  Autocomplete,
  FormControl,
  Chip,
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ArtistCategory, ArtStyleTags } from '@/context';
import { FormData, formStepSections } from '@/definitions';
import { FormTextField, ArtistUpload } from '..';
import { activeStepContainer, dateContainer } from '@/styles';

/** Form Step 1 */
export const ArtFormDetails = ({
  formik,
}: {
  formik: FormikProps<FormData>;
}) => {
  const { values, errors, touched, handleChange, handleBlur } = formik;
  return (
    <Box key={formStepSections[1]} sx={activeStepContainer}>
      <Typography color="primary" variant="h5">
        Artwork Details
      </Typography>
      <FormTextField fieldKey="category" formik={formik} step={1}>
        {Object.values(ArtistCategory).map((category) => (
          <MenuItem key={category} value={category}>
            {category}
          </MenuItem>
        ))}
      </FormTextField>
      <Autocomplete
        multiple
        freeSolo
        options={Array.from(new Set(ArtStyleTags)).sort()} //make sure its unique and alphabetise
        value={formik.values.tags}
        fullWidth
        onChange={(event, newValue) => {
          if (newValue.length < 5) {
            formik.setFieldValue('tags', newValue);
          }
        }}
        renderTags={(tagValue, getTagProps) =>
          tagValue.map((option, index) => (
            <Chip
              color="primary"
              {...getTagProps({ index })}
              label={option}
              onDelete={() =>
                formik.setFieldValue(
                  'tags',
                  values.tags.filter((tag) => tag !== option)
                )
              }
              key={option}
            />
          ))
        }
        renderInput={(params) => (
          <Tooltip
            title="Enter up to 4 tags that describe your art style"
            placement="top-start"
            // arrow
          >
            <TextField
              {...params}
              variant="outlined"
              label="Tags"
              required
              placeholder={
                values.tags.length >= 4
                  ? 'Only 4 tags allowable'
                  : 'Select or type in artwork style tags'
              }
              onKeyPress={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  if (values.tags.length < 5) {
                    let e = event.target as HTMLInputElement;
                    let newTag = e.value;
                    if (!values.tags.includes(newTag) && newTag.trim() !== '') {
                      formik.setFieldValue('tags', [
                        ...values.tags,
                        newTag.trim(),
                      ]);
                    }
                  }
                }
              }}
              disabled={values.tags.length >= 4}
            />
          </Tooltip>
        )}
      />
      {/* <FormTextField fieldKey="style" formik={formik} step={1} /> */}

      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Tooltip
          title="Enter artwork creation dates eg. 1981 - 2020. Leave end date blank if still creating"
          placement="top-start"
          // arrow
        >
          <Box
            sx={{
              width: '80%',
              display: 'flex',
            }}
          >
            <Box sx={dateContainer}>
              {/* TODO: will need to validate this has been touched */}
              <FormControl
                error={true}
                required
                fullWidth
                sx={{
                  '& .MuiFormControl-root': {
                    width: '98%',
                    marginLeft: 0,
                  },
                  padding: '3px 0',
                }}
              >
                <DatePicker
                  label="Period Start *"
                  views={['year']}
                  openTo="year"
                  format="yyyy"
                  disableFuture
                  minDate={new Date(1200, 0, 1)}
                  maxDate={new Date()}
                  value={values.periodStart} // || new Date(1900, 0, 1)}
                  onError={(err) => {
                    console.log('error', err);
                    //should update
                    formik.validateField('periodStart');
                  }}
                  onChange={(newValue, errContext) => {
                    formik.handleChange({
                      target: {
                        name: 'periodStart',
                        value: newValue,
                      },
                    });
                    formik.handleBlur({
                      target: {
                        name: 'periodStart',
                      },
                    });
                  }}
                  slotProps={{
                    textField: {
                      helperText:
                        formik.touched.periodStart &&
                        Boolean(formik.errors.periodStart) &&
                        String(formik.errors.periodStart),
                      // : 'Select a valid Date',
                    },
                  }}
                />
              </FormControl>
              {/*probably better? OR useField gah. <FormControlLabel
                    id="trainingConsent"
                    name="trainingConsent"
                    value="trainingConsent" */}
              <FormControl
                error={true}
                fullWidth
                required
                sx={{
                  '& .MuiFormControl-root': {
                    width: '98%',
                    marginRight: 0,
                  },
                  padding: '3px 0',
                }}
              >
                <DatePicker
                  label="Period End"
                  views={['year']}
                  openTo="year"
                  format="yyyy"
                  disableFuture
                  minDate={new Date(1200, 0, 1)}
                  maxDate={new Date()}
                  value={values.periodEnd} // || new Date(1900, 0, 1)}
                  onError={(err) => {
                    console.log('error', err);
                    formik.validateField('periodStart');
                    //should update
                  }}
                  onChange={(newValue, errContext) => {
                    formik.handleChange({
                      target: {
                        name: 'periodEnd',
                        value: newValue,
                      },
                    });
                    formik.handleBlur({
                      target: {
                        name: 'periodEnd',
                      },
                    });
                  }}
                  slotProps={{
                    textField: {
                      helperText:
                        formik.touched.periodEnd &&
                        Boolean(formik.errors.periodEnd) &&
                        String(formik.errors.periodEnd),
                      // : 'Select a valid Date',
                    },
                  }}
                />
              </FormControl>
            </Box>
          </Box>
        </Tooltip>
      </LocalizationProvider>
      <FormTextField fieldKey="portfolio" formik={formik} step={1} />
      <Typography color="primary" variant="h5" sx={{ padding: '1rem' }}>
        Display Images
      </Typography>
      <Tooltip
        title="Artwork is displayed in a 3:2 aspect ratio frame as shown in the preview below. For example a 900px x 600px image has a 3:2 ratio. These images are watermarked before being saved for display on the site and your metadata saved on each."
        placement="top-start"
      >
        <Box sx={{ width: '80%' }}>
          <ArtistUpload maxFiles={5} formik={formik} name="thumbnails" />
        </Box>
      </Tooltip>
    </Box>
  );
};
