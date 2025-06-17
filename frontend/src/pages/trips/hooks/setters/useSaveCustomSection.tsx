import { collection, doc, writeBatch } from "firebase/firestore";
import { useCallback } from "react";
import { auth, db } from "../../../../firebase-config";
import { getFoodLocalStorageKey } from "../../components/sections/helpers";
import { LocationDetails } from "../../types";

export const useSaveCustomSection = () => {
  const saveCustomSection = useCallback(
    async (
      tripId: string,
      sectionTitle: string,
      locations: LocationDetails[]
    ) => {
      const user = auth.currentUser;
      if (!user) throw new Error("User not authenticated.");

      try {
        const batch = writeBatch(db);
        const ref = collection(
          db,
          `users/${user.uid}/trips/${tripId}/${sectionTitle}`
        );

        if (locations.length === 0) {
          const rowRef = doc(ref, "placeholder");
          batch.set(rowRef, {});
        } else {
          locations.forEach((l) => {
            const rowRef = doc(ref, l.id);
            batch.set(
              rowRef,
              { ...l, createdAt: l.createdAt },
              { merge: true }
            );
          });
        }

        await batch.commit();

        localStorage.removeItem(getFoodLocalStorageKey(tripId));
      } catch (error) {
        throw new Error(`Error saving food data: ${error}`);
      }
    },
    []
  );

  return {
    saveCustomSection,
  };
};
