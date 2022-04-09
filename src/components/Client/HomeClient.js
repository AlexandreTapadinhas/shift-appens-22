import { useEffect, useState } from "react";

import { db, auth } from "../../services/firebase";
import { doc, onSnapshot } from "firebase/firestore";

import CustomListEvent from "./components/CustomListEvent";
import Event from "./Event";

const Home = ({ user, events, header }) => {
  const [balance, setBalance] = useState("");
  const [eventSelected, setEventSelected] = useState("");
  const [eventInfo, setEventInfo] = useState(null);

  useEffect(() => {
    onSnapshot(doc(db, "users", user.uid), (doc) => {
      setBalance(doc.data().balance);
    });
  }, []);

  function clickedEvent(event_id) {
    setEventSelected(event_id);
    events.map(({ id, data }) => {
      if (id == event_id) {
        setEventInfo(data);
      }
    });
  }

  function HeaderCode() {
    if (header == false) {
      return null;
    } else {
      return (
        <div>
          <div className="flex flex-row pt-6 pl-6">
            <img className="rounded-full" src={user.photoURL} alt="" />
            <div className="pl-8 pt-2">
              <h1 className="text-2xl font-bold">
                {user.displayName} <br />
              </h1>
              <h1 className="text-xl">Saldo: {balance}€</h1>
            </div>
          </div>
          <div className="pt-6 pl-8 pb-6 text-xl">
            <button onClick={() => auth.signOut()}>Sign out</button>
          </div>
        </div>
      );
    }
  }

  function EventsCode() {
    if (eventSelected === "") {
      return (
        <div className="pl-10 sm:justify-center pt-10 grid 2xl:grid-cols-4 gap-4 xl:grid-cols-3 md:grid-cols-2 ">
          {events.map(({ id, data }) => [
            <div onClick={() => clickedEvent(id)}>
              <CustomListEvent
                key={id}
                title={data.title}
                timeStart={data.timeStart}
                timeEnd={data.timeEnd}
                description={data.description}
                photo={data.photo}
              />
            </div>,
          ])}
        </div>
      );
    } else {
      return (
        <div className="flex justify-center text-center">
          <Event
            user={user}
            events={events}
            eventInfo={eventInfo}
            eventID={eventSelected}
          />
        </div>
      );
    }
  }

  return (
    <div className="">
      <HeaderCode />
      <EventsCode />
    </div>
  );
};

export default Home;
