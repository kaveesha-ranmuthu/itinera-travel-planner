import React from "react";

import { sortBy } from "lodash";
import { AccommodationDetails, LocationDetails } from "../types";

interface SidebarLocationSectionProps {
  locations: LocationDetails[];
  title: string;
  userCurrencySymbol?: string;
}

const SidebarLocationSection: React.FC<SidebarLocationSectionProps> = ({
  locations,
  title,
  userCurrencySymbol,
}) => {
  const sortedLocations = sortBy(locations, ["name"]);

  return (
    <div>
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
