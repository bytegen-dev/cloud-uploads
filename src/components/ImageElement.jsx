// components/ImageElement.js
import React from 'react';
import { HiX } from 'react-icons/hi';

const ImageElement = ({ image, onRemove }) => {
  const { preview, name, isInvalid } = image;

  const nameEdited = name?.length > 15 ? `${name?.slice(0, 7)}...` : name

  return (
    <div className="image-element" style={{ backgroundImage: `url(${preview})` }}>
      {isInvalid && <div className="invalid-overlay">Invalid Image</div>}
      <button className="remove-button" onClick={() => onRemove(image)}><HiX /></button>
      <div className="image-info">
        <p>{nameEdited}</p>
      </div>
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
  );
};

export default ImageElement;
