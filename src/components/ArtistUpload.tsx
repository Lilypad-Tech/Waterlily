import React, {
  FC,
  ReactElement,
  useEffect,
  useMemo,
  Dispatch,
  SetStateAction,
  createRef,
  Ref,
  useRef,
  CSSProperties,
} from 'react';
import Dropzone from 'react-dropzone';
import { Box, Button, IconButton, TextField } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

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
};

interface Props {
  files: File[];
  setFiles: Dispatch<SetStateAction<any[]>>;
  maxFiles: number;
  dropText: string;
  formik: any;
  name: string;
}

const ArtistPreview: FC<{
  file: any;
  onRemove: () => void;
  key: string;
}> = ({ file, onRemove }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Box sx={thumb}>
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
  console.log('formik', formik);
  const dropzoneRef: any = createRef();

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
    setFiles(newFiles);
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
    // .map((file) =>
    //   Object.assign(file, { preview: URL.createObjectURL(file) })
    // );

    const newFilesWithPreviews = await Promise.all(
      newFiles.map(async (file) => {
        const base64 = await getBase64(file);
        return Object.assign(file, { preview: base64 });
      })
    );

    formik.setFieldValue(name, [...existingFiles, ...newFilesWithPreviews]);
  };

  const getBase64 = (file: File) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result?.toString();
        if (result) {
          resolve(result);
        } else {
          reject(new Error('Failed to read file as base64'));
        }
      };
      reader.onerror = (error) => reject(error);
    });
  };

  useEffect(() => {
    // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
    console.log('new files', files);
    return () => files.forEach((file) => URL.revokeObjectURL(file.preview));
  }, [files]);

  return (
    <section style={container}>
      <Dropzone
        ref={dropzoneRef}
        noClick
        noKeyboard
        // maxFiles={maxFiles}
        // accept={{ accept: ['image/jpeg', 'image/png', 'image/jpg'] }} //{ accept: ['image/*', ".zip"] }
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
              {files.length > 0 && (
                <>
                  <h4>Files</h4>
                  {/* Change to Grid */}
                  <aside style={aStyle}>
                    {files.map((file, i) => (
                      <ArtistPreview
                        key={file.name}
                        file={file}
                        onRemove={() => removeFile(i)}
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
