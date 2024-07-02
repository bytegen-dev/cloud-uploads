import React, { useRef } from 'react'
import { HiRefresh, HiX } from 'react-icons/hi'
import { HiCodeBracket } from 'react-icons/hi2'

const PopupMenu = ({showPopup, x, y, setShowPopup}) => {
    const reload = () =>{
        const confirm = window.confirm("Reload this Page?")
        if(confirm){
            window.location.reload()
            location.reload()
        }
    }

    const popupMenu = useRef(null)

    
    // const yEdited = y?.replace("px", "")
    // const yNum = parseFloat(yEdited)
    
    // console.log(y)
    const pageHeight = window.innerHeight
    const pageWidth = window.innerWidth

    const popupStyle = {
        position: 'absolute',
        top: y < 20 ? 20 : (y > pageHeight - 150 ? pageHeight - 150 : y),
        left: x < 20 ? 20 : (x > pageWidth - 170 ? pageWidth - 170 : x),
        transition: "all 0s linear"
    };

    return (
    <>
        <div className="backdrop"></div>
        <div className="popup-menu" ref={popupMenu}  style={popupStyle} onClick={(e)=>{
            e.stopPropagation()
        }}>
            <button className="close-btn" onClick={()=>{
                setShowPopup(false)
            }}>
                <HiX />
            </button>
            <div className="btn-holder">
                <button className="refresh-btn" onClick={reload}>
                    <HiRefresh /> Refresh
                </button>
                <a className="refresh-btn" href="https://x.com/bytegen_dev">
                    <HiCodeBracket /> Dev_
                </a>
            </div>
        </div>
    </>
  )
}

export default PopupMenu