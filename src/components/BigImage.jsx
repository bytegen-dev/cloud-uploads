import React from 'react'
import { HiX } from 'react-icons/hi'

const BigImage = ({image, closeBigImage, removeImage}) => {
    const {preview, isInvalid, name} = image
    const nameEdited = name?.length > 15 ? `${name?.slice(0, 9)}...${name?.slice(-7)}` : name
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
            {!image?.url ? <button className="remove-btn" onClick={()=>{
                removeImage(image)
            }}>
                Remove
            </button> : <>
            </>}
        </div>}
    </>
  )
}

export default BigImage