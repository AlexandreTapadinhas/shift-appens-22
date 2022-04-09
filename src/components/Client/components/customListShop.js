const CustomListShop = ({ id, title, photo }) => {
  return (
    <div className="pb-10">
      <div class="max-w-sm rounded-2xl overflow-hidden shadow-lg transform transition duration-500 hover:scale-105">
        <img class="w-full" src={photo} alt="Sunset in the mountains" />
        <div class="px-6 py-4">
          <div class="font-bold text-xl mb-2">{title}</div>
        </div>
      </div>
    </div>
  );
};

export default CustomListShop;
