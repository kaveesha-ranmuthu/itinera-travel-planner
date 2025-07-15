import axios from "axios";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { round, uniqBy } from "lodash";
import { IoIosArrowRoundDown, IoIosArrowRoundUp } from "react-icons/io";
import {
  getAccommodationLocalStorageKey,
  getActivitiesLocalStorageKey,
  getCustomSectionLocalStorageKey,
  getFoodLocalStorageKey,
  getItineraryLocalStorageKey,
  getPackingListLocalStorageKey,
  getTasklistLocalStorageKey,
  getTransportLocalStorageKey,
  getUnsavedSectionsStorageKey,
  getUnsavedTripsStorageKey,
} from "../../../utils/helpers";
import { LocationDetails } from "../../../pages/trips/types";
import { LocationSearchResult } from "../../../pages/trips/components/LocationSearch";

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

export const deleteTripFromLocalStorage = (tripId: string) => {
  const unsavedTripsStorageKey = getUnsavedTripsStorageKey();
  const unsavedTrips = localStorage.getItem(unsavedTripsStorageKey);
  if (unsavedTrips) {
    const unsavedTripsArray = JSON.parse(unsavedTrips);
    const unsavedCustomSections = localStorage.getItem(
      getUnsavedSectionsStorageKey(tripId)
    );
    if (unsavedCustomSections) {
      const unsavedCustomSectionsArray = JSON.parse(unsavedCustomSections);
      unsavedCustomSectionsArray.forEach((sectionName: string) => {
        localStorage.removeItem(
          getCustomSectionLocalStorageKey(tripId, sectionName)
        );
      });
      localStorage.removeItem(getUnsavedSectionsStorageKey(tripId));
    }
    if (unsavedTripsArray.includes(tripId)) {
      localStorage.setItem(
        unsavedTripsStorageKey,
        JSON.stringify(unsavedTripsArray.filter((id: string) => id !== tripId))
      );
      localStorage.removeItem(getAccommodationLocalStorageKey(tripId));
      localStorage.removeItem(getFoodLocalStorageKey(tripId));
      localStorage.removeItem(getActivitiesLocalStorageKey(tripId));
      localStorage.removeItem(getTransportLocalStorageKey(tripId));
      localStorage.removeItem(getItineraryLocalStorageKey(tripId));
      localStorage.removeItem(getTasklistLocalStorageKey(tripId));
      localStorage.removeItem(getPackingListLocalStorageKey(tripId));
    }
  }
};

export const getSortArrowComponent = (currentSortDirection: "asc" | "desc") => {
  return currentSortDirection === "desc" ? (
    <IoIosArrowRoundUp size={20} />
  ) : (
    <IoIosArrowRoundDown size={20} />
  );
};

export const convertCurrency = async (
  base: string,
  target: string,
  amount: number
): Promise<number> => {
  const sessionStorageKey = `${base}-${target}`;
  const cachedRate = sessionStorage.getItem(sessionStorageKey);
  if (cachedRate) {
    return parseFloat(cachedRate) * amount;
  }
  try {
    const response = await axios.get(
      `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${base.toLowerCase()}.json`
    );

    const rate = response.data[base.toLowerCase()][target.toLowerCase()];

    if (!rate) {
      throw new Error("Failed to fetch currency conversion rate.");
    }
    sessionStorage.setItem(sessionStorageKey, rate);
    return rate * amount;
  } catch (error) {
    throw new Error(`Failed to fetch currency conversion rate: ${error}`);
  }
};

export const getEstimatedCost = (rows: Pick<LocationDetails, "price">[]) => {
  return rows.reduce((acc, row) => {
    // If row is Transportation or Accommodation
    if ("checked" in row) {
      if (row.checked) {
        return acc + row.price;
      } else {
        return acc;
      }
    }
    // If row is Food or Activities
    else {
      return acc + row.price;
    }
  }, 0);
};

