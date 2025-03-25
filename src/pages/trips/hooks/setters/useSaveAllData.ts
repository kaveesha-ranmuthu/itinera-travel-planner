import {
  getAccommodationLocalStorageKey,
  getActivitiesLocalStorageKey,
  getFoodLocalStorageKey,
  getItineraryLocalStorageKey,
  getTransportLocalStorageKey,
} from "../../components/sections/helpers";
import { useSaveAccommodation } from "./useSaveAccommodation";
import { useSaveActivities } from "./useSaveActivities";
import { useSaveFood } from "./useSaveFood";
import { useSaveItinerary } from "./useSaveItinerary";
import { useSaveTransport } from "./useSaveTransport";

const useSaveAllData = () => {
  const { saveAccommodation } = useSaveAccommodation();
  const { saveFood } = useSaveFood();
  const { saveTransport } = useSaveTransport();
  const { saveActivities } = useSaveActivities();
  const { saveItinerary } = useSaveItinerary();

  const saveAllData = async (tripId: string) => {
    let success = true;

    const keysAndSavers = [
      {
        key: getAccommodationLocalStorageKey(tripId),
        saver: saveAccommodation,
      },
      {
        key: getFoodLocalStorageKey(tripId),
        saver: saveFood,
      },
      {
        key: getActivitiesLocalStorageKey(tripId),
        saver: saveActivities,
      },
      {
        key: getTransportLocalStorageKey(tripId),
        saver: saveTransport,
      },
      {
        key: getItineraryLocalStorageKey(tripId),
        saver: saveItinerary,
      },
    ];

    for (const { key, saver } of keysAndSavers) {
      const cached = localStorage.getItem(key);
      if (cached) {
        const parsed = JSON.parse(cached);
        try {
          const data =
            key === getItineraryLocalStorageKey(tripId)
              ? parsed.itinerary
              : parsed.data;
          await saver(tripId, data);
        } catch (error) {
          console.error(`Failed to save section for trip ${tripId}:`, error);
          success = false;
        }
      }
    }

    return success;
  };

  return { saveAllData };
};

export default useSaveAllData;
