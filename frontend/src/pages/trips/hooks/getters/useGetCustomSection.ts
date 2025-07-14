import { useEffect, useState } from "react";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db, auth } from "../../../../config/firebase-config";
import { onAuthStateChanged } from "firebase/auth";
import { LocationDetails } from "../../types";

export const useGetCustomSection = (tripId: string, sectionName: string) => {
  const [items, setItems] = useState<LocationDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let unsubscribe: (() => void) | null = null;

    const authUnsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setError("User not authenticated.");
        setLoading(false);
        return;
      }

      const ref = collection(
        db,
        `users/${user.uid}/trips/${tripId}/${sectionName}`
      );
      const q = query(ref);

      unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const rows: LocationDetails[] = snapshot.docs.map((doc) => ({
            ...(doc.data() as LocationDetails),
          }));
          setItems(rows);
          setLoading(false);
        },
        (err) => {
          setError("Failed to load data: " + err.message);
          setLoading(false);
        }
      );
    });

    return () => {
      if (unsubscribe) unsubscribe();
      authUnsubscribe();
    };
  }, [sectionName, tripId]);

  return { items, loading, error };
};
