// components/FileUpload.js
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { db } from '../config/firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import ImageElement from './ImageElement';

const FileUpload = () => {
    const [selectedImages, setSelectedImages] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);

  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length + selectedImages.length > 100) {
      alert("You can upload a maximum of 100 images at once");
      return;
    }

    const newImages = await Promise.all(acceptedFiles.map(async file => {
      const preview = URL.createObjectURL(file);
      const isValid = await validateImage(file);
      return {
        file,
        preview,
        name: file.name,
        isInvalid: !isValid
      };
    }));

    setSelectedImages(prevImages => [...prevImages, ...newImages]);
  }, [selectedImages]);

  const validateImage = async (file) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
    });
  };

  const uploadImages = async () => {
    const imagesToUpload = selectedImages;

    for (const image of imagesToUpload) {
      const reader = new FileReader();
      reader.readAsDataURL(image.file);
      reader.onload = async () => {
        const fileBase64 = reader.result;

        try {
          const response = await axios.post('/api/upload', { file: fileBase64 });
          const { secure_url, original_filename, format, created_at, bytes, public_id } = response.data;

          const imageMeta = {
            name: original_filename,
            fileType: format,
            uploadDate: created_at,
            size: bytes,
            cloudinaryLink: secure_url,
            publicId: public_id,
            isInvalid: false
          };

          setUploadedImages(prevImages => [...prevImages, imageMeta]);

          // Save to Firebase
          await addDoc(collection(db, 'images'), imageMeta);
        } catch (error) {
          console.error('Upload failed', error);
        }
      };
    }

    setSelectedImages([]);
  };

  const removeImage = (image) => {
    setSelectedImages(selectedImages.filter(img => img !== image));
    URL.revokeObjectURL(image.preview); // Clean up object URL
  };

  const { getRootProps, getInputProps } = useDropzone({ 
    onDrop, 
    multiple: true,
    directory: true // Allow directory uploads
  });

  return (
    <>
      {selectedImages.length <= 0 && <div {...getRootProps()} className="dropzone">
        <input style={{
            display: "none",
        }} {...getInputProps()} />
        <p>Drag 'n' drop some files here, or click to select files</p>
      </div>}
      {selectedImages.length > 0 && <>
        <div className="images-container">
            {selectedImages.map((image, index) => (
            <ImageElement key={index} image={image} onRemove={removeImage} />
            ))}
        </div>
        {selectedImages.length > 0 && (
            <button className='upload-btn' onClick={uploadImages}>Upload Selected Images</button>
        )}
        {<div className="uploaded-images-container">
            {uploadedImages.map((image, index) => (
            <ImageElement key={index} image={image} onRemove={() => {}} /> // Add remove functionality if needed
            ))}
        </div>}
      </>}
    </>
  );
};

export default FileUpload;
