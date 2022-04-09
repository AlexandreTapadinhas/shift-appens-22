const Event = ({ eventInfo }) => {
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
    </div>
  );
};

export default Event;
