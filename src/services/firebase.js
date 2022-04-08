import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB2JhyRiR6VoZx7PD15KMmZo2GtWmRZhmw",
  authDomain: "revervas.firebaseapp.com",
  projectId: "revervas",
  storageBucket: "revervas.appspot.com",
  messagingSenderId: "428360279320",
  appId: "1:428360279320:web:e91df2ee95293a028aea6d",
  measurementId: "G-GE2DXPJCKH",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const provider = new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({ prompt: "select_account" });

export const signInWithGoogle = () => auth.signInWithPopup(provider);
export const auth = firebase.auth();
export const db = firebase.firestore();

export default firebase;
