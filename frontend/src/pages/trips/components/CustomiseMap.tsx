import React from "react";
import { twMerge } from "tailwind-merge";
import { auth } from "../../../firebase-config";
import { useAuth } from "../../../hooks/useAuth";
import { useHotToast } from "../../../hooks/useHotToast";
import { mapPicturesToId } from "../assets/map-pictures";
import { DEFAULT_ICON_STYLES } from "../constants";
import { useUpdateUserSettings } from "../hooks/setters/useUpdateUserSettings";
import { allIcons, iconColours, IconId } from "../icon-map";
import { MapViewStyles } from "../types";
import PopoverMenu from "./PopoverMenu";

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
        <Icon
          icon={allIcons[accommodationIcon.id]}
          label="accommodation"
          backgroundColour={accommodationIcon.backgroundColour}
          iconColour={accommodationIcon.colour}
        />
        <Icon
          icon={allIcons[foodIcon.id]}
          label="food"
          backgroundColour={foodIcon.backgroundColour}
          iconColour={foodIcon.colour}
        />
        <Icon
          icon={allIcons[activityIcon.id]}
          label="activity"
          backgroundColour={activityIcon.backgroundColour}
          iconColour={activityIcon.colour}
        />
      </div>
    </div>
  );
};

interface IconProps {
  icon: React.ReactNode;
  label: string;
  backgroundColour: string;
  iconColour: string;
}

const Icon: React.FC<IconProps> = ({
  icon,
  label,
  backgroundColour,
  iconColour,
}) => {
  const { settings, setSettings } = useAuth();
  const { updateSettings } = useUpdateUserSettings();
  const { notify } = useHotToast();

  const updateIcon = async (iconId: IconId) => {
    if (auth.currentUser) {
      const currentIconStyle = settings?.iconStyle || DEFAULT_ICON_STYLES;
      const newIconStyle = {
        ...currentIconStyle,
        [label]: {
          ...currentIconStyle[label],
          id: iconId,
        },
      };

      try {
        await updateSettings({
          ...settings!,
          iconStyle: newIconStyle,
        });
        setSettings({ ...settings!, iconStyle: newIconStyle });
      } catch {
        notify("Something went wrong. Please try again.", "error");
      }
    }
  };

  const updateIconColour = async (colour: string) => {
    if (auth.currentUser) {
      const currentIconStyle = settings?.iconStyle || DEFAULT_ICON_STYLES;
      const newIconStyle = {
        ...currentIconStyle,
        [label]: {
          ...currentIconStyle[label],
          colour,
        },
      };

      try {
        await updateSettings({
          ...settings!,
          iconStyle: newIconStyle,
        });
        setSettings({ ...settings!, iconStyle: newIconStyle });
      } catch {
        notify("Something went wrong. Please try again.", "error");
      }
    }
  };

  const updateIconBackgroundColour = async (colour: string) => {
    if (auth.currentUser) {
      const currentIconStyle = settings?.iconStyle || DEFAULT_ICON_STYLES;
      const newIconStyle = {
        ...currentIconStyle,
        [label]: {
          ...currentIconStyle[label],
          backgroundColour: colour,
        },
      };

      try {
        await updateSettings({
          ...settings!,
          iconStyle: newIconStyle,
        });
        setSettings({ ...settings!, iconStyle: newIconStyle });
      } catch {
        notify("Something went wrong. Please try again.", "error");
      }
    }
  };

  return (
    <div className="flex items-center space-x-3">
      <IconStylesPopover
        onUpdateIcon={updateIcon}
        onUpdateIconColour={updateIconColour}
        onUpdateIconBackgroundColour={updateIconBackgroundColour}
        popoverTrigger={
          <div
            className={twMerge(
              backgroundColour,
              iconColour,
              "cursor-pointer hover:opacity-80 hover:scale-97 transition ease-in-out duration-300 p-2 rounded-full border border-secondary w-10 h-10 flex items-center justify-center"
            )}
          >
            <span>{icon}</span>
          </div>
        }
      />
      <p>{label}</p>
    </div>
  );
};

interface IconStylesPopoverProps {
  popoverTrigger: React.ReactNode;
  onUpdateIcon: (iconId: IconId) => void;
  onUpdateIconColour: (colour: string) => void;
  onUpdateIconBackgroundColour: (colour: string) => void;
}

const IconStylesPopover: React.FC<IconStylesPopoverProps> = ({
  popoverTrigger,
  onUpdateIcon,
  onUpdateIconColour,
  onUpdateIconBackgroundColour,
}) => {
  return (
    <PopoverMenu
      popoverTrigger={popoverTrigger}
      anchor="bottom start"
      panelClassName="mt-1 h-40"
    >
      <div className="space-y-3">
        <div className="space-y-2">
          <h1>Icon colour</h1>
          <div className="flex space-x-2 flex-wrap">
            {iconColours.map((colour, index) => {
              return (
                <div
                  key={index}
                  onClick={() => onUpdateIconColour(colour.colour)}
                  className={twMerge(
                    colour.backgroundColour,
                    "w-7 h-7 rounded cursor-pointer hover:scale-95 transition ease-in-out duration-300 border border-secondary/30"
                  )}
                />
              );
            })}
          </div>
        </div>
        <div className="space-y-2">
          <h1>Icon background colour</h1>
          <div className="flex space-x-2 flex-wrap">
            {iconColours.map((colour, index) => {
              return (
                <div
                  key={index}
                  onClick={() =>
                    onUpdateIconBackgroundColour(colour.backgroundColour)
                  }
                  className={twMerge(
                    colour.backgroundColour,
                    "w-7 h-7 rounded cursor-pointer hover:scale-95 transition ease-in-out duration-300 border border-secondary/30"
                  )}
                />
              );
            })}
          </div>
        </div>
        <div className="space-y-2">
          <h1>Icon</h1>
          <div className="space-y-4">
            <div className="flex gap-x-5 gap-y-4 flex-wrap">
              {Object.entries(allIcons).map(([id, icon]) => {
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => onUpdateIcon(id as IconId)}
                    className="text-secondary cursor-pointer hover:scale-95 hover:opacity-80 transition ease-in-out duration-300"
                  >
                    {icon}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </PopoverMenu>
  );
};

export default CustomiseMap;
