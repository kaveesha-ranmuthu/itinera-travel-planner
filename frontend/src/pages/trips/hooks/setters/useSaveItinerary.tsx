import { collection, doc, writeBatch } from "firebase/firestore";
import { useCallback } from "react";
import { auth, db } from "../../../../firebase-config";
import { ItineraryDetails } from "../../components/sections/Itinerary";
import { getItineraryLocalStorageKey } from "../../components/sections/helpers";

export const useSaveItinerary = () => {
  const saveItinerary = useCallback(
    async (tripId: string, itinerary: ItineraryDetails[]) => {
      const user = auth.currentUser;
      if (!user) throw new Error("User not authenticated.");

      try {
        const batch = writeBatch(db);
        const ref = collection(
          db,
          `users/${user.uid}/trips/${tripId}/itinerary`
        );

        itinerary.forEach((i) => {
          const rowRef = doc(ref, i.id);
          batch.set(rowRef, { ...i }, { merge: true });
        });

        await batch.commit();

        localStorage.removeItem(getItineraryLocalStorageKey(tripId));
      } catch (error) {
        throw new Error(`Error saving itinerary data: ${error}`);
      }
    },
    []
  );

  return {
    saveItinerary,
  };
};
