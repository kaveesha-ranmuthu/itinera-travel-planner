import { useEffect, useState } from "react";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db, auth } from "../../../../firebase-config"; // Update path as needed
import { AccommodationRow } from "../../components/sections/Accommodation";

export const useGetAccommodation = (tripId: string) => {
  const [accommodationRows, setAccommodationRows] = useState<
    AccommodationRow[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const user = auth.currentUser;
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

    const unsubscribe = onSnapshot(
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

    return () => unsubscribe();
  }, [tripId]);

  return { accommodationRows, loading, error };
};
