import axios from "axios";
import { IoIosArrowRoundDown, IoIosArrowRoundUp } from "react-icons/io";
import { TransportRow } from "./Transport";
import { AccommodationRow } from "./Accommodation";
import { round } from "lodash";
import { LocationCardDetails } from "../LocationWithPhotoCard";

export const getAccommodationLocalStorageKey = (tripId: string) =>
  `unsaved-accommodation-${tripId}`;

export const getFoodLocalStorageKey = (tripId: string) =>
  `unsaved-food-${tripId}`;

export const getActivitiesLocalStorageKey = (tripId: string) =>
  `unsaved-activities-${tripId}`;

export const getTransportLocalStorageKey = (tripId: string) =>
  `unsaved-transport-${tripId}`;

export const getItineraryLocalStorageKey = (tripId: string) =>
  `unsaved-itinerary-${tripId}`;

export const getTasklistLocalStorageKey = (tripId: string) =>
  `unsaved-tasklist-${tripId}`;

export const getUnsavedTripsStorageKey = () => `unsaved-trips`;

export const addTripToLocalStorage = (tripId: string) => {
  const unsavedTripsStorageKey = getUnsavedTripsStorageKey();
  const unsavedTrips = localStorage.getItem(unsavedTripsStorageKey);
  if (unsavedTrips) {
    const unsavedTripsArray = JSON.parse(unsavedTrips);
    if (!unsavedTripsArray.includes(tripId)) {
      localStorage.setItem(
        unsavedTripsStorageKey,
        JSON.stringify([...unsavedTripsArray, tripId])
      );
    }
  } else {
    localStorage.setItem(unsavedTripsStorageKey, JSON.stringify([tripId]));
  }
};

export const deleteTripFromLocalStorage = (tripId: string) => {
  const unsavedTripsStorageKey = getUnsavedTripsStorageKey();
  const unsavedTrips = localStorage.getItem(unsavedTripsStorageKey);
  if (unsavedTrips) {
    const unsavedTripsArray = JSON.parse(unsavedTrips);
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

export const getEstimatedTransportAndAccommodationCost = (
  rows: TransportRow[] | AccommodationRow[]
) => {
  return rows.reduce((acc, row) => {
    if (row.checked) {
      return acc + row.totalPrice;
    } else {
      return acc;
    }
  }, 0);
};

export const getEstimatedFoodAndActivitiesCost = (
  rows: LocationCardDetails[]
) => {
  return rows.reduce((acc, row) => {
    if (row.averagePrice) {
      return acc + row.averagePrice;
    } else {
      return acc;
    }
  }, 0);
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
