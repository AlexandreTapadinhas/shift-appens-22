import { useEffect, useState } from "react";

const Event = ({ eventInfo }) => {
  const [buyFood, setBuyFood] = useState(false);

  return (
    <div>
      {(() => {
        if (buyFood === false) {
          return (
            <div className="font-bold text-2xl pt-10">
              <h1>{eventInfo.title}</h1>
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
            <div className="flex justify-center text-center">
              <div className="font-bold text-2xl pt-10">
                Loja - {eventInfo.title}
              </div>
            </div>
          );
        }
      })()}
    </div>
  );
};

export default Event;
