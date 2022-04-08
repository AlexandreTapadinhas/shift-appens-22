import { useEffect, useState } from "react";

import { db, auth } from "../../services/firebase";
import { doc, onSnapshot } from "firebase/firestore";

const HomeAdmin = ({ user }) => {
  const [balance, setBalance] = useState("");

  useEffect(() => {
    onSnapshot(doc(db, "users", user.uid), (doc) => {
      setBalance(doc.data().balance);
    });
  }, []);

  console.log("oiii");

  return (
    <div className="home">
      <h1>
        Hello, Admin<span></span>
        {user.displayName} <br />
        {balance}
      </h1>
      <img src={user.photoURL} alt="" />
      <button onClick={() => auth.signOut()}>Sign out</button>
    </div>
  );
};

export default HomeAdmin;
