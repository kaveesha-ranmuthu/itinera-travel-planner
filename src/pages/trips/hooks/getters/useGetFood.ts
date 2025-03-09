import { useEffect, useState } from "react";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db, auth } from "../../../../firebase-config"; // Update path as needed
import { LocationCardDetails } from "../../components/LocationWithPhotoCard";

export const useGetFood = (tripId: string) => {
  const [foodItems, setFoodItems] = useState<LocationCardDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      setError("User not authenticated.");
      setLoading(false);
      return;
    }

    const ref = collection(db, `users/${user.uid}/trips/${tripId}/food`);
    const q = query(ref);

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const rows: LocationCardDetails[] = snapshot.docs.map((doc) => ({
          ...(doc.data() as LocationCardDetails),
        }));
        setFoodItems(rows);
        setLoading(false);
      },
      (err) => {
        setError("Failed to load food data: " + err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [tripId]);

  return { foodItems, loading, error };
};
