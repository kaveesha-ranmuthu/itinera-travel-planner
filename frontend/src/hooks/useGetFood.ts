import { useEffect, useState } from "react";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db, auth } from "../config/firebase-config";
import { onAuthStateChanged } from "firebase/auth";
import { LocationDetails } from "../types/types";

export const useGetFood = (tripId: string) => {
  const [foodItems, setFoodItems] = useState<LocationDetails[]>([]);
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

      const ref = collection(db, `users/${user.uid}/trips/${tripId}/food`);
      const q = query(ref);

      unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const rows: LocationDetails[] = snapshot.docs.map((doc) => ({
            ...(doc.data() as LocationDetails),
          }));
          setFoodItems(rows);
          setLoading(false);
        },
        (err) => {
          setError("Failed to load food data: " + err.message);
          setLoading(false);
        }
      );
    });

    return () => {
      if (unsubscribe) unsubscribe();
      authUnsubscribe(); // Cleanup auth listener
    };
  }, [tripId]);

  return { foodItems, loading, error };
};
