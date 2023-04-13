import React, {
  FC,
  ReactElement,
  useMemo,
  createRef,
  CSSProperties,
  useContext,
} from 'react';
import Dropzone from 'react-dropzone';
import {
  Box,
  Button,
  IconButton,
  Typography,
  FormControl,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import { ArtistContext } from '@/context';

const baseStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '20px',
  // borderWidth: 2,
  // borderRadius: 2,
  borderColor: 'rgba(255, 255, 255, 0.23)',
  borderStyle: 'dashed',
  outline: 'none',
  transition: 'border .24s ease-in-out',
  // width: '95%',
  minHeight: '4rem',
};

const focusedStyle = {
  borderColor: '#90caf9',
};

const acceptStyle = {
  borderColor: '#00e676',
};

const rejectStyle = {
  borderColor: '#ff1744',
};

const container: CSSProperties = {
  flex: '1',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '20px',
  borderWidth: '1px',
  borderRadius: '4px',
  borderStyle: 'solid',
  borderColor: 'rgba(255, 255, 255, 0.23)',
  outline: 'none',
  transition: 'border .24s ease-in-out',
};

const thumb: CSSProperties = {
  display: 'inline-flex',
  borderRadius: 2,
  border: '1px solid #eaeaea',
  marginBottom: 1,
  marginRight: 2,
  width: 675 / 3,
  height: 450 / 3,
  padding: 0,
  boxSizing: 'border-box',
  overflow: 'hidden',
};

const thumbInner: CSSProperties = {
  display: 'flex',
  minWidth: '100%',
  overflow: 'hidden',
  justifyContent: 'center',
  position: 'relative',
};

const imgStyle: CSSProperties = {
  display: 'block',
  width: 'auto',
  height: '100%',
  objectFit: 'cover',
  objectPosition: 'center',
};

const iconStyle: CSSProperties = {
  position: 'absolute',
  top: 2,
  right: 2,
  zIndex: 1,
  cursor: 'pointer',
  display: 'block',
  padding: 0,
};

const filenameStyle: CSSProperties = {
  display: 'block',
  padding: 0,
  marginBottom: 1,
  // color: 'white',
};

const aStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  marginTop: 16,
  justifyContent: 'center',
};

const dropText: {
  [key in 'avatar' | 'images' | 'thumbnails']: JSX.Element;
} = {
  images: (
    <Box sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
      <Typography variant="h5" sx={{ paddingBottom: '1rem' }}>
        Drag and drop at least 50 pieces of original artwork here.
      </Typography>
      <Typography variant="subtitle2">
        This art is used ONLY to train the Machine Learning model to understand
        your style.
      </Typography>
      <Typography variant="subtitle2" sx={{ paddingBottom: '1.5rem' }}>
        All uploaded images are automatically deleted after model training is
        complete.
      </Typography>
    </Box>
  ),
  thumbnails: (
    <Box sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
      <Typography variant="h5" sx={{ paddingBottom: '1rem' }}>
        Drag and drop up to 5 examples of your artwork here.
      </Typography>
      <Typography variant="subtitle2">
        Images are displayed on the website as thumbnail examples of your work.
      </Typography>
      <Typography variant="subtitle2" sx={{ paddingBottom: '1.5rem' }}>
        All uploaded thumbnails are automatically{' '}
        <span
          style={{
            fontWeight: 'bolder',
          }}
        >
          watermarked
        </span>{' '}
        with your name.
      </Typography>
    </Box>
  ),
  avatar: (
    <Box sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
      <Typography variant="h5" sx={{ paddingBottom: '1rem' }}>
        Upload an Artist Profile picture
      </Typography>
      <Typography variant="subtitle2" sx={{ paddingBottom: '1.5rem' }}>
        Optional. This is displayed on the home page artist profile.
      </Typography>
    </Box>
  ),
};

interface Props {
  maxFiles: number;
  formik: any;
  name: string;
}

