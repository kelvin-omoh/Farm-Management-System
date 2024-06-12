// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCFnzViSGI36LM8UKIIbqenit0th4R97kA",
  authDomain: "voltaic-charter-393405.firebaseapp.com",
  projectId: "voltaic-charter-393405",
  storageBucket: "voltaic-charter-393405.appspot.com",
  messagingSenderId: "900540364932",
  appId: "1:900540364932:web:591539f2520ce3702f2ad1",
  measurementId: "G-MHKKPWMMDG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
const auth = getAuth(app);
export default auth