import React from "react";

import { sortBy } from "lodash";
import { AccommodationDetails, LocationDetails } from "../types";
import { twMerge } from "tailwind-merge";

interface SidebarLocationSectionProps {
  locations: LocationDetails[];
  title: string;
  userCurrencySymbol?: string;
  selected: boolean;
  onSelect: () => void;
}

const SidebarLocationSection: React.FC<SidebarLocationSectionProps> = ({
  locations,
  title,
  userCurrencySymbol,
  selected,
  onSelect,
}) => {
  const sortedLocations = sortBy(locations, ["name"]);

  return (
    <div
      className={twMerge(
        "cursor-pointer",
        selected
          ? "opacity-100"
          : "opacity-40 hover:opacity-100 transition ease-in-out duration-300"
      )}
      onClick={onSelect}
    >
      <h1 className="text-2xl mb-1">{title}</h1>
      <div className="border-l-2 pl-3 pr-1 border-secondary text-secondary/70 space-y-2">
        {sortedLocations.map((l) => {
          return (
            <div className="text-secondary/70 flex justify-between items-center">
              <p className="truncate max-w-[85%]">{l.name}</p>
              {!isAccommodationDetails(l) && !!l.price && (
                <div>
                  <span>{userCurrencySymbol}</span>
                  <span>{l.price}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const isAccommodationDetails = (
  location: LocationDetails
): location is AccommodationDetails => {
  return "pricePerNightPerPerson" in location;
};

export default SidebarLocationSection;
