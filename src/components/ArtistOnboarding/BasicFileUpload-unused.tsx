import React, { FC, ReactElement, useState } from 'react';
import { useDropzone, Accept } from 'react-dropzone';
// import Cropper, { Crop, Area } from 'react-easy-crop';

//params to pass in? Files, setFiles?
export const BasicFileUpload: FC = (): ReactElement => {
  //create a dropzone
  //add cropping

  const [image, setImage] = useState<File | null>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setImage(file);
      resizeImage(file);
    }
  };

  const handleImageDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0];
      setImage(file);
      resizeImage(file);
    }
  };

  const resizeImage = (file: File) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const img = new Image();
      img.src = reader.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 668;
        let width = img.width;
        let height = img.height;

        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg');
        const resizedFile = dataUrlToFile(dataUrl, file.name);
        setImage(resizedFile);
      };
    };
  };

  const dataUrlToFile = (dataUrl: string, filename: string) => {
    const arr = dataUrl.split(',');
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  return (
    <div
      onDrop={handleImageDrop}
      onDragOver={(event) => event.preventDefault()}
      style={{ minHeight: '60px', border: '1px solid white' }}
    >
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      {image && <img src={URL.createObjectURL(image)} alt="Uploaded image" />}
    </div>
  );
};
