import React, {
  FC,
  ReactElement,
  useEffect,
  useMemo,
  Dispatch,
  SetStateAction,
  createRef,
  Ref,
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
  borderWidth: 2,
  borderRadius: 2,
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

const container: React.CSSProperties = {
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

const thumb: React.CSSProperties = {
  display: 'inline-flex',
  borderRadius: 2,
  border: '1px solid #eaeaea',
  marginBottom: 2,
  marginRight: 2,
  width: 668 / 4,
  height: 504 / 4,
  padding: 0,
  boxSizing: 'border-box',
  overflow: 'hidden',
};

const thumbInner: React.CSSProperties = {
  display: 'flex',
  minWidth: '100%',
  overflow: 'hidden',
  justifyContent: 'center',
  position: 'relative',
};

const img: React.CSSProperties = {
  display: 'block',
  width: 'auto',
  height: '100%',
  objectFit: 'cover',
  objectPosition: 'center',
};

const icon: React.CSSProperties = {
  position: 'absolute',
  top: 2,
  right: 2,
  zIndex: 1,
  cursor: 'pointer',
  display: 'block',
  padding: 0,
};

const aStyle: React.CSSProperties = {
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
}

const ArtistPreview: FC<{
  file: any;
  onRemove: () => void;
  key: string;
}> = ({ file, onRemove, key }) => {
  console.log('file', file.preview);
  return (
    <Box sx={thumb} key={key}>
      <Box style={thumbInner}>
        <IconButton onClick={onRemove} sx={icon}>
          <CloseIcon />
        </IconButton>
        <img
          src={file.preview}
          style={img}
          // Revoke data uri after image is loaded
          onLoad={() => {
            URL.revokeObjectURL(file.preview);
          }}
          alt={file.name}
        />
      </Box>
    </Box>
  );
};

export const ArtistUpload: FC<Props> = ({
  files,
  setFiles,
  maxFiles,
  dropText,
}: Props): ReactElement => {
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

  const handleAcceptedFiles = (acceptedFiles: File[]) => {
    console.log('handle files', files, acceptedFiles);
    setFiles((prevFiles) => [
      ...prevFiles,
      ...acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      ),
    ]);
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
                <aside>
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
                  <ul>
                    {files.map((file) => (
                      <li key={file.path}>
                        {file.path} - {file.size} bytes
                      </li>
                    ))}
                  </ul>
                </aside>
              )}
            </Box>
          );
        }}
      </Dropzone>
    </section>
  );
};
