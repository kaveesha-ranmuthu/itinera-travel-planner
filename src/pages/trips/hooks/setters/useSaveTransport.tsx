import { useCallback } from "react";
import {
  doc,
  writeBatch,
  collection,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import { db, auth } from "../../../../firebase-config";
import { TransportRow } from "../../components/sections/Transport";

export const useSaveTransport = () => {
  const saveTransport = useCallback(
    async (tripId: string, transportRows: TransportRow[]) => {
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

        localStorage.removeItem(`unsaved-transport-${tripId}`);
      } catch (error) {
        throw new Error(`Error saving transport data: ${error}`);
      }
    },
    []
  );

  const duplicateTransportRow = useCallback(
    async (tripId: string, row: TransportRow) => {
      const user = auth.currentUser;
      if (!user) throw new Error("User not authenticated.");

      try {
        const transportRef = collection(
          db,
          `users/${user.uid}/trips/${tripId}/transport`
        );
        const newRowRef = doc(transportRef, row.id);

        await setDoc(newRowRef, row);
      } catch (error) {
        throw new Error(`Error duplicating transport row: ${error}`);
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

  return { saveTransport, duplicateTransportRow, deleteTransportRow };
};
