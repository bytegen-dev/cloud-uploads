// components/ImageElement.js
import React, { useState } from 'react';
import { HiX } from 'react-icons/hi';

const ImageElement = ({index, image, onRemove, showBigImage }) => {
  const { preview, name, isInvalid } = image;

  const nameEdited = name?.length > 15 ? `${name?.slice(0, 7)}...` : name
  const [showBig, setShowBig] = useState(false)
  return (
    <>
        <div className={`image-element ${showBig ? "big" : ""}`} style={{ backgroundImage: `url(${preview})`,
            animationDelay: `${(index + 1)*0.05}s`,
        }} aria-description={name} onClick={()=>{
            showBigImage(image)
        }}>
        {isInvalid && <div className="invalid-overlay">Invalid Image</div>}
        <button className="remove-button" onClick={(e) => {
          e.stopPropagation()
          onRemove(image)
        }}><HiX /></button>
        <style jsx>{`
            .image-element {
            position: relative;
            background-size: cover;
            background-position: center;
            margin: 10px;
            }
            .invalid-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(255, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 18px;
            }
            .remove-button {
            position: absolute;
            top: 10px;
            right: 10px;
            background: #f00;
            color: white;
            border: none;
            width: 20px;
            height: 20px;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            }
            .image-info {
            position: absolute;
            bottom: 10px;
            background: rgba(0, 0, 0, 0.5);
            color: white;
            padding: 5px;
            }
        `}</style>
        </div>
    </>
  );
};

export default ImageElement;
