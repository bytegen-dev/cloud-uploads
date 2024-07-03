import type { AppProps } from "next/app";
import "../styles/index.scss"
import { useLayoutEffect, useState } from "react";
import PopupMenu from "../components/PopupMenu"

export default function App({ Component, pageProps }: AppProps) {
  const [showPopup, setShowPopup] = useState(false)
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  // useLayoutEffect(()=>{
    // window.addEventListener("click", ()=>{
    //   setShowPopup(false)
    // })
    // window.addEventListener("contextmenu", (e)=>{
    //   // e.preventDefault()
    //   setShowPopup(false)
    //   setShowPopup(true)
    //   if(!showPopup){
    //     setCursorPosition({ x: e.clientX, y: e.clientY });
    //   }
    // })
  // },[])
  return (
    <>
      {showPopup && <PopupMenu showPopup={showPopup} setShowPopup={setShowPopup} x={cursorPosition.x} y={cursorPosition.y} />}
      <Component {...pageProps} />
    </>
  );
}
