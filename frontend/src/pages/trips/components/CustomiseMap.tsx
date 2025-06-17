import { twMerge } from "tailwind-merge";
import { auth } from "../../../firebase-config";
import { useAuth } from "../../../hooks/useAuth";
import { useHotToast } from "../../../hooks/useHotToast";
import { mapPicturesToId } from "../assets/map-pictures";
import { useUpdateUserSettings } from "../hooks/setters/useUpdateUserSettings";
import { MapViewStyles } from "../types";
import { DEFAULT_ICON_STYLES } from "../constants";
import { allIcons } from "../icon-map";
import React from "react";

const CustomiseMap = () => {
  const { settings, setSettings } = useAuth();
  const { updateSettings } = useUpdateUserSettings();
  const { notify } = useHotToast();

  const selectedMapStyle = settings?.mapStyle || MapViewStyles.STREETS;
  const {
    accommodation: accommodationIcon,
    activity: activityIcon,
    food: foodIcon,
  } = settings?.iconStyle || DEFAULT_ICON_STYLES;

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
                  selectedMapStyle === mapPicture.id
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
        <Icon icon={allIcons[accommodationIcon]} label="accommodation" />
        <Icon icon={allIcons[foodIcon]} label="food" />
        <Icon icon={allIcons[activityIcon]} label="activity" />
      </div>
    </div>
  );
};

interface IconProps {
  icon: React.ReactNode;
  label: string;
}

const Icon: React.FC<IconProps> = ({ icon, label }) => {
  return (
    <div className="flex items-center space-x-3">
      <div
        className={twMerge(
          "p-2 rounded-full border border-secondary w-10 h-10 flex items-center justify-center"
        )}
      >
        <span>{icon}</span>
      </div>
      <p>{label}</p>
    </div>
  );
};

export default CustomiseMap;
