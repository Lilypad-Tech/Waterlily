import React, {
  FC,
  ReactElement,
  useMemo,
  createRef,
  CSSProperties,
  useContext,
} from 'react';
import Dropzone from 'react-dropzone';
import { Box, Button, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
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
  // borderColor: ${props => getColor(props)},
  borderStyle: 'solid',
  // backgroundColor: '#fafafa',
  // color: '#bdbdbd',
  borderColor: 'rgba(255, 255, 255, 0.23)',
  outline: 'none',
  transition: 'border .24s ease-in-out',
  // width: '80%',
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

interface Props {
  files: File[];
  setFiles: (files: File[]) => void;
  maxFiles: number;
  dropText: string;
  formik: any;
  name: string;
}

const ArtistPreview: FC<{
  file: any;
  onRemove: () => void;
  name: string;
}> = ({ file, onRemove, name }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Box
        sx={
          name === 'avatar'
            ? { ...thumb, width: '150px', borderRadius: '50%' }
            : thumb
        }
      >
        <Box style={thumbInner}>
          <IconButton onClick={onRemove} sx={iconStyle}>
            <CloseIcon />
          </IconButton>
          <img src={file.preview} style={imgStyle} alt={file.name} />
        </Box>
      </Box>
      <Box sx={filenameStyle}>{file.path}</Box>
    </Box>
  );
};

export const ArtistUpload: FC<Props> = ({
  files,
  setFiles,
  maxFiles,
  dropText,
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
    const newFiles = [...files];
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
    const existingFiles = formik.values[name];

    //remove any duplicates
    const newFiles = acceptedFiles.filter(
      (file) => !existingFiles.some((f: File) => f.name === file.name)
    );

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
    <section style={container}>
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
      >
        {({ getRootProps, getInputProps }) => {
          return (
            <Box style={{ width: '100%' }}>
              <Box {...getRootProps({ style })}>
                <input {...getInputProps()} />
                <p>{dropText}</p>
                <Button variant="outlined" onClick={openDialog}>
                  Open File Dialog
                </Button>
              </Box>
              {formik.values[name].length > 0 && (
                <>
                  <h4>Files</h4>
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
    </section>
  );
};
