import React from "react";
import PopoverMenu from "./PopoverMenu";
import { Slider } from "radix-ui";
import { twMerge } from "tailwind-merge";
import SmallButton from "./SmallButton";
import { useAuth } from "../../../hooks/useAuth";
import { HiEllipsisVertical } from "react-icons/hi2";
import ViewSelector, { ViewDisplayOptions } from "./ViewSelector";
import Checkbox from "./Checkbox";
import Button from "../../../components/Button";

interface ListSettingsProps {
  locations: string[];
  selectedLocations: string[];
  handleLocationSelect: (locations: string[]) => void;
  maxPrice?: number;
  userCurrencySymbol?: string;
  selectedPrices?: number[];
  handlePriceChange: (prices: number[] | undefined) => void;
  selectedListView?: ViewDisplayOptions;
  onSelectView?: (view: ViewDisplayOptions) => void;
  onDelete?: () => void;
}

const ListSettings: React.FC<ListSettingsProps> = ({
  locations,
  selectedLocations,
  handleLocationSelect,
  maxPrice,
  userCurrencySymbol,
  selectedPrices,
  handlePriceChange,
  onSelectView,
  selectedListView,
  onDelete,
}) => {
  const { settings } = useAuth();

  const onLocationSelect = (location: string) => {
    const newList = selectedLocations.includes(location)
      ? selectedLocations.filter(
          (selectedLocation) => selectedLocation !== location
        )
      : [...selectedLocations, location];
    handleLocationSelect(newList);
  };

  return (
    <PopoverMenu
      anchor="bottom end"
      panelClassName={twMerge("h-fit pb-7 mt-3", settings?.font)}
      popoverTrigger={
        <div className="-mb-2 cursor-pointer hover:opacity-70 transition ease-in-out duration-300">
          <HiEllipsisVertical size={22} className="text-secondary" />
        </div>
      }
    >
      <h1 className="text-lg mb-1">List settings</h1>
      <div className="divide-y divide-secondary/20 space-y-3">
        {!!selectedListView && !!onSelectView && !!locations.length && (
          <div className="pb-4">
            <h1 className="text-md mb-1">View</h1>
            <ViewSelector
              selectedView={selectedListView}
              onSelectView={onSelectView}
            />
          </div>
        )}
        {!!locations.length && (
          <div className="not-last:pb-3">
            <div className="flex items-center justify-between">
              <h1 className="text-md">Filter by</h1>
              <div className="mt-1">
                <SmallButton
                  onClick={() => {
                    handlePriceChange(undefined);
                    handleLocationSelect([]);
                  }}
                >
                  Clear all
                </SmallButton>
              </div>
            </div>
            <div className="my-1">
              <h1 className="text-base mb-1">location</h1>
              <div className="grid grid-cols-2 gap-2">
                {locations.map((location, index) => {
                  return (
                    <div
                      key={`${location}=${index}`}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        onClick={() => onLocationSelect(location)}
                        checked={selectedLocations.includes(location)}
                        className="min-w-4 min-h-4 w-4 h-4 rounded mt-0.5"
                      />
                      <span className="truncate">{location}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            {!!maxPrice && maxPrice > 0 && (
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
          </div>
        )}
        {!!onDelete && (
          <div className="mt-4">
            <Button.Danger
              className={twMerge("not-italic text-sm", settings?.font)}
              onClick={onDelete}
            >
              Delete list
            </Button.Danger>
          </div>
        )}
      </div>
    </PopoverMenu>
  );
};

export default ListSettings;
