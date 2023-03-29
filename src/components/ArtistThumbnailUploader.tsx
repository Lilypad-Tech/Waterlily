import React, { FC, ReactElement, useState } from 'react';
import 'react-dropzone-uploader/dist/styles.css';
import Dropzone from 'react-dropzone-uploader';
import ReactCrop from 'react-easy-crop';

interface Props {}

//params to pass in? Files, setFiles?
export const ArtistThumbnailUploader: FC<Props> = (): ReactElement => {
  //create a dropzone
  // add autosizing of these images (keep aspect ratio but resize to w=668px)
  //add cropping
  const [files, setFiles] = useState([]);
  const [isUpdatePreview, setIsUpdatePreview] = useState(false);

  const getUploadParams = ({ meta }) => {
    const url = 'https://httpbin.org/post';
    return {
      url,
      meta: { fileUrl: `${url}/${encodeURIComponent(meta.name)}` },
    };
  };

  const handleChangeStatus = ({ meta }, status) => {
    setIsUpdatePreview(!isUpdatePreview);
    console.log(status, meta);
  };

  const handleSubmit = (files, allFiles) => {
    console.log(files.map((f) => f.meta));
    allFiles.forEach((f) => f.remove());
  };

  return (
    <Dropzone
      getUploadParams={getUploadParams}
      onChangeStatus={handleChangeStatus}
      // onSubmit={handleSubmit}
      maxFiles={3}
      accept="image/*"
      inputContent={(files, extra) =>
        extra.reject ? 'Image, audio and video files only' : 'Drag Files'
      }
      styles={{
        dropzoneReject: { borderColor: 'red', backgroundColor: '#DAA' },
        inputLabel: (files, extra) => (extra.reject ? { color: 'red' } : {}),
      }}
    />
  );
};
