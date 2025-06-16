import { twMerge } from "tailwind-merge";
import { auth } from "../../../firebase-config";
import { useAuth } from "../../../hooks/useAuth";
import { useHotToast } from "../../../hooks/useHotToast";
import { mapPicturesToId } from "../assets/map-pictures";
import { useUpdateUserSettings } from "../hooks/setters/useUpdateUserSettings";
import { MapViewStyles } from "../types";

const CustomiseMap = () => {
  const { settings, setSettings } = useAuth();
  const { updateSettings } = useUpdateUserSettings();
  const { notify } = useHotToast();

  const selectedStyle = settings?.mapStyle || MapViewStyles.STREETS;

  const updateMapStyle = async (mapStyle: MapViewStyles) => {
    if (auth.currentUser) {
      try {
        await updateSettings({
          ...settings!,
          mapStyle,
        });
        setSettings({ ...settings!, mapStyle });
      } catch {
        notify("Something went wrong. Please try again.", "error");
      }
    }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-xl">Map style</h1>
        <div className="flex flex-wrap gap-4">
          {mapPicturesToId.map((mapPicture) => {
            return (
              <img
                width={130}
                src={mapPicture.src}
                onClick={() => updateMapStyle(mapPicture.id)}
                className={twMerge(
                  "border rounded-sm",
                  selectedStyle === mapPicture.id
                    ? "opacity-100"
                    : "opacity-20 cursor-pointer hover:opacity-80 transition ease-in-out duration-300 hover:scale-99"
                )}
              />
            );
          })}
        </div>
      </div>
      <div className="space-y-2">
        <h1 className="text-xl">Icon styles</h1>
        <div className="flex flex-wrap gap-4"></div>
      </div>
    </div>
  );
};

export default CustomiseMap;
