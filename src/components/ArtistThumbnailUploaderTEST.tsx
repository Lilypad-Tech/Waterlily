import React, { FC, ReactElement, useState } from 'react';
import Dropzone from 'react-dropzone-uploader';
import Cropper from 'react-easy-crop';
import { v4 as uuidv4 } from 'uuid';
import { createWorker } from 'tesseract.js';

// Styles for the image cropping area
const styles = {
  cropContainer: {
    position: 'relative',
    width: '100%',
    height: '400px',
    background: '#333',
    overflow: 'hidden',
  },
  cropPreview: {
    width: '100%',
    height: '100%',
  },
};

interface Props {}

//params to pass in? Files, setFiles?
export const ArtistThumbnailUploader: FC<Props> = (): ReactElement => {
  //create a dropzone
  // add autosizing of these images (keep aspect ratio but resize to w=668px)
  //add cropping
  const [files, setFiles] = useState([]);

  // Define the crop state
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  // Define the watermark state
  const [watermark, setWatermark] = useState('');

  // Define the OCR worker
  const worker = createWorker();

  // Define the image processing function
  const processImage = async (file: File) => {
    // Resize the image
    const image = await resizeImage(file);

    // Crop the image
    const croppedImage = await cropImage(image);

    // Add the watermark to the image
    const watermarkedImage = await addWatermark(croppedImage);

    // Recognize text in the image using OCR
    const text = await recognizeText(watermarkedImage);

    // Display the processed image and OCR results
    console.log(text);
  };

  // Define the image resizing function
  const resizeImage = async (file: File) => {
    return new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();

      img.onload = () => {
        // Calculate the new height based on the aspect ratio
        const aspectRatio = img.width / img.height;
        const height = 668 / aspectRatio;

        // Create a canvas to draw the resized image on
        const canvas = document.createElement('canvas');
        canvas.width = 668;
        canvas.height = height;

        // Draw the resized image onto the canvas
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, 668, height);

        // Convert the canvas back to an image element and resolve the promise
        const resizedImage = new Image();
        resizedImage.src = canvas.toDataURL();
        resolve(resizedImage);
      };

      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };

      img.src = URL.createObjectURL(file);
    });
  };

  // Define the image cropping function
  const cropImage = async (image: HTMLImageElement) => {
    return new Promise<HTMLCanvasElement>((resolve, reject) => {
      // Create a canvas to draw the cropped image on
      const canvas = document.createElement('canvas');
      canvas.width = 668;
      canvas.height = 400;

      // Draw the cropped image onto the canvas
      const ctx = canvas.getContext('2d');
      const sourceX = crop.x * image.width;
      const sourceY = crop.y * image.height;
      const sourceWidth = 668 / zoom;
      const sourceHeight = (400 / zoom) * (image.height / image.width);
      const destX = 0;
      const destY = 0;
      const destWidth = 668;
      const destHeight = 400;
      ctx?.drawImage(
        image,
        sourceX,
        sourceY,
        sourceWidth,
        sourceHeight,
        destX,
        destY,
        destWidth,
        destHeight
      );

      // Convert the canvas back to an image element and resolve the promise
      const croppedImage = new Image();
      croppedImage.src = canvas.toDataURL();
      resolve(croppedImage);
    });
  };

  // Define the function to add a watermark to an image
  const addWatermark = async (image: HTMLImageElement) => {
    return new Promise<HTMLCanvasElement>((resolve, reject) => {
      // Create a canvas to draw the watermarked image on
      const canvas = document.createElement('canvas');
      canvas.width = image.width;
      canvas.height = image.height;

      // Draw the image onto the canvas
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(image, 0, 0);

      // Draw the watermark text onto the canvas
      ctx.font = '24px Arial';
      ctx.fillStyle = 'white';
      ctx.fillText(watermark, 10, image.height - 10);

      // Convert the canvas back to an image element and resolve the promise
      const watermarkedImage = new Image();
      watermarkedImage.src = canvas.toDataURL();
      resolve(watermarkedImage);
    });
  };

  // Define the OCR function using Tesseract.js
  const recognizeText = async (image: HTMLImageElement) => {
    await worker.load();
    await worker.loadLanguage('eng');
    await worker.initialize('eng');
    const { data } = await worker.recognize(image);
    await worker.terminate();
    return data.text;
  };

  // Define the function to handle when a file is added
  const handleFileAdded = async (file: FileWithMeta) => {
    // Add the file to the state
    setFiles([...files, file]);

    // Process the image
    await processImage(file.file);
  };

  // Define the function to handle when a file is removed
  const handleFileRemoved = (file: FileWithMeta) => {
    // Remove the file from the state
    setFiles(files.filter((f) => f !== file));
  };

  return (
    <div>
      <Dropzone
        inputContent={() => (
          <div>
            <p>Drop your images here or click to browse.</p>
            <p>Only .jpg and .png files will be accepted.</p>
          </div>
        )}
        accept="image/jpeg, image/png"
        onSubmit={handleFileAdded}
        styles={{ dropzone: { minHeight: 200 } }}
      />

      <div style={styles.cropContainer}>
        <Cropper
          image={''}
          crop={crop}
          zoom={zoom}
          aspect={668 / 400}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          cropShape="rect"
          showGrid={false}
          style={styles.cropPreview}
        />
      </div>

      <div>
        <label htmlFor="watermark">Watermark:</label>
        <input
          type="text"
          id="watermark"
          value={watermark}
          onChange={(e) => setWatermark(e.target.value)}
        />
      </div>

      {files.map((file) => (
        <div key={file.meta.uuid}>
          <img src={file.meta.previewUrl} alt="Preview" />
          <button onClick={() => handleFileRemoved(file)}>Remove</button>
        </div>
      ))}
    </div>
  );
};