export const getUniqueLocations = (locations: LocationDetails[]) => {
  return uniqBy(
    locations.map((location) => location.location),
    "name"
  )
    .map((location) => location.name)
    .filter(Boolean);
};

export const getPricesList = (locations: LocationDetails[]) => {
  return locations
    .map((location) => {
      if ("pricePerNightPerPerson" in location) {
        return location.pricePerNightPerPerson;
      }
      return location.price;
    })
    .filter(Boolean) as number[];
};

export const isLocationIncluded = (
  selectedLocations: string[],
  locationToCheck: string
) => {
  if (!selectedLocations.length) return true;
  return selectedLocations.includes(locationToCheck);
};

export const isPriceIncluded = (
  selectedPrices?: number[],
  averagePrice?: number
) => {
  if (!selectedPrices || averagePrice === undefined) return true;

  return averagePrice >= selectedPrices[0] && averagePrice <= selectedPrices[1];
};

export const getAveragePrice = (startPrice?: number, endPrice?: number) => {
  let averagePrice = 0;
  if (startPrice && endPrice) {
    averagePrice = (startPrice + endPrice) / 2;
  } else if (startPrice) {
    averagePrice = startPrice;
  } else if (endPrice) {
    averagePrice = endPrice;
  }

  return !averagePrice ? undefined : round(averagePrice);
};

export const saveTripData = async (
  saveAllData: (tripId: string) => Promise<boolean>
) => {
  const unsavedTrips = localStorage.getItem(getUnsavedTripsStorageKey());
  if (unsavedTrips) {
    const unsavedTripsArray = JSON.parse(unsavedTrips);
    const stillUnsaved: string[] = [];

    for (const tripId of unsavedTripsArray) {
      const success = await saveAllData(tripId);
      if (!success) {
        stillUnsaved.push(tripId);
      }
    }

    if (stillUnsaved.length > 0) {
      localStorage.setItem(
        getUnsavedTripsStorageKey(),
        JSON.stringify(stillUnsaved)
      );
    } else {
      localStorage.removeItem(getUnsavedTripsStorageKey());
    }
  }
};

export const getLocationDetails = (
  location: LocationSearchResult,
  photoDownloadUrl: string | null
): LocationDetails => {
  const startPrice = location?.priceRange?.startPrice?.units
    ? parseFloat(location?.priceRange?.startPrice?.units)
    : undefined;
  const endPrice = location?.priceRange?.endPrice?.units
    ? parseFloat(location?.priceRange?.endPrice?.units)
    : undefined;

  return {
    id: crypto.randomUUID(),
    googleId: location?.id,
    name: location?.displayName?.text || "",
    formattedAddress: location?.formattedAddress || "",
    location: {
      latitude: location?.location?.latitude,
      longitude: location?.location?.longitude,
      name:
        location?.addressComponents?.find((address) =>
          address.types?.includes("locality")
        )?.shortText || "",
    },
    startPrice,
    endPrice,
    price: getAveragePrice(startPrice, endPrice) ?? 0,
    photoUrl: photoDownloadUrl,
    websiteUri: location?.websiteUri,
    createdAt: new Date().toISOString(),
  };
};

export const getPhotoDownloadUrl = async (location: LocationSearchResult) => {
  const storage = getStorage();
  const storageRef = ref(storage, `place-photos/${location?.id}.jpg`);

  try {
    const storagePhotoUrl = await getDownloadURL(storageRef);
    return storagePhotoUrl;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.code === "storage/object-not-found") {
      const photoName = location?.photos?.[0]?.name;

      if (!photoName) {
        throw new Error("No photo name found for this place");
      }

      const googlePhotoUrl = `https://places.googleapis.com/v1/${photoName}/media?maxWidthPx=400&key=${API_KEY}`;
      const response = await fetch(googlePhotoUrl);
      const blob = await response.blob();

      await uploadBytes(storageRef, blob);
      const uploadedPhotoUrl = await getDownloadURL(storageRef);
      return uploadedPhotoUrl;
    } else {
      throw error;
    }
  }
};
