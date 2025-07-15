import { collection, deleteDoc, doc, writeBatch } from "firebase/firestore";
import { useCallback } from "react";
import { auth, db } from "../../../../config/firebase-config";
import { getAccommodationLocalStorageKey } from "../../../../features/trip/utils/helpers";
import { AccommodationDetails } from "../../types";

export const useSaveAccommodation = () => {
  const saveAccommodation = useCallback(
    async (tripId: string, rows: AccommodationDetails[]) => {
      const user = auth.currentUser;
      if (!user) throw new Error("User not authenticated.");

      try {
        const batch = writeBatch(db);
        const accRef = collection(
          db,
          `users/${user.uid}/trips/${tripId}/accommodation`
        );

        rows.forEach((row) => {
          const rowRef = doc(accRef, row.id);
          batch.set(
            rowRef,
            { ...row, createdAt: row.createdAt },
            { merge: true }
          );
        });

        await batch.commit();

        localStorage.removeItem(getAccommodationLocalStorageKey(tripId));
      } catch (error) {
        throw new Error(`Error saving accommodation data: ${error}`);
      }
    },
    []
  );

  const deleteAccommodationRow = useCallback(
    async (tripId: string, rowId: string) => {
      const user = auth.currentUser;
      if (!user) throw new Error("User not authenticated.");

      try {
        const rowRef = doc(
          db,
          `users/${user.uid}/trips/${tripId}/accommodation/${rowId}`
        );
        await deleteDoc(rowRef);
      } catch (error) {
        throw new Error(`Error deleting accommodation row: ${error}`);
      }
    },
    []
  );

  return {
    saveAccommodation,
    deleteAccommodationRow,
  };
};
