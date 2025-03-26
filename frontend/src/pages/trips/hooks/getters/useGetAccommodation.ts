import { useEffect, useState } from "react";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db, auth } from "../../../../firebase-config"; // Update path as needed
import { AccommodationRow } from "../../components/sections/Accommodation";
import { onAuthStateChanged } from "firebase/auth";

export const useGetAccommodation = (tripId: string) => {
  const [accommodationRows, setAccommodationRows] = useState<
    AccommodationRow[]
  >([]);
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

      const accRef = collection(
        db,
        `users/${user.uid}/trips/${tripId}/accommodation`
      );
      const q = query(accRef);

      unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const rows: AccommodationRow[] = snapshot.docs.map((doc) => ({
            ...(doc.data() as AccommodationRow),
          }));
          setAccommodationRows(rows);
          setLoading(false);
        },
        (err) => {
          setError("Failed to load accommodation data: " + err.message);
          setLoading(false);
        }
      );
    });

    return () => {
      if (unsubscribe) unsubscribe();
      authUnsubscribe(); // Cleanup auth listener
    };
  }, [tripId]);

  return { accommodationRows, loading, error };
};
