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

export const compressAndConvertToBase64 = (
  file: File,
  maxWidth = 800,
  maxHeight = 800,
  quality = 0.7
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onload = (event) => {
      if (!event.target?.result) return reject("Failed to load image");
      img.src = event.target.result as string;
    };

    img.onload = () => {
      const canvas = document.createElement("canvas");
      let { width, height } = img;

      // ✅ Resize while maintaining aspect ratio
      if (width > maxWidth || height > maxHeight) {
        const aspectRatio = width / height;
        if (width > height) {
          width = maxWidth;
          height = maxWidth / aspectRatio;
        } else {
          height = maxHeight;
          width = maxHeight * aspectRatio;
        }
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject("Canvas context failed");

      ctx.drawImage(img, 0, 0, width, height);

      // ✅ Convert to Base64 (JPEG with 70% quality)
      resolve(canvas.toDataURL("image/jpeg", quality));
    };

    img.onerror = (error) => reject(error);
  });
};
