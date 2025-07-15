import { useEffect, useState } from "react";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db, auth } from "../../../config/firebase-config";
import { onAuthStateChanged } from "firebase/auth";
import { TransportationDetails } from "../../../types/types";

export const useGetTransport = (tripId: string) => {
  const [transportRows, setTransportRows] = useState<TransportationDetails[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let unsubscribeFirestore: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setError("User not authenticated.");
        setLoading(false);
        return;
      }

      const transportRef = collection(
        db,
        `users/${user.uid}/trips/${tripId}/transport`
      );
      const q = query(transportRef);

      unsubscribeFirestore = onSnapshot(
        q,
        (snapshot) => {
          const rows: TransportationDetails[] = snapshot.docs.map((doc) => ({
            ...(doc.data() as TransportationDetails),
          }));
          setTransportRows(rows);
          setLoading(false);
        },
        (err) => {
          setError("Failed to load transport data: " + err.message);
          setLoading(false);
        }
      );
    });

    return () => {
      if (unsubscribeFirestore) unsubscribeFirestore();
      unsubscribeAuth(); // Cleanup auth listener
    };
  }, [tripId]);

  return { transportRows, loading, error };
};
