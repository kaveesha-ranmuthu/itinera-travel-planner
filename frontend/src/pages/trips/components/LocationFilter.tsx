import React from "react";
import PopoverMenu from "./PopoverMenu";
import { Slider } from "radix-ui";
import { MdFilterList } from "react-icons/md";
import { twMerge } from "tailwind-merge";

interface LocationFilterProps {
  locations: string[];
  selectedLocations: string[];
  handleLocationSelect: (locations: string[]) => void;
  maxPrice?: number;
  userCurrencySymbol?: string;
  selectedPrices?: number[];
  handlePriceChange: (prices: number[]) => void;
}

const LocationFilter: React.FC<LocationFilterProps> = ({
  locations,
  selectedLocations,
  handleLocationSelect,
  maxPrice,
  userCurrencySymbol,
  selectedPrices,
  handlePriceChange,
}) => {
  return (
    <PopoverMenu
      anchor="bottom start"
      panelClassName="h-fit pb-7"
      popoverTrigger={
        <div className="cursor-pointer hover:opacity-70 transition ease-in-out duration-300">
          <MdFilterList size={25} className="text-secondary" />
        </div>
      }
    >
      <h1 className="text-lg">Filter by</h1>
      <div className="my-1">
        <h1 className="text-base mb-1">location</h1>
        <div className="flex space-x-2 flex-wrap gap-y-2">
          {locations.map((location, index) => {
            return (
              <div
                onClick={() => {
                  const newList = selectedLocations.includes(location)
                    ? selectedLocations.filter(
                        (selectedLocation) => selectedLocation !== location
                      )
                    : [...selectedLocations, location];
                  handleLocationSelect(newList);
                }}
                key={`${location}=${index}`}
                className={twMerge(
                  "bg-secondary/20 text-sm hover:bg-secondary/80 hover:text-primary hover:scale-95 transition ease-in-out duration-300 cursor-pointer w-fit px-3 rounded-xl py-1",
                  selectedLocations.includes(location)
                    ? "bg-secondary/80 text-primary"
                    : ""
                )}
              >
                {location}
              </div>
            );
          })}
        </div>
      </div>
      {!!maxPrice && (
        <div className="mt-4">
          <h1 className="text-base mb-1">price</h1>
          <Slider.Root
            className="relative flex h-5 w-full touch-none select-none items-center"
            defaultValue={selectedPrices ?? [0, maxPrice]}
            max={maxPrice}
            step={5}
            minStepsBetweenThumbs={1}
            onValueChange={(value) => handlePriceChange(value)}
          >
            <Slider.Track className="relative h-[3px] grow rounded-full bg-secondary/60">
              <Slider.Range className="absolute h-full rounded-full bg-secondary" />
            </Slider.Track>
            <Slider.Thumb className="group hover:scale-105 cursor-pointer flex flex-col items-center size-4 text-sm rounded-[10px] bg-secondary focus:outline-none">
              <span className="mt-4 opacity-0 group-hover:opacity-100 transition ease-in-out duration-300">
                {userCurrencySymbol}
                {selectedPrices?.[0] || 0}
              </span>
            </Slider.Thumb>
            <Slider.Thumb className="group hover:scale-105 cursor-pointer flex flex-col items-center size-4 text-sm rounded-[10px] bg-secondary focus:outline-none">
              <span className="mt-4 opacity-0 group-hover:opacity-100 transition ease-in-out duration-300">
                {userCurrencySymbol}
                {selectedPrices?.[1] || maxPrice}
              </span>
            </Slider.Thumb>
          </Slider.Root>
        </div>
      )}
    </PopoverMenu>
  );
};

export default LocationFilter;
