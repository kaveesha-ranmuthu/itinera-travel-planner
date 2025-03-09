import { useEffect, useState } from "react";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db, auth } from "../../../../firebase-config"; // Update path as needed
import { LocationCardDetails } from "../../components/LocationWithPhotoCard";

export const useGetActivities = (tripId: string) => {
  const [activities, setActivities] = useState<LocationCardDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      setError("User not authenticated.");
      setLoading(false);
      return;
    }

    const ref = collection(db, `users/${user.uid}/trips/${tripId}/activities`);
    const q = query(ref);

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const rows: LocationCardDetails[] = snapshot.docs.map((doc) => ({
          ...(doc.data() as LocationCardDetails),
        }));
        setActivities(rows);
        setLoading(false);
      },
      (err) => {
        setError("Failed to load activities data: " + err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [tripId]);

  return { activities, loading, error };
};
