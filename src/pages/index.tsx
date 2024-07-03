import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import FileUpload from "../components/FileUpload"
import Menu from "../components/Menu"
import BigImage from "../components/BigImage"
import Notification from "../components/Notification"
import { FaBars, FaGithub, FaLinkedinIn } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { useState } from "react";
import { HiMenuAlt4, HiX } from "react-icons/hi";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { db } from "@/config/firebaseConfig";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [showMenu, setShowMenu] = useState(false)
  const [showingBigImage, setShowingBigImage] = useState(false)
  const [selectedImages, setSelectedImages] = useState([]);
  const [bigImageDetails, setBigImageDetails] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [currentDb, setCurrentDb] = useState({
    name: "",
    id: "",
  })
  const [notifications, setNotifications] = useState([
    {
      content: "Test notification",
      type: "success",
      imgUrl: "jkhjghf",
    },
    {
      content: "Test notification 2",
      type: "error",
      imgUrl: "axaax",
    },
  ])

  const showBigImage = (image:any)=>{
    setBigImageDetails(image)
    setShowingBigImage(true)
  }

  const [isCreating, setIsCreating] = useState(false)
  const [name, setName] = useState("")
  const [id, setId] = useState("")
  const [password, setPassword] = useState("")

  const handleCreate = async ()=>{
    if(name && id && password){
      if(name.length < 4){
        alert("Your Database Name must be 4 Characters or more")
        return
      }
      if(id.length < 4){
        alert("Your Database ID must be 4 Characters or more")
        return
      }
      if(password.length < 8){
        alert("Your Password must be 8 Characters or more")
        return
      }

      setIsLoading(true)
      try{
        const querySnapshot = await getDocs(collection(db, "databases"));
        const databases:any = [];
        querySnapshot.forEach((doc) => {
          databases.push({ id: doc.id, ...doc.data() });
        });

        const databasesIds = databases?.map((database:any)=>{
          return database?.databaseId
        })

        if(databasesIds?.includes(id)){
          alert("Database already Exists")
          return
        } else{
          await addDoc(collection(db, "databases"), {
            name,
            databaseId: id,
            password,
          });
          setIsLoading(false)
          setIsCreating(false)
        }

      } catch(error){
        setIsLoading(false)
        console.error(error)
        alert("Failed to Create Database")
      }
    } else{
      alert("Please Fill the required fields")
    }
  }
  
  const handleSignin = async ()=>{
    if(id && password){
      if(id.length < 4){
        alert("Your Database ID must be 4 Characters or more")
        return
      }
      if(password.length < 8){
        alert("Your Password must be 8 Characters or more")
        return
      }

      setIsLoading(true)

      try{
        const querySnapshot = await getDocs(collection(db, "databases"));
        const databases:any = [];
        querySnapshot.forEach((doc) => {
          databases.push({ id: doc.id, ...doc.data() });
        });
  
        const targetDatabase = databases?.find((database:any)=>{
          return database?.databaseId === id
        })
  
        if(targetDatabase){
          if(targetDatabase?.password === password){
            setCurrentDb(targetDatabase)
            setIsLoading(false)
          } else{
            setIsLoading(false)
            alert("Wrong Password")
          }
        } else{
          setIsLoading(false)
          alert("404: Database does not exist")
        }
      } catch(error){
        setIsLoading(false)
        console.error(error)
        alert("Failed to Fetch Database")
      }


    } else{
      alert("Please Fill the required fields")
    }
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
      {/* <Notification notifications={notifications} setNotifications={setNotifications} /> */}
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
            {currentDb?.id && <div className="current-bucket">{currentDb.name}</div>}
            <div className="hamburger" onClick={()=>{
              setShowMenu(!showMenu)
            }}>
               {showMenu ? <HiX size={30} /> : <HiMenuAlt4 size={35} />}
            </div> 
          </div>
        </div>
        {!currentDb?.id ? <div className={`upload-holder ${isLoading ? "uploading" : ""}`}>
          <h1>{isCreating ? "Create a Database" : "Sign in"}</h1>
          {isCreating ? <div className="form dropzone">
            <div className="input-el">
              <label htmlFor="">
                Name*
              </label>
              <input type="text" value={name} onChange={(e)=>{
                setName(e.target.value)
              }} maxLength={30} minLength={10} required placeholder="My Database" />
            </div>
            <div className="input-el">
              <label htmlFor="">
                Unique ID* <small style={{
                  color: "#fff5",
                }}><i>(will be needed to sign in)</i></small>
              </label>
              <input type="text" value={id} onChange={(e)=>{
                setId(e.target.value)
              }} maxLength={30} minLength={10} required placeholder="my-database-id" />
            </div>
            <div className="input-el">
              <label htmlFor="">
                Password*
              </label>
              <input type="password" value={password} onChange={(e)=>{
                setPassword(e.target.value)
              }} maxLength={30} minLength={8} required placeholder="********" />
            </div>
            <div className="btn-holder">
              <button className="btn" onClick={handleCreate}>
                Create
              </button>
            </div>
          </div> :
          <div className="form dropzone">
            <div className="input-el">
              <label htmlFor="">
                Database ID*
              </label>
              <input type="text" value={id} onChange={(e)=>{
                setId(e.target.value)
              }} maxLength={30} minLength={10} required placeholder="my-database-id" />
            </div>
            <div className="input-el">
              <label htmlFor="">
                Password*
              </label>
              <input type="password" value={password} onChange={(e)=>{
                setPassword(e.target.value)
              }} maxLength={16} minLength={8} required placeholder="********" />
            </div>
            <div className="btn-holder">
              <button className="btn" onClick={handleSignin}>
                Continue
              </button>
            </div>
          </div>}
          <div className="actions-holder">
            <div className={isCreating ? "active action" : "action"} onClick={()=>{
              setIsCreating(true)
            }}>
              Create
            </div>
            <div className={!isCreating ? "active action" : "action"} onClick={()=>{
              setIsCreating(false)
            }}>
              Signin
            </div>
          </div>
          {isLoading && <div className="loader">
            <div className="spinner"></div>
            {isCreating ? "Creating Database" : "Fetching Database..."}
          </div>}
        </div> :
        <div className={`upload-holder ${isUploading ? "uploading" : ""}`}>
          <h1>Upload Images</h1>
          <FileUpload isUploading={isUploading} setIsUploading={setIsUploading} currentDb={currentDb} selectedImages={selectedImages} setSelectedImages={setSelectedImages} showBigImage={showBigImage} />
        </div>}
      </main>
    </>
  );
}
