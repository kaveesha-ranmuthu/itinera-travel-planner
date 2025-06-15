import { mapPicturesToId } from "../assets/map-pictures";

const CustomiseMap = () => {
  return (
    <div>
      <div className="space-y-2">
        <h1 className="text-xl">Map style</h1>
        <div className="flex flex-wrap gap-4">
          {mapPicturesToId.map((mapPicture) => {
            return (
              <img
                width={130}
                src={mapPicture.src}
                className="border rounded-sm cursor-pointer"
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CustomiseMap;
