import { useEffect, useState } from "react";

import { db, auth } from "../../services/firebase";
import { doc, onSnapshot } from "firebase/firestore";

const Home = ({ user }) => {
  const [balance, setBalance] = useState("");

  useEffect(() => {
    onSnapshot(doc(db, "users", user.uid), (doc) => {
      setBalance(doc.data().balance);
    });
  }, []);

  return (
    <div className="home">
      <h1>
        Hello, <span></span>
        {user.displayName} <br />
        {balance}
      </h1>
      <img src={user.photoURL} alt="" />
      <button onClick={() => auth.signOut()}>Sign out</button>
    </div>
  );
};

export default Home;
