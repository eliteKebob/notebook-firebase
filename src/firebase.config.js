// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCPtfEcSU3o_dAJgeVDnDrDg6OmahbF3EE",
  authDomain: "notebookium.firebaseapp.com",
  projectId: "notebookium",
  storageBucket: "notebookium.appspot.com",
  messagingSenderId: "609612414441",
  appId: "1:609612414441:web:4a5ec1901457513c01df78",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore();
