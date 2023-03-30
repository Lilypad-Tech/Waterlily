import React, {
  FC,
  ReactElement,
  useEffect,
  useState,
  useMemo,
  Dispatch,
  SetStateAction,
  createRef,
} from 'react';
import Dropzone, {
  useDropzone,
  DropzoneOptions,
  DropzoneRootProps,
  DropzoneInputProps,
} from 'react-dropzone';
import { Box, TextField } from '@mui/material';

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

const thumbsContainer: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  marginTop: 16,
};

const thumb: React.CSSProperties = {
  display: 'inline-flex',
  borderRadius: 2,
  border: '1px solid #eaeaea',
  marginBottom: 8,
  marginRight: 8,
  width: 100,
  height: 100,
  padding: 4,
  boxSizing: 'border-box',
};

const thumbInner: React.CSSProperties = {
  display: 'flex',
  minWidth: 0,
  overflow: 'hidden',
};

const img: React.CSSProperties = {
  display: 'block',
  width: 'auto',
  height: '100%',
};

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

interface Props {
  files: File[];
  setFiles: Dispatch<SetStateAction<File[]>>;
}

export const ArtistUpload: FC<Props> = (props: Props): ReactElement => {
  const [files, setFiles] = useState<Array<File & { preview: string }>>([]);
  const dropzoneRef = createRef();
  const { getRootProps, getInputProps, isFocused, isDragAccept, isDragReject } =
    useDropzone({
      accept: { 'image/*': [] },
      noClick: true,
      noKeyboard: true,
      onDrop: (acceptedFiles: File[]) => {
        setFiles(
          acceptedFiles.map((file) =>
            Object.assign(file, {
              preview: URL.createObjectURL(file),
            })
          )
        );
      },
    } as DropzoneOptions);

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isFocused ? focusedStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isFocused, isDragAccept, isDragReject]
  );

  const openDialog = () => {
    // Note that the ref is set async,
    // so it might be null at some point
    if (dropzoneRef.current) {
      dropzoneRef.current.open();
    }
  };

  const thumbs = files.map((file) => (
    <>
      <div style={thumb} key={file.name}>
        <div style={thumbInner}>
          <img
            src={file.preview}
            style={img}
            // Revoke data uri after image is loaded
            onLoad={() => {
              URL.revokeObjectURL(file.preview);
            }}
            alt={file.name}
          />
        </div>
      </div>
      {/* <p>{file.name}</p> */}
    </>
  ));

  useEffect(() => {
    // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
    return () => files.forEach((file) => URL.revokeObjectURL(file.preview));
  }, [files]);

  return (
    <section style={container}>
      {/* <Box {...getRootProps({ style } as DropzoneRootProps)}>
        <input {...(getInputProps() as DropzoneInputProps)} />
        <p>Drag 'n' drop some files here</p>
      </Box>
      <aside style={thumbsContainer}>{thumbs}</aside> */}
      <Dropzone
        ref={dropzoneRef}
        noClick
        noKeyboard
        onDrop={(acceptedFiles: File[]) => {
          setFiles(
            acceptedFiles.map((file) =>
              Object.assign(file, {
                preview: URL.createObjectURL(file),
              })
            )
          );
        }}
      >
        {({ getRootProps, getInputProps, acceptedFiles }) => {
          return (
            <div style={{ width: '100%' }}>
              <div {...getRootProps({ style })}>
                <input {...getInputProps()} />
                <p>Drag 'n' drop some files here</p>
                <button type="button" onClick={openDialog}>
                  Open File Dialog
                </button>
              </div>
              {acceptedFiles.length > 0 && (
                <aside>
                  <h4>Files</h4>
                  <aside style={thumbsContainer}>{thumbs}</aside>
                  <ul>
                    {acceptedFiles.map((file) => (
                      <li key={file.path}>
                        {file.path} - {file.size} bytes
                      </li>
                    ))}
                  </ul>
                </aside>
              )}
            </div>
          );
        }}
      </Dropzone>
    </section>
  );
};
