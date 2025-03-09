import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";
import axios from "axios";
import { debounce } from "lodash";
import React, { useCallback, useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import { useAuth } from "../../../hooks/useAuth";

interface LocationSearchProps {
  disabled?: boolean;
  inputBoxClassname?: string;
  optionsBoxClassname?: string;
  placeholder?: string;
  onSelectLocation: (location: LocationSearchResult) => void;
}

export interface LocationSearchResult {
  id: string;
  formattedAddress?: string;
  location?: {
    latitude?: number;
    longitude?: number;
  };
  displayName?: {
    text?: string;
    languageCode?: string;
  };
  googleMapsLinks?: {
    directionsUri?: string;
    placeUri?: string;
    writeAReviewUri?: string;
    reviewsUri?: string;
    photosUri?: string;
  };
  addressComponents?: {
    languageCode?: string;
    longText?: string;
    shortText?: string;
    types?: string[];
  }[];
}

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const LocationSearch: React.FC<LocationSearchProps> = ({
  disabled,
  inputBoxClassname,
  optionsBoxClassname,
  placeholder,
  onSelectLocation,
}) => {
  const [options, setOptions] = useState<LocationSearchResult[]>([]);
  const [query, setQuery] = useState("");
  const { settings } = useAuth();

  const searchPlaces = useCallback(async (query: string) => {
    try {
      const response = await axios.post(
        "https://places.googleapis.com/v1/places:searchText",
        {
          textQuery: query,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": API_KEY,
            "X-Goog-FieldMask": "*",
          },
        }
      );

      console.log(response.data);
      setOptions(response.data.places);
    } catch (error) {
      console.error("Error fetching places:", error);
    }
  }, []);

  useEffect(() => {
    if (!query) return;
    searchPlaces(query);
  }, [query, searchPlaces]);

  return (
    <Combobox
      onChange={(item: LocationSearchResult) => onSelectLocation(item)}
      onClose={() => setQuery("")}
      immediate
      disabled={disabled}
    >
      <ComboboxInput
        placeholder={placeholder ?? "Search for a location..."}
        onChange={debounce((event) => {
          setQuery(event.target.value);
        }, 500)}
        className={twMerge(
          "focus:outline-secondary border border-secondary rounded-2xl py-1 w-70 h-10 px-3",
          inputBoxClassname
        )}
      />
      {options && !!options.length && (
        <ComboboxOptions
          anchor="bottom start"
          className={twMerge(
            "bg-primary border border-secondary w-3xs rounded-lg mt-1",
            settings?.font,
            optionsBoxClassname
          )}
        >
          {options.map((opt) => {
            return (
              <ComboboxOption
                key={opt.id}
                value={opt}
                className="space-x-2 cursor-pointer px-3 py-3 hover:bg-secondary/5 hover:transition hover:ease-in-out hover:duration-400"
              >
                <p>{opt.displayName?.text || ""}</p>
                <p className="text-sm text-secondary/50">
                  {opt.formattedAddress || ""}
                </p>
              </ComboboxOption>
            );
          })}
        </ComboboxOptions>
      )}
    </Combobox>
  );
};

export default LocationSearch;
