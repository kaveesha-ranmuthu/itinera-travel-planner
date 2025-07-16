import { collection, deleteDoc, doc, writeBatch } from "firebase/firestore";
import { useCallback } from "react";
import { auth, db } from "../config/firebase-config";
import { getActivitiesLocalStorageKey } from "../utils/helpers";
import { LocationDetails } from "../types/types";

export const useSaveActivities = () => {
  const saveActivities = useCallback(
    async (tripId: string, rows: LocationDetails[]) => {
      const user = auth.currentUser;
      if (!user) throw new Error("User not authenticated.");

      try {
        const batch = writeBatch(db);
        const ref = collection(
          db,
          `users/${user.uid}/trips/${tripId}/activities`
        );

        rows.forEach((row) => {
          const rowRef = doc(ref, row.id);
          batch.set(
            rowRef,
            { ...row, createdAt: row.createdAt },
            { merge: true }
          );
        });

        await batch.commit();

        localStorage.removeItem(getActivitiesLocalStorageKey(tripId));
      } catch (error) {
        throw new Error(`Error saving activities data: ${error}`);
      }
    },
    []
  );

  const deleteActivity = useCallback(async (tripId: string, rowId: string) => {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated.");

    try {
      const rowRef = doc(
        db,
        `users/${user.uid}/trips/${tripId}/activities/${rowId}`
      );
      await deleteDoc(rowRef);
    } catch (error) {
      throw new Error(`Error deleting activities row: ${error}`);
    }
  }, []);

  return {
    saveActivities,
    deleteActivity,
  };
};
