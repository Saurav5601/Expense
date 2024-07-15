// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAnalytics} from "firebase/analytics";
import {getAuth, GoogleAuthProvider} from "firebase/auth";
import {getFirestore, doc, setDoc} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBIs6wpNzwwz-hcTgKyCQzFpu1INmADQFY",
  authDomain: "expenseease-71173.firebaseapp.com",
  projectId: "expenseease-71173",
  storageBucket: "expenseease-71173.appspot.com",
  messagingSenderId: "1052127075634",
  appId: "1:1052127075634:web:4862d27910932b43fd0b2b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export {db, auth, provider, doc, setDoc};