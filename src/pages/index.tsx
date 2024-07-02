import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import FileUpload from "../components/FileUpload"
import Menu from "../components/Menu"
import BigImage from "../components/BigImage"
import { FaBars, FaGithub, FaLinkedinIn } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { useState } from "react";
import { HiMenuAlt4, HiX } from "react-icons/hi";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [showMenu, setShowMenu] = useState(false)
  const [showingBigImage, setShowingBigImage] = useState(false)
  const [selectedImages, setSelectedImages] = useState([]);
  const [bigImageDetails, setBigImageDetails] = useState(null)
  const showBigImage = (image:any)=>{
    setBigImageDetails(image)
    setShowingBigImage(true)
  }

  const removeImage = (image:any) => {
    setShowingBigImage(false)
    setBigImageDetails(null)
    setSelectedImages(selectedImages.filter(img => img !== image));
    URL.revokeObjectURL(image.preview); // Clean up object URL
  };
  return (
    <>
      <Head>
        <title>Cloudx ~ SpacelabZ Gadgets</title>
      </Head>
      {showingBigImage && <BigImage removeImage={removeImage} image={bigImageDetails} closeBigImage={
        ()=>{
          setShowingBigImage(false)
        }
      } />}
      <div className="top-el"></div>
      <main className="page home">
        <div className="links-holder">
          <a href="https://github.com/bytegen-dev/cloud-uploads" className="link-btn" target="_blank" rel="noreferrer">
            <FaGithub />
          </a>
          <a href="https://x.com/bytegen-dev" className="link-btn" target="_blank" rel="noreferrer">
            <FaXTwitter />
          </a>
          <a href="https://linkedin.com/in/bytegen-dev" className="link-btn" target="_blank" rel="noreferrer">
            <FaLinkedinIn />
          </a>
        </div>
        <Menu showMenu={showMenu} />
        <div className="header">
          <div className="heading left">
            Cloudx
          </div>
          <div className="heading right">
            <div className="current-bucket">Spacelabz project</div>
            <div className="hamburger" onClick={()=>{
              setShowMenu(!showMenu)
            }}>
               {showMenu ? <HiX size={30} /> : <HiMenuAlt4 size={35} />}
            </div> 
          </div>
        </div>
      <div className="upload-holder">
        <h1>Upload Images</h1>
        <FileUpload selectedImages={selectedImages} setSelectedImages={setSelectedImages} showBigImage={showBigImage} />
      </div>
      </main>
    </>
  );
}