//import { useDropzone, Accept } from 'react-dropzone';
// import Cropper, { Crop, Area } from 'react-easy-crop';
// const ArtistThumbnailUploader = () => {
//   const [files, setFiles] = useState<File[]>([]);
//   const [imagePreviews, setImagePreviews] = useState<string[]>([]);
//   const [crop, setCrop] = useState<Crop>({
//     aspect: 1,
//     x: 0,
//     y: 0,
//     width: 0,
//     height: 0,
//   });
//   const [cropActive, setCropActive] = useState(false);
//   const [croppedImages, setCroppedImages] = useState<string[]>([]);

//   const onDrop = (acceptedFiles: File[]) => {
//     const filePreviews = acceptedFiles.map((file) => URL.createObjectURL(file));
//     setImagePreviews(filePreviews);
//     setFiles(acceptedFiles);
//     setCropActive(true);
//   };
//   const acceptedFileTypes = ['image/jpeg', 'image/png', 'image/gif'];
//   const accept = acceptedFileTypes.join(',');

//   const { getRootProps, getInputProps } = useDropzone({
//     onDrop,
//     accept: 'image/jpeg, image/png',
//     multiple: false,
//   });

//   const getCroppedImg = async (imageSrc: string, crop: Crop) => {
//     const image = new Image();
//     image.src = imageSrc;
//     await new Promise((resolve) => (image.onload = resolve));
//     const canvas = document.createElement('canvas');
//     const scaleX = image.naturalWidth / image.width;
//     const scaleY = image.naturalHeight / image.height;
//     canvas.width = crop.width;
//     canvas.height = crop.height;
//     const ctx = canvas.getContext('2d');
//     ctx?.drawImage(
//       image,
//       crop.x * scaleX,
//       crop.y * scaleY,
//       crop.width * scaleX,
//       crop.height * scaleY,
//       0,
//       0,
//       crop.width,
//       crop.height
//     );
//     const base64Image = canvas.toDataURL('image/jpeg');
//     return base64Image;
//   };

//   const onCropComplete = async (croppedArea: Crop, croppedAreaPixels: Area) => {
//     const croppedImage = await getCroppedImg(
//       imagePreviews[0],
//       croppedAreaPixels
//     );
//     setCroppedImages([...croppedImages, croppedImage]);
//     setCropActive(false);
//   };

//   const onCropCancel = () => {
//     setCropActive(false);
//   };

//   const handleSaveCroppedImage = () => {
//     if (croppedImages.length >= 3) {
//       // Replace this with your own logic for what to do with the images
//       console.log('Cropped images:', croppedImages);
//       setImagePreviews([]);
//       setCroppedImages([]);
//       setFiles([]);
//     }
//   };

//   const renderDropzone = () => {
//     if (cropActive) {
//       return (
//         <div className="cropper-wrapper">
//           <Cropper
//             image={imagePreviews[0]}
//             crop={crop}
//             zoom={1}
//             aspect={crop.aspect}
//             onCropChange={setCrop}
//             onCropComplete={onCropComplete}
//             onCancel={onCropCancel}
//             style={{ containerStyle: { width: '100%', height: '400px' } }}
//           />
//           <button onClick={handleSaveCroppedImage}>Save</button>
//         </div>
//       );
//     }

//     if (imagePreviews.length > 0) {
//       return (
//         <div className="image-previews">
//           {imagePreviews.map((preview, index) => (
//             <div className="preview-wrapper" key={index}>
//               <img src={preview} alt="preview" />
//               <button onClick={() => setImagePreviews([])}>Remove</button>
//             </div>
//           ))}
//           {croppedImages.length > 0 && (
//             <button onClick={handleSaveCroppedImage}>Save</button>
//           )}
//         </div>
//       );
//     }

//     return (
//       <div {...getRootProps()} className="dropzone">
//         <input {...getInputProps()} />
//         <p>Drag 'n' drop an image here, or click to select a file</p>
//       </div>
//     );
//   };
// };

// export default ArtistThumbnailUploader;
