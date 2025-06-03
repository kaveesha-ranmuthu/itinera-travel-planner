import {
  getAccommodationLocalStorageKey,
  getActivitiesLocalStorageKey,
  getFoodLocalStorageKey,
  getItineraryLocalStorageKey,
  getPackingListLocalStorageKey,
  getTasklistLocalStorageKey,
  getTransportLocalStorageKey,
} from "../../components/sections/helpers";
import { useSaveAccommodation } from "./useSaveAccommodation";
import { useSaveActivities } from "./useSaveActivities";
import { useSaveFood } from "./useSaveFood";
import { useSaveItinerary } from "./useSaveItinerary";
import useSavePackingList from "./useSavePackingList";
import useSaveTasklist from "./useSaveTasklist";
import { useSaveTransport } from "./useSaveTransport";

const useSaveAllData = () => {
  const { saveAccommodation } = useSaveAccommodation();
  const { saveFood } = useSaveFood();
  const { saveTransport } = useSaveTransport();
  const { saveActivities } = useSaveActivities();
  const { saveItinerary } = useSaveItinerary();
  const { saveTasklist } = useSaveTasklist();
  const { savePackingList } = useSavePackingList();

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
      {
        key: getTasklistLocalStorageKey(tripId),
        saver: saveTasklist,
      },
      {
        key: getPackingListLocalStorageKey(tripId),
        saver: savePackingList,
      },
    ];

    for (const { key, saver } of keysAndSavers) {
      const cached = localStorage.getItem(key);
      if (cached) {
        try {
          let data;
          if (
            key === getTasklistLocalStorageKey(tripId) ||
            key === getPackingListLocalStorageKey(tripId)
          ) {
            data = cached;
          } else if (key === getItineraryLocalStorageKey(tripId)) {
            const parsed = JSON.parse(cached);
            data = parsed.itinerary;
          } else {
            const parsed = JSON.parse(cached);
            data = parsed.data;
          }
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
