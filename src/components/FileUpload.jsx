// components/FileUpload.js
import React, { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { db } from '../config/firebaseConfig';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import ImageElement from './ImageElement';
import { FaCheck, FaTrashAlt } from 'react-icons/fa';
import { HiX } from 'react-icons/hi';

const FileUpload = ({setIsUploading, isUploading, showBigImage, currentDb, selectedImages, setSelectedImages}) => {
  const [uploadedImages, setUploadedImages] = useState([]);
  const [progress, setProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [error, setError] = useState(null);

  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length + selectedImages.length > 500) {
      alert("You can upload a maximum of 500 images at once");
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
    setProgress(0)
  }, [selectedImages]);

  const validateImage = async (file) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
    });
  };

  const unsignedUploadPreset = "cloudx"

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY 
  const apiSecret = process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET // Click 'View Credentials' below to copy your API secret
  
  const urlX = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;

  const uploadFile = async (file, index, totalFiles) => {
    const fd = new FormData();
    fd.append('upload_preset', unsignedUploadPreset);
    fd.append('tags', 'browser_upload'); // Optional - add tags for image admin in Cloudinary
    fd.append('file', file.file);

    try {
      console.log(`Uploading File ${file.name}`)
      const response = await axios.post(urlX, fd);
      const data = response.data;
      const { secure_url, url, height, width, original_filename, bytes, format, created_at } = data;

      // Save to Firebase
      console.log(`Uploaded File ${file.name} Succesful`)


      console.log(`Updating Firebase with ${file.name}`)

      await addDoc(collection(db, currentDb.id), {
        name: original_filename,
        size: bytes,
        type: format,
        secure_url: secure_url,
        url: url,
        createdAt: created_at,
        height,
        width,
      });

      console.log(`Updating Firebase with ${file.name} Successful`)

      const newProgressFloat = ((index + 1) / totalFiles) * 100

      const newProgress = parseInt(newProgressFloat)

      console.log(`Progress is ${newProgress}%`)

      setProgress(() => {
        return newProgress > 100 ? 100 : newProgress
      });

      if (index < totalFiles - 1) {
        await uploadFile(selectedImages[index + 1], index + 1, totalFiles);
      } else {
        setProgress(100);
        
        setTimeout(()=>{
          setIsCompleted(true);
          setIsUploading(false)
        }, 2000)
      }
    } catch (error) {
      console.error(`Upload failed @ File: ${index}`, error);
      setError(`Upload failed @ File: ${index}`);
      setIsUploading(false)
      setProgress(0)
    }
  };

  const updateProgress = (index, fileProgress, totalFiles) => {
    const averageProgress = (progress * index + fileProgress) / (index + 1);
    setProgress(averageProgress);

    if (index === totalFiles - 1 && fileProgress === 100) {
      setProgress(100); // Ensure the progress hits 100% when the last file is fully uploaded
    }
  };

  const handleUpload = () => {
    if (selectedImages.length > 0) {
      setIsUploading(true);
      setIsCompleted(false);
      setProgress(0)
      uploadFile(selectedImages[0], 0, selectedImages.length);
    }
  };

  const removeImage = (image) => {
    setSelectedImages(selectedImages.filter(img => img !== image));
    URL.revokeObjectURL(image.preview); // Clean up object URL
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop, 
    multiple: true,
    directory: true // Allow directory uploads
  });

  const invalidImages = selectedImages?.filter(img => img.isInvalid || !img.preview)

  const [adding, setAdding] = useState(false)
  const [fetchingImages, setFetchingImages] = useState(false)

  const fetchImages = async () =>{
    try{
      setFetchingImages(true)
      const querySnapshot = await getDocs(collection(db, currentDb.id));
      const images = [];
      querySnapshot.forEach((doc) => {
        images.push({ id: doc.id, ...doc.data() });
      });
      setUploadedImages(images)
      setFetchingImages(false)
    } catch(error){
      setFetchingImages(false)
      console.error(error)
    }
  }

  useEffect(()=>{
    if(!adding){
      fetchImages()
    }
  }, [adding])

  return (
    <>
      <h1>{adding ? `${uploadedImages?.length ? "Add" : "Upload"} Images` : "My Images"} {(!adding && uploadedImages?.length > 0) && <small style={{
        color: "#fff6",
        fontWeight: "300",
        fontSize: "15px",
        marginLeft: "10px",
        marginTop: "10px",
      }}><i>{uploadedImages?.length}</i></small>} </h1>
      {cloudName && <>
        {selectedImages.length <= 0 && <>
          {adding && <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''}`}>
            <input style={{
                display: "none",
            }} {...getInputProps()} />
            <p>Drag 'n' drop some files here, or click to select files</p>
          </div>}
          {(!adding) && <>
            {uploadedImages?.length > 0 ? <div className={`dropzone ${isDragActive ? 'active' : ''} images-container`}>
              {uploadedImages?.map((image, index) => {
                const key = `${index}`
                const newImage = {
                  preview: image?.url,
                  name: image?.name,
                  secureUrl: image?.secureUrl,
                }
                return (
                <ImageElement showBigImage={showBigImage} index={index} key={key || index} image={newImage} onRemove={()=>{}} />
              )})}
            </div> : <div className="dropzone">
              You haven't added any Images
            </div> }
          </>}
          <div className="actions-holder">
            <div className={`action ${!adding ? "active" : ""}`} onClick={()=>{
              setAdding(false)
            }}>
              View Uploads
            </div>
            <div className={`action ${adding ? "active" : ""}`} onClick={()=>{
              setAdding(true)
            }}>
              Add Images
            </div>
          </div>
        </>}
        {selectedImages.length > 0 && <>
          <div className="clear-holder">
              {invalidImages?.length > 0 && <button className="clear-btn invalid" onClick={()=>{
                  const images = selectedImages
                  const imageUrls = invalidImages?.map(img => {
                      if(img.preview){
                        URL.revokeObjectURL(img.preview);
                      }
                      return img
                  })
                  const filterInvalid = images?.filter(img => !img.isInvalid || !img.preview)
                  setSelectedImages(filterInvalid)
              }}>
                  Clear Invalid <span>{invalidImages?.length}</span>
              </button>}
              <button className="clear-btn" onClick={()=>{
                setTimeout(()=>{
                  const confirm = window.confirm("Are you sure you want to clear all selected files?")
                  if(confirm){
                    const imageUrls = selectedImages?.map(img => {
                        if(img.preview){
                            URL.revokeObjectURL(img.preview);
                        }
                        return img
                    })
                    setSelectedImages([])
                  }
                }, 700)
              }}>
                  Clear <FaTrashAlt />
              </button>
          </div>
          <div className="images-container">
              <div className="add-images" {...getInputProps()}>
              </div>
              {selectedImages?.map((image, index) => {
              const key = `${index}`
              return (
              <ImageElement showBigImage={showBigImage} index={index} key={key || index} image={image} onRemove={removeImage} />
              )})}
          </div>
          {selectedImages.length > 0 && (
              <button className='upload-btn' disabled={invalidImages?.length} onClick={handleUpload}>Upload Selected Images</button>
          )}
        </>}
        {fetchingImages && <div className="loader">
          <div className="spinner"></div>
          Fetching Images...
        </div>}
        {isUploading && <div className="loader">
          Uploading Files...
          <div className="spinner"></div>
          {progress}%
        </div>}
        {isCompleted && <div className="loader">
          Uploading Completed
          <div className="icon">
            <FaCheck />
          </div>
          <button className="done-btn" onClick={()=>{
            setSelectedImages([])
            setIsCompleted(false)
          }}>
            Done
          </button>
        </div>}
        {error && <div className="loader error">
          {error}
          <div className="icon">
            <HiX />
          </div>
          <button className="restart-btn" onClick={()=>{
            setError(null)
          }}>
            Back
          </button>
        </div>}
      </>}
    </>
  );
};

export default FileUpload;
