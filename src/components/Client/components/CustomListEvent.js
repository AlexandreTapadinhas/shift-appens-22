const CustomListEvent = ({
  id,
  title,
  timeStart,
  timeEnd,
  description,
  photo,
}) => {
  return (
    <div className="pb-10">
      <div class="max-w-sm rounded-2xl overflow-hidden shadow-lg transform transition duration-500 hover:scale-105">
        <img class="w-full" src={photo} alt="Sunset in the mountains" />
        <div class="px-6 py-4">
          <div class="font-bold text-xl mb-2">{title}</div>
          <p class="text-gray-700 text-base">{description}</p>
          <div class="font-bold text-xl mb-2 pt-5">
            <h1></h1>Início: {timeStart}
          </div>
          <div class="font-bold text-xl mb-2">Fim: {timeEnd}</div>
        </div>
        <div class="px-6 pt-4 pb-2">
          <span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
            #bebado
          </span>
          <span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
            #PlutónioOutraVez?
          </span>
          <span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
            #Finos
          </span>
        </div>
      </div>
    </div>
  );
};

export default CustomListEvent;
