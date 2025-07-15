import { FirebaseError } from "firebase/app";

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

export const getPackingListLocalStorageKey = (tripId: string) =>
  `unsaved-packing-list-${tripId}`;

export const getCustomSectionLocalStorageKey = (
  tripId: string,
  sectionName: string
) => {
  const sectionNameHyphenated = sectionName.toLowerCase().replace(/\s+/g, "-");
  return `unsaved-${sectionNameHyphenated}-${tripId}`;
};

export const getUnsavedTripsStorageKey = () => `unsaved-trips`;
export const getUnsavedSectionsStorageKey = (tripId: string) =>
  `unsaved-sections-${tripId}`;

export const addTripToLocalStorage = (tripId: string, sectionName?: string) => {
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

  if (sectionName) {
    const unsavedSectionKey = getUnsavedSectionsStorageKey(tripId);
    const unsavedSections = localStorage.getItem(unsavedSectionKey);
    if (unsavedSections) {
      const unsavedSectionsArray = JSON.parse(unsavedSections);
      if (!unsavedSectionsArray.includes(sectionName)) {
        localStorage.setItem(
          unsavedSectionKey,
          JSON.stringify([...unsavedSectionsArray, sectionName])
        );
      }
    } else {
      localStorage.setItem(unsavedSectionKey, JSON.stringify([sectionName]));
    }
  }
};

export const getFirebaseErrorMessage = (error: FirebaseError) => {
  const errorMessages: Record<string, string> = {
    "auth/email-already-in-use":
      "This email is already in use. Try logging in or reset your password if needed.",
    "auth/invalid-email":
      "Please enter a valid email address (e.g., name@example.com).",
    "auth/weak-password":
      "Your password is too weak. Use at least 6 characters for better security.",
    "auth/wrong-password": "Incorrect password. Double-check it and try again.",
    "auth/network-request-failed":
      "Network issue detected. Check your connection and try again.",
    "auth/invalid-credential":
      "Incorrect email or password. Try again or reset your password.",
    "auth/popup-closed-by-user":
      "Sign-in process was interrupted. Please try again.",
  };

  return errorMessages[error.code] || "Something went wrong. Please try again.";
};
