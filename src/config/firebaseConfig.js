// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCEsR0pAzJfw_a7pzRGdh9m6L2nuvTZXc4",
    authDomain: "cloud-uploads-app.firebaseapp.com",
    projectId: "cloud-uploads-app",
    storageBucket: "cloud-uploads-app.appspot.com",
    messagingSenderId: "477027366333",
    appId: "1:477027366333:web:94174a3542fae1a0208ed4",
    measurementId: "G-TBRHF68QMV"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };