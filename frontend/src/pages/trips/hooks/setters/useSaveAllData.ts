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
} from "../../../../features/trip/utils/helpers";
import { LocationDetails } from "../../types";
import { useSaveAccommodation } from "./useSaveAccommodation";
import { useSaveActivities } from "./useSaveActivities";
import { useSaveCustomSection } from "./useSaveCustomSection";
import { useSaveFood } from "./useSaveFood";
import { useSaveItinerary } from "./useSaveItinerary";
import useSavePackingList from "./useSavePackingList";
import useSaveTasklist from "./useSaveTasklist";
import { useSaveTransport } from "./useSaveTransport";

interface KeysAndSavers {
  key: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  saver: (tripId: string, data: any) => Promise<void>;
  sectionName?: string;
}

const useSaveAllData = () => {
  const { saveAccommodation } = useSaveAccommodation();
  const { saveFood } = useSaveFood();
  const { saveTransport } = useSaveTransport();
  const { saveActivities } = useSaveActivities();
  const { saveItinerary } = useSaveItinerary();
  const { saveTasklist } = useSaveTasklist();
  const { savePackingList } = useSavePackingList();
  const { saveCustomSection } = useSaveCustomSection();

  const handleSaveCustomSection = (sectionName: string) => {
    return (tripId: string, locations: LocationDetails[]) =>
      saveCustomSection(tripId, sectionName, locations);
  };

  const saveAllData = async (tripId: string) => {
    let success = true;
    const unsavedSectionsKey = getUnsavedSectionsStorageKey(tripId);
    const unsavedSections = localStorage.getItem(unsavedSectionsKey);
    let unsavedSectionsArray: string[] = unsavedSections
      ? JSON.parse(unsavedSections)
      : [];

    const keysAndSavers: KeysAndSavers[] = [
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

    if (unsavedSectionsArray.length) {
      unsavedSectionsArray.forEach((sectionName) => {
        const sectionKey = getCustomSectionLocalStorageKey(tripId, sectionName);
        keysAndSavers.push({
          key: sectionKey,
          saver: handleSaveCustomSection(sectionName),
          sectionName,
        });
      });
    }

    for (const { key, saver, sectionName } of keysAndSavers) {
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
          if (sectionName) {
            unsavedSectionsArray = unsavedSectionsArray.filter(
              (name) => name !== sectionName
            );
          }
        } catch (error) {
          console.error(`Failed to save section for trip ${tripId}:`, error);
          success = false;
        }
      }
    }
    if (unsavedSectionsArray.length === 0) {
      localStorage.removeItem(unsavedSectionsKey);
    } else {
      localStorage.setItem(
        unsavedSectionsKey,
        JSON.stringify(unsavedSectionsArray)
      );
    }

    return success;
  };

  return { saveAllData };
};

export default useSaveAllData;
