import { collection, deleteDoc, doc, writeBatch } from "firebase/firestore";
import { useCallback } from "react";
import { auth, db } from "../../../../firebase-config";
import { TransportationDetails } from "../../types";
import { getTransportLocalStorageKey } from "../../components/sections/helpers";

export const useSaveTransport = () => {
  const saveTransport = useCallback(
    async (tripId: string, transportRows: TransportationDetails[]) => {
      const user = auth.currentUser;
      if (!user) throw new Error("User not authenticated.");

      try {
        const batch = writeBatch(db);
        const transportRef = collection(
          db,
          `users/${user.uid}/trips/${tripId}/transport`
        );

        transportRows.forEach((row) => {
          const rowRef = doc(transportRef, row.id);
          batch.set(
            rowRef,
            { ...row, createdAt: row.createdAt },
            { merge: true }
          );
        });

        await batch.commit();

        localStorage.removeItem(getTransportLocalStorageKey(tripId));
      } catch (error) {
        throw new Error(`Error saving transport data: ${error}`);
      }
    },
    []
  );

  const deleteTransportRow = useCallback(
    async (tripId: string, rowId: string) => {
      const user = auth.currentUser;
      if (!user) throw new Error("User not authenticated.");

      try {
        const rowRef = doc(
          db,
          `users/${user.uid}/trips/${tripId}/transport/${rowId}`
        );
        await deleteDoc(rowRef);
      } catch (error) {
        throw new Error(`Error deleting transport row: ${error}`);
      }
    },
    []
  );

  return { saveTransport, deleteTransportRow };
};
