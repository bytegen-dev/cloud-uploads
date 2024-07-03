import { db } from '@/config/firebaseConfig'
import { deleteDoc, doc } from 'firebase/firestore'
import React from 'react'
import { HiX } from 'react-icons/hi'

const BigImage = ({image, currentDb, closeBigImage, removeImage}) => {
    const {preview, isInvalid, name} = image
    const nameEdited = name?.length > 15 ? `${name?.slice(0, 9)}...${name?.slice(-7)}` : name
    const downloadImage = (image)=>{
        const {url, name} = image
        const filename = name
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
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
            </div> : <img src={preview} alt="" className="img" />}
            {image?.url ? <>
                <div className="actions-holder xtra supa">
                    <a target="_blank" href={preview} download={name} className="download active action" style={{
                        textDecoration: "none"
                    }}>
                        Download
                    </a>
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