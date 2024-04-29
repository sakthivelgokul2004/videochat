// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAHAoxk-w7WHezWW1O1f_mYc--NP-zmiw0",
  authDomain: "videochat-226a1.firebaseapp.com",
  projectId: "videochat-226a1",
  storageBucket: "videochat-226a1.appspot.com",
  messagingSenderId: "321973348565",
  appId: "1:321973348565:web:9b0d6a4e0fac86d7765a5c",
  measurementId: "G-59N4E410EE",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export default app;
const db = getFirestore(app);

export {db}