import { collection, doc, getDocs, writeBatch } from "firebase/firestore";
import { useCallback } from "react";
import { auth, db } from "../config/firebase-config";
import { getCustomSectionLocalStorageKey } from "../utils/helpers";
import { LocationDetails } from "../types/types";

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

        localStorage.removeItem(
          getCustomSectionLocalStorageKey(tripId, sectionTitle)
        );
      } catch (error) {
        throw new Error(`Error saving ${sectionTitle} data: ${error}`);
      }
    },
    []
  );

  const deleteCustomSection = async (tripId: string, sectionTitle: string) => {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    const sectionRef = collection(
      db,
      `users/${user.uid}/trips/${tripId}/${sectionTitle}`
    );
    const snapshot = await getDocs(sectionRef);

    const batch = writeBatch(db);
    snapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });

    await batch.commit();
  };

  return {
    saveCustomSection,
    deleteCustomSection,
  };
};
