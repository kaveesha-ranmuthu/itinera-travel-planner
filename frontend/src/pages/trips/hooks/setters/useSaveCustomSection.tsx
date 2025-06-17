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

        locations.forEach((row) => {
          const rowRef = doc(ref, row.id);
          batch.set(
            rowRef,
            { ...row, createdAt: row.createdAt },
            { merge: true }
          );
        });

        await batch.commit();

        localStorage.removeItem(getFoodLocalStorageKey(tripId));
      } catch (error) {
        throw new Error(`Error saving food data: ${error}`);
      }
    },
    []
  );

  return {
    saveFood: saveCustomSection,
  };
};
