import "firebase/firestore";
import "firebase/auth";
import firebase from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyAwmby_ZwmUDBh60GOEvCmntypHlPKn1hw",
  authDomain: "talks-aa371.firebaseapp.com",
  projectId: "talks-aa371",
  storageBucket: "talks-aa371.appspot.com",
  messagingSenderId: "984922230568",
  appId: "1:984922230568:web:29c40993ccb567d0458a1d",
  measurementId: "G-0BE1D54GCT",
};
let app;
if (firebase.apps.length === 0) {
  app = firebase.initializeApp(firebaseConfig);
} else {
  app = firebase.app();
}

const db = app.firestore();
const auth = firebase.auth();

export { db, auth };
