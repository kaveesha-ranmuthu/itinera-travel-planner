import { useEffect, useState } from "react";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db, auth } from "../config/firebase-config";
import { onAuthStateChanged } from "firebase/auth";
import { LocationDetails } from "../types/types";

export const useGetActivities = (tripId: string) => {
  const [activities, setActivities] = useState<LocationDetails[]>([]);
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

      const ref = collection(
        db,
        `users/${user.uid}/trips/${tripId}/activities`
      );
      const q = query(ref);

      unsubscribeFirestore = onSnapshot(
        q,
        (snapshot) => {
          const rows: LocationDetails[] = snapshot.docs.map((doc) => ({
            ...(doc.data() as LocationDetails),
          }));
          setActivities(rows);
          setLoading(false);
        },
        (err) => {
          setError("Failed to load activities data: " + err.message);
          setLoading(false);
        }
      );
    });

    return () => {
      if (unsubscribeFirestore) unsubscribeFirestore();
      unsubscribeAuth(); // Cleanup auth listener
    };
  }, [tripId]);

  return { activities, loading, error };
};
