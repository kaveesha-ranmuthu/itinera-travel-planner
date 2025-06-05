import React from "react";
import { AccommodationRow } from "./sections/Accommodation";
import { LocationCardDetails } from "./LocationWithPhotoCard";
import { sortBy } from "lodash";

interface SidebarLocationSectionProps {
  locations: AccommodationRow[] | LocationCardDetails[];
  title: string;
  userCurrencySymbol?: string;
}

const SidebarLocationSection: React.FC<SidebarLocationSectionProps> = ({
  locations,
  title,
  userCurrencySymbol,
}) => {
  const sortedLocations = sortBy(locations, ["name"]) as
    | AccommodationRow[]
    | LocationCardDetails[];

  return (
    <div>
      <h1 className="text-2xl mb-1">{title}</h1>
      <div className="border-l-2 pl-3 pr-1 border-secondary text-secondary/70 space-y-2">
        {sortedLocations.map((l) => {
          return (
            <div className="text-secondary/70 flex justify-between items-center">
              <p className="truncate max-w-[85%]">{l.name}</p>
              {isLocationCardDetails(l) && !!l.averagePrice && (
                <div>
                  <span>{userCurrencySymbol}</span>
                  <span>{l.averagePrice}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const isLocationCardDetails = (
  location: AccommodationRow | LocationCardDetails
): location is LocationCardDetails => {
  return "averagePrice" in location;
};

export default SidebarLocationSection;
