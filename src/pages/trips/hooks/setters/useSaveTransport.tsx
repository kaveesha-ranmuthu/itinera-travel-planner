import { useCallback } from "react";
import { doc, writeBatch, collection } from "firebase/firestore";
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
          const rowRef = doc(transportRef, row.id || crypto.randomUUID());
          batch.set(rowRef, { ...row, updatedAt: new Date() }, { merge: true });
        });

        await batch.commit();

        localStorage.removeItem(`unsaved-transport-${tripId}`);
      } catch (error) {
        throw new Error(`Error saving transport data: ${error}`);
      }
    },
    []
  );

  return { saveTransport };
};
