import React from "react";
import { twMerge } from "tailwind-merge";
import { MapViewSidebarSelectorOptions } from "../types";

interface MapViewSidebarSelectorProps {
  selectedView: MapViewSidebarSelectorOptions;
  onSelectView: (view: MapViewSidebarSelectorOptions) => void;
}

const MapViewSidebarSelector: React.FC<MapViewSidebarSelectorProps> = ({
  selectedView = "itinerary",
  onSelectView,
}) => {
  return (
    <div className="flex items-center justify-between">
      <div className="border border-secondary w-fit rounded-lg divide-x divide-secondary py-1 text-base text-secondary">
        <span
          className={twMerge(
            "px-2 cursor-pointer hover:opacity-100 transition ease-in-out duration-300",
            selectedView === MapViewSidebarSelectorOptions.ITINERARY
              ? "opacity-100"
              : "opacity-60"
          )}
          onClick={() => onSelectView(MapViewSidebarSelectorOptions.ITINERARY)}
        >
          Itinerary
        </span>
        <span
          className={twMerge(
            "px-2 cursor-pointer hover:opacity-100 transition ease-in-out duration-300",
            selectedView === MapViewSidebarSelectorOptions.LOCATIONS
              ? "opacity-100"
              : "opacity-60"
          )}
          onClick={() => onSelectView(MapViewSidebarSelectorOptions.LOCATIONS)}
        >
          Locations
        </span>
      </div>
      <div className="border border-secondary w-fit rounded-lg divide-x divide-secondary py-1 text-base text-secondary">
        <span
          className={twMerge(
            "px-2 cursor-pointer hover:opacity-100 transition ease-in-out duration-300",
            selectedView === MapViewSidebarSelectorOptions.CUSTOMISE_MAP
              ? "opacity-100"
              : "opacity-60"
          )}
          onClick={() =>
            onSelectView(MapViewSidebarSelectorOptions.CUSTOMISE_MAP)
          }
        >
          Customise map
        </span>
      </div>
    </div>
  );
};

export default MapViewSidebarSelector;
