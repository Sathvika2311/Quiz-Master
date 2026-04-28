// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAd7n--KVCgap-4wuU3oS3f2fvej43tdnk",
  authDomain: "quiz-master-89e8f.firebaseapp.com",
  projectId: "quiz-master-89e8f",
  storageBucket: "quiz-master-89e8f.firebasestorage.app",
  messagingSenderId: "245396730773",
  appId: "1:245396730773:web:aa8dbd891178192bc73c9c"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { auth, db, googleProvider, signInWithPopup };
