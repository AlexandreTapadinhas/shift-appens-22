import { useState } from "react";

import { FaArrowCircleLeft } from "react-icons/fa";

import HomeClient from "./HomeClient";

const Event = ({ user, events, eventInfo }) => {
  const [buyFood, setBuyFood] = useState(false);
  const [goToEvents, setGoToEvents] = useState(false);

  function StoreCode() {
    return (
      <div className="flex flex-row">
        <FaArrowCircleLeft onClick={() => setBuyFood(false)} size={30} />
        <h1 className="font-bold text-2xl pl-5">Loja - {eventInfo.title}</h1>
      </div>
    );
  }

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
                Aceder á loja
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
