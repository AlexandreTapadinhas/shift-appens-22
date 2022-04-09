import { useState, useEffect } from "react";

import { FaArrowCircleLeft } from "react-icons/fa";

import HomeClient from "./HomeClient";

import { db } from "../../services/firebase";

import CustomListShop from "./components/customListShop";

const Event = ({ user, events, eventInfo, eventID }) => {
  const [buyFood, setBuyFood] = useState(false);
  const [goToEvents, setGoToEvents] = useState(false);
  const [shops, setShops] = useState(false);

  function StoreCode() {
    const ClickedStore = (shop_id) => {
      console.log(shop_id);
    };

    return (
      <div>
        <h1 className="font-bold text-2xl pl-5">Loja - {eventInfo.title}</h1>
        <div className="pl-10 sm:justify-center pt-10 grid 2xl:grid-cols-4 xl:grid-cols-3 md:grid-cols-3 gap-10">
          <FaArrowCircleLeft onClick={() => setBuyFood(false)} size={30} />
          {shops.map(({ id, data }) => [
            <div onClick={() => ClickedStore(id)}>
              <CustomListShop key={id} title={data.title} photo={data.photo} />
            </div>,
          ])}
        </div>
      </div>
    );
  }

  useEffect(() => {
    const unsubscribe = db
      .collection("events")
      .doc(eventID)
      .collection("shops")
      .onSnapshot((snapshot) =>
        setShops(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            data: doc.data(),
          }))
        )
      );
    return unsubscribe;
  }, []);

  return (
    <div>
      {(() => {
        if (goToEvents === true) {
          return <HomeClient user={user} events={events} header={false} />;
        }
        if (buyFood === false) {
          return (
            <div className="font-bold text-2xl pt-10">
              <div className="flex flex-row justify-center text-center">
                <FaArrowCircleLeft
                  onClick={() => setGoToEvents(true)}
                  size={30}
                />
                <h1 className="pl-5">{eventInfo.title}</h1>
              </div>

              <div>
                <img
                  className="flex justify-center mt-10 rounded-2xl"
                  src={eventInfo.photo}
                ></img>
              </div>
              <h1 className="pt-5">{eventInfo.description}</h1>
              <h1 onClick={() => setBuyFood(true)} className="pt-5">
                Aceder à loja
              </h1>
            </div>
          );
        } else {
          return (
            <div className="justify-center text-center pt-10">
              <StoreCode />
            </div>
          );
        }
      })()}
    </div>
  );
};

export default Event;
