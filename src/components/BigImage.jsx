import { db } from '@/config/firebaseConfig'
import { deleteDoc, doc } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { HiX } from 'react-icons/hi'

const BigImage = ({image, currentDb, closeBigImage, removeImage}) => {
    const {preview, isInvalid, url, name} = image
    const nameEdited = name?.length > 15 ? `${name?.slice(0, 9)}...${name?.slice(-7)}` : name

  const [imageFile, setImageFile] = useState(null)


    async function saveImageToSession(url) {
        const response = await fetch(url);
        const blob = await response.blob();
        const reader = new FileReader();
    
        return new Promise((resolve, reject) => {
          reader.onload = () => {
            const image = reader.result;
            setImageFile(image)
            resolve();
          };
    
          reader.onerror = () => {
            reject(new Error('Failed to read image'));
          };
    
          reader.readAsDataURL(blob);
        });
    }
    
    useEffect(()=>{
        if(image?.url){
            saveImageToSession(image?.url)
        }
        
    },[])

    const downloadImage = ()=>{
        const url = image?.url
        const filename = name

        console.log("Recieving Blob")

        fetch(url)
        .then(response => response.blob())
        .then(blob => {
            console.log("Creating blob url")
            const blobUrl = window.URL.createObjectURL(blob);
            
            console.log("blob url", blobUrl)
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = filename || "downloaded-image";
            
            document.body.appendChild(link);
            link.click();
            console.log("Download in Progress")

            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
        })
        .catch(console.error);
    }

    const deleteImage = async (image)=>{
        const confirm = window.confirm("This action can not be reversed")
        if(confirm){
            const docRef = doc(db, currentDb.id, image.id);
            try {
                alert("Delete in Progress....")
                await deleteDoc(docRef);
                alert("Document successfully deleted! Might take a while to update Database");
                closeBigImage()
            }   catch (error) {
                console.error("Error removing document: ", error);
                alert("An Error Occured")
            }
        }
    }

    return (
    <>
        {<div className="big-image">
            <button className="close-btn" onClick={closeBigImage}>
                <HiX />
            </button>
            <div className="image-info">
                <p>{nameEdited}</p>
            </div>
            {isInvalid ? <div className='invalid'>
                Invalid Image
            </div> : <img src={imageFile || preview} alt="" className="img" />}
            {image?.url ? <>
                <div className="actions-holder xtra supa">
                    <div className="download active action" style={{
                        textDecoration: "none"
                    }} onClick={downloadImage}>
                        Download
                    </div>
                    <div className="delete action" onClick={()=>{
                        deleteImage(image)
                    }}>
                        Delete
                    </div>
                </div>
                </>
                : <>
                    <button className="remove-btn" onClick={()=>{
                        removeImage(image)
                    }}>
                        Remove
                    </button>
                </>
            }
        </div>}
    </>
  )
}

export default BigImage