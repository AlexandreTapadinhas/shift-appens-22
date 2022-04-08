import { useEffect, useState } from "react";

import { db, auth } from "../../services/firebase";
import { doc, onSnapshot } from "firebase/firestore";

import CustomListEvent from "./components/CustomListEvent";

const Home = ({ user, events }) => {
  const [balance, setBalance] = useState("");

  useEffect(() => {
    onSnapshot(doc(db, "users", user.uid), (doc) => {
      setBalance(doc.data().balance);
    });
  }, []);

  return (
    <div className="">
      <div className="flex flex-row pt-6 pl-6">
        <img className="rounded-full" src={user.photoURL} alt="" />
        <div className="pl-8 pt-2">
          <h1 className="text-2xl font-bold">
            {user.displayName} <br />
          </h1>
          <h1 className="text-xl">Saldo: {balance}€</h1>
        </div>
      </div>
      <div className="grid grid-cols-1 divide-y-2 divide-gray-600">
        <div className="pt-6 pl-8 pb-6 text-xl">
          <button onClick={() => auth.signOut()}>Sign out</button>
        </div>
        <div className="flex justify-center pt-10">
          {events.map(({ id, data }) => (
            <CustomListEvent
              key={id}
              title={data.title}
              timeStart={data.timeStart}
              timeEnd={data.timeEnd}
              description={data.description}
              photo={data.photo}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
