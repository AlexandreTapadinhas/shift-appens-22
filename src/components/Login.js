import { useEffect } from "react";

import { signInWithGoogle } from "../services/firebase";
import { db, auth } from "../services/firebase";

import "../App.css";

import { IoLogoGoogle } from "react-icons/io5";

const Login = () => {
  //register user in db if nedded
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      var docRef = db.collection("users").doc(user.uid);
      docRef
        .get()
        .then((doc) => {
          if (!doc.exists) {
            db.collection("users")
              .doc(user.uid)
              .set({
                displayName: user.displayName,
                email: user.email,
                photoURL: user.photoURL,
                balance: "0",
              })
              .catch((error) => alert(error.message));
          }
        })
        .catch((error) => {
          console.log("Error getting document:", error);
        });
    });
  }, []);

  return (
    <div>
      <div className="flex flex-row items-center justify-center h-screen text-2xl">
        <button className="" onClick={signInWithGoogle}>
          <IoLogoGoogle />
        </button>
        <button className="" onClick={signInWithGoogle}>
          <h1 className="pl-4">Sign in with google</h1>
        </button>
      </div>
    </div>
  );
};

export default Login;
