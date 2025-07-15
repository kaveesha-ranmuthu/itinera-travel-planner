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
import { convertCurrency } from "../../../features/trip/utils/helpers";

interface LocationSearchProps {
  disabled?: boolean;
  inputBoxClassname?: string;
  optionsBoxClassname?: string;
  placeholder?: string;
  onSelectLocation: (location: LocationSearchResult) => void;
  userCurrency?: string;
  latitude?: number;
  longitude?: number;
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
  priceRange?: {
    startPrice?: {
      currencyCode?: string;
      units?: string;
    };
    endPrice?: {
      currencyCode?: string;
      units?: string;
    };
  };
  photos?: {
    name?: string;
  }[];
  websiteUri?: string;
}

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const convertPrice = async (
  price: { currencyCode?: string; units?: string },
  userCurrency: string
) => {
  if (
    !price ||
    !price.units ||
    !price.currencyCode ||
    price.currencyCode === userCurrency
  )
    return;

  const convertedPrice = await convertCurrency(
    price.currencyCode,
    userCurrency,
    parseFloat(price.units)
  );
  price.currencyCode = userCurrency;
  price.units = convertedPrice.toString();
};

const convertPrices = async (
  places: LocationSearchResult[],
  userCurrency?: string
) => {
  if (!userCurrency) return;

  await Promise.all(
    places.map(async (place) => {
      if (place.priceRange) {
        if (place.priceRange.startPrice)
          await convertPrice(place.priceRange.startPrice, userCurrency);
        if (place.priceRange.endPrice)
          await convertPrice(place.priceRange.endPrice, userCurrency);
      }
    })
  );
};

const LocationSearch: React.FC<LocationSearchProps> = ({
  disabled,
  inputBoxClassname,
  optionsBoxClassname,
  placeholder,
  onSelectLocation,
  userCurrency,
  latitude,
  longitude,
}) => {
  const [options, setOptions] = useState<LocationSearchResult[]>([]);
  const [query, setQuery] = useState("");
  const { settings } = useAuth();

  const searchPlaces = useCallback(
    async (query: string) => {
      try {
        const response = await axios.post(
          "https://places.googleapis.com/v1/places:searchText",
          {
            textQuery: query,
            locationBias: {
              circle: {
                center: {
                  latitude: latitude,
                  longitude: longitude,
                },
                radius: 500.0,
              },
            },
          },
          {
            headers: {
              "Content-Type": "application/json",
              "X-Goog-Api-Key": API_KEY,
              "X-Goog-FieldMask":
                "places.displayName,places.formattedAddress,places.googleMapsLinks,places.id,places.location,places.addressComponents,places.priceRange,places.photos.name,places.websiteUri",
            },
          }
        );
        if (!response.data.places) return;
        const responseData = [...response.data.places];
        convertPrices(responseData, userCurrency);
        setOptions(responseData);
      } catch (error) {
        console.error("Error fetching places:", error);
      }
    },
    [userCurrency]
  );

  useEffect(() => {
    if (!query) return;
    searchPlaces(query);
  }, [query, searchPlaces]);

  return (
    <Combobox
      onChange={(item: LocationSearchResult) => onSelectLocation(item)}
      onClose={() => {
        setQuery("");
        setOptions([]);
      }}
      immediate
      disabled={disabled}
    >
      <ComboboxInput
        placeholder={placeholder ?? "Search for a location..."}
        onChange={debounce((event) => {
          setQuery(event.target.value);
        }, 1000)}
        className={twMerge(
          "focus:outline-secondary border border-secondary rounded-2xl py-1 w-70 h-10 px-3",
          inputBoxClassname
        )}
      />
      {options && !!options.length && (
        <ComboboxOptions
          anchor="bottom start"
          transition
          className={twMerge(
            "bg-primary border border-secondary w-3xs rounded-lg mt-1 transition duration-200 ease-out empty:invisible data-[closed]:scale-95 data-[closed]:opacity-0",
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
