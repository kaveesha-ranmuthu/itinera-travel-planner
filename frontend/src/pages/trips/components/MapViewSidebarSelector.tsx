import React from "react";
import { twMerge } from "tailwind-merge";

export type MapViewSidebarSelectorOptions = "itinerary" | "locations";

interface MapViewSidebarSelectorProps {
  selectedView: MapViewSidebarSelectorOptions;
  onSelectView: (view: MapViewSidebarSelectorOptions) => void;
}

const MapViewSidebarSelector: React.FC<MapViewSidebarSelectorProps> = ({
  selectedView = "itinerary",
  onSelectView,
}) => {
  return (
    <div className="border border-secondary w-fit rounded-lg divide-x divide-secondary py-1 text-base text-secondary">
      <span
        className={twMerge(
          "px-2 cursor-pointer hover:opacity-100 transition ease-in-out duration-300",
          selectedView === "itinerary" ? "opacity-100" : "opacity-60"
        )}
        onClick={() => onSelectView("itinerary")}
      >
        Itinerary
      </span>
      <span
        className={twMerge(
          "px-2 cursor-pointer hover:opacity-100 transition ease-in-out duration-300",
          selectedView === "locations" ? "opacity-100" : "opacity-60"
        )}
        onClick={() => onSelectView("locations")}
      >
        Locations
      </span>
    </div>
  );
};

export default MapViewSidebarSelector;