const ArtistPreview: FC<{
  file: any;
  onRemove: () => void;
  name: string;
}> = ({ file, onRemove, name }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: 'fit-contents',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={
          name === 'avatar'
            ? { ...thumb, width: '150px', borderRadius: '50%', marginRight: 0 }
            : thumb
        }
      >
        <Box style={thumbInner}>
          {name !== 'avatar' && (
            <IconButton onClick={onRemove} sx={iconStyle}>
              <CloseIcon />
            </IconButton>
          )}
          <img src={file.preview} style={imgStyle} alt={file.name} />
        </Box>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-evenly',
          paddingBottom: '1rem',
        }}
      >
        <Typography
          sx={{
            ...filenameStyle,
            padding: 0,
            margin: 0,
            marginRight: '16px',
            maxWidth: '225px',
            overflowWrap: 'break-word',
          }}
        >
          {file.path}
        </Typography>
        {name === 'avatar' && (
          <IconButton
            onClick={onRemove}
            sx={{ padding: 0, margin: '0 0 0 1rem' }}
          >
            <DeleteOutlinedIcon />
          </IconButton>
        )}
      </Box>
    </Box>
  );
};

export const ArtistUpload: FC<Props> = ({
  maxFiles,
  formik,
  name,
}: Props): ReactElement => {
  const dropzoneRef: any = createRef();
  const { addWatermark, getBase64 } = useContext(ArtistContext);

  const openDialog = () => {
    // Note that the ref is set async,
    // so it might be null at some point
    if (dropzoneRef.current) {
      dropzoneRef.current.open();
    }
  };

  const removeFile = (fileIndex: number) => {
    const newFiles = [...formik.values[name]];
    newFiles.splice(fileIndex, 1);
    formik.setFieldValue(name, newFiles);
  };

  const style: any = useMemo(
    () => ({
      ...baseStyle,
      // ...(isFocused ? focusedStyle : {}),
      // ...(isDragAccept ? acceptStyle : {}),
      // ...(isDragReject ? rejectStyle : {}),
    }),
    []
  );

  const handleAcceptedFiles = async (acceptedFiles: File[]) => {
    formik.setTouched({ [name]: true });
    const existingFiles = formik.values[name];

    //remove any duplicates
    let newFiles = acceptedFiles.filter(
      (file) => !existingFiles.some((f: File) => f.name === file.name)
    );

    if (newFiles.length + existingFiles.length >= maxFiles) {
      const cutAt = maxFiles - existingFiles.length;
      newFiles.splice(cutAt);
    }

    const newFilesWithPreviews = await Promise.all(
      newFiles.map(async (file) => {
        const base64 = await getBase64(file);
        if (name !== 'thumbnails') {
          return Object.assign(file, { preview: base64 });
        }

        const watermarkedBase64 = await addWatermark(
          base64,
          formik.values.name
        ); //canvas.toDataURL('image/jpeg');
        return Object.assign(file, { preview: watermarkedBase64 });
      })
    );

    formik.setFieldValue(name, [...existingFiles, ...newFilesWithPreviews]);
  };

  return (
    <FormControl
      style={{
        ...container,
        ...(formik.touched[name] &&
          Boolean(formik.errors[name]) && { borderColor: '#f44336' }),
      }}
      error={formik.touched[name] && Boolean(formik.errors[name])}
    >
      <Dropzone
        ref={dropzoneRef}
        noClick
        noKeyboard
        maxFiles={maxFiles}
        accept={{
          'image/*': ['.png', '.jpeg'],
          // 'application/pdf': ['.pdf'],
        }}
        onDrop={handleAcceptedFiles}
        disabled={formik.values[name].length >= maxFiles}
      >
        {({ getRootProps, getInputProps }) => {
          return (
            <Box style={{ width: '100%' }}>
              <Box {...getRootProps({ style })}>
                <input {...getInputProps()} />
                {/* TODO: change to html input */}
                <Box>{dropText[name]}</Box>
                <Button
                  variant="outlined"
                  onClick={openDialog}
                  disabled={formik.values[name].length >= maxFiles}
                >
                  Open File Dialog
                </Button>
              </Box>
              {formik.values[name].length > 0 && (
                <>
                  <h4>{`Files (${formik.values[name].length})`}</h4>
                  {/* Change to Grid */}
                  <aside style={aStyle}>
                    {formik.values[name].map((file: any, i: number) => (
                      <ArtistPreview
                        key={file.name}
                        file={file}
                        onRemove={() => removeFile(i)}
                        name={name}
                      />
                    ))}
                  </aside>
                </>
              )}
            </Box>
          );
        }}
      </Dropzone>
      {
        <Box sx={{ color: '#f44336' }}>
          {formik.touched[name] && formik.errors[name]}
        </Box>
      }
    </FormControl>
  );
};
