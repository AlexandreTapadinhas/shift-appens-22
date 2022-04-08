import { useState, useEffect } from "react";

import { db } from "./services/firebase";
import { doc, onSnapshot } from "firebase/firestore";

import Login from "./components/Login";
import HomeClient from "./components/Client/HomeClient";
import HomeAdmin from "./components/Admin/HomeAdmin";
import HomeSeller from "./components/Seller/HomeSeller";
import firebase from "./services/firebase";

import "./App.css";

function App() {
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState("");
  const [events, setEvents] = useState(null);

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      setUser(user);
      onSnapshot(doc(db, "users", user.uid), (doc) => {
        setUserType(doc.data().type);
      });
    });
  }, []);

  //load events
  useEffect(() => {
    db.collection("events").onSnapshot((snapshot) =>
      setEvents(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }))
      )
    );
  }, []);

  return (
    <div className="app">
      {!user ? (
        <Login />
      ) : (
        <>
          {userType === "0" ? <HomeClient user={user} events={events} /> : null}
          {userType === "1" ? <HomeSeller user={user} /> : null}
          {userType === "2" ? <HomeAdmin user={user} /> : null}
        </>
      )}
    </div>
  );
}

export default App;
