import React from "react";
import { twMerge } from "tailwind-merge";
import { mapPicturesToId } from "../assets/map-pictures";
import { useGetMapSettings } from "../hooks/getters/useGetMapSettings";
import { useSaveIconStyles } from "../hooks/setters/useSaveIconStyles";
import { useSaveMapStyle } from "../hooks/setters/useSaveMapStyle";
import { allIcons, iconColours, IconId } from "../icon-map";
import PopoverMenu from "./PopoverMenu";
import { DEFAULT_ICON_STYLES } from "../constants";
import { ErrorBox } from "./InfoBox";
interface CustomiseMapProps {
  tripId: string;
}

const CustomiseMap: React.FC<CustomiseMapProps> = ({ tripId }) => {
  const { mapSettings, error } = useGetMapSettings(tripId);
  const { saveMapStyle } = useSaveMapStyle();

  if (error) {
    return <ErrorBox />;
  }

  const selectedMapStyle = mapSettings.mapStyle;
  const {
    accommodation: accommodationIcon,
    activity: activityIcon,
    food: foodIcon,
  } = {
    accommodation: {
      ...DEFAULT_ICON_STYLES.accommodation,
      ...mapSettings.iconStyles.accommodation,
    },
    activity: {
      ...DEFAULT_ICON_STYLES.activity,
      ...mapSettings.iconStyles.activity,
    },
    food: {
      ...DEFAULT_ICON_STYLES.food,
      ...mapSettings.iconStyles.food,
    },
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-xl">Map style</h1>
        <div className="flex flex-wrap gap-4">
          {mapPicturesToId.map((mapPicture) => {
            return (
              <img
                key={mapPicture.id}
                width={130}
                src={mapPicture.src}
                onClick={() => saveMapStyle(tripId, mapPicture.id)}
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
          tripId={tripId}
        />
        <Icon
          icon={allIcons[foodIcon.id]}
          label="food"
          backgroundColour={foodIcon.backgroundColour}
          iconColour={foodIcon.colour}
          tripId={tripId}
        />
        <Icon
          icon={allIcons[activityIcon.id]}
          label="activity"
          backgroundColour={activityIcon.backgroundColour}
          iconColour={activityIcon.colour}
          tripId={tripId}
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
  tripId: string;
}

const Icon: React.FC<IconProps> = ({
  icon,
  label,
  backgroundColour,
  iconColour,
  tripId,
}) => {
  const { saveIcon, saveIconBackgroundColour, saveIconColour } =
    useSaveIconStyles();

  const handleUpdateIcon = (iconId: IconId) => {
    saveIcon(tripId, iconId, label);
  };

  const handleUpdateIconColour = (colour: string) => {
    saveIconColour(tripId, colour, label);
  };

  const handleUpdateIconBackgroundColour = (colour: string) => {
    saveIconBackgroundColour(tripId, colour, label);
  };

  return (
    <div className="flex items-center space-x-3">
      <IconStylesPopover
        onUpdateIcon={handleUpdateIcon}
        onUpdateIconColour={handleUpdateIconColour}
        onUpdateIconBackgroundColour={handleUpdateIconBackgroundColour}
        popoverTrigger={
          <div
            className={twMerge(
              backgroundColour,
              iconColour,
              "cursor-pointer hover:opacity-80 hover:scale-97 transition ease-in-out duration-300 p-2 rounded-full border-2 border-primary/70 w-10 h-10 flex items-center justify-center"
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
      panelClassName="mt-1 h-36"
    >
      <div className="space-y-3">
        <div className="space-y-2">
          <h1>Icon colour</h1>
          <div className="flex gap-2 flex-wrap">
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
          <div className="flex gap-2 flex-wrap">
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
