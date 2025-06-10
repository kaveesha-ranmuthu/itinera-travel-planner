import React from "react";

import { sortBy } from "lodash";
import { IoCloseOutline } from "react-icons/io5";
import { twMerge } from "tailwind-merge";
import { useAuth } from "../../../hooks/useAuth";
import { FontFamily } from "../../../types";
import {
  AccommodationDetails,
  LocationCategories,
  LocationDetails,
} from "../types";
import Checkbox from "./Checkbox";
import WarningConfirmationModal from "./WarningConfirmationModal";

export interface SidebarLocationDetails {
  locations: LocationDetails[];
  title: LocationCategories;
  toggleVisibility: (show: boolean) => void;
  isHidden: boolean;
}

interface SidebarLocationSectionProps extends SidebarLocationDetails {
  userCurrencySymbol?: string;
  selected: boolean;
  onSelect: () => void;
  onDelete: (locationId: string) => void;
}

const SidebarLocationSection: React.FC<SidebarLocationSectionProps> = ({
  locations,
  title,
  userCurrencySymbol,
  selected,
  onSelect,
  onDelete,
  toggleVisibility,
  isHidden,
}) => {
  const sortedLocations = sortBy(locations, ["name"]);
  const { settings } = useAuth();

  const [rowToDelete, setRowToDelete] = React.useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);

  return (
    <div
      className={twMerge(
        selected
          ? "opacity-100"
          : "opacity-40 hover:opacity-100 transition ease-in-out duration-500 cursor-pointer"
      )}
      onClick={onSelect}
    >
      <div className="flex items-center space-x-2">
        <Checkbox
          checked={!isHidden}
          onClick={() => toggleVisibility(!isHidden)}
          className={twMerge(
            "w-4 h-4 rounded",
            settings?.font === FontFamily.HANDWRITTEN && "mt-1",
            !selected && "pointer-events-none"
          )}
        />
        <h1 className="text-2xl mb-1">{title}</h1>
      </div>
      <div className="border-l-2 pl-1 ml-2 border-secondary text-secondary/70">
        {sortedLocations.map((l) => {
          return (
            <div
              className={twMerge(
                "relative text-secondary/70 flex justify-between items-center rounded-lg group px-3 py-1",
                selected &&
                  "hover:bg-secondary/5 transition ease-in-out duration-500"
              )}
            >
              <p className="truncate max-w-[85%]">{l.name}</p>
              {!isAccommodationDetails(l) && !!l.price && (
                <div
                  className={twMerge(
                    "opacity-100 absolute right-3 transition ease-in-out duration-300",
                    selected && "group-hover:opacity-0 "
                  )}
                >
                  <span>{userCurrencySymbol}</span>
                  <span>{l.price}</span>
                </div>
              )}
              {selected && (
                <IoCloseOutline
                  onClick={() => {
                    setIsDeleteModalOpen(true);
                    setRowToDelete(l.id);
                  }}
                  size={20}
                  className={twMerge(
                    "absolute cursor-pointer right-3 hover:opacity-80 hover:scale-95 group-hover:opacity-100 opacity-0 text-secondary transition duration-300 ease-in-out",
                    settings?.font === FontFamily.HANDWRITTEN ? "mt-1" : ""
                  )}
                />
              )}
            </div>
          );
        })}
        <WarningConfirmationModal
          isOpen={isDeleteModalOpen}
          title="Are you sure you want to delete this location?"
          description="Once deleted, this location is gone forever. Are you sure you want to continue?"
          onConfirm={() => {
            if (!rowToDelete) return;
            onDelete(rowToDelete);
            setRowToDelete(null);
            setIsDeleteModalOpen(false);
          }}
          onClose={() => {
            setRowToDelete(null);
            setIsDeleteModalOpen(false);
          }}
        />
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
