import { collection, deleteDoc, doc, writeBatch } from "firebase/firestore";
import { useCallback } from "react";
import { auth, db } from "../../../../firebase-config";
import { LocationCardDetails } from "../../components/LocationWithPhotoCard";
import { getFoodLocalStorageKey } from "../../components/sections/helpers";

export const useSaveFood = () => {
  const saveFood = useCallback(
    async (tripId: string, rows: LocationCardDetails[]) => {
      const user = auth.currentUser;
      if (!user) throw new Error("User not authenticated.");

      try {
        const batch = writeBatch(db);
        const ref = collection(db, `users/${user.uid}/trips/${tripId}/food`);

        rows.forEach((row) => {
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

  const deleteFoodItem = useCallback(async (tripId: string, rowId: string) => {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated.");

    try {
      const rowRef = doc(db, `users/${user.uid}/trips/${tripId}/food/${rowId}`);
      await deleteDoc(rowRef);
    } catch (error) {
      throw new Error(`Error deleting food row: ${error}`);
    }
  }, []);

  return {
    saveFood,
    deleteFoodItem,
  };
};
