import { useEffect, useState } from "react";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db, auth } from "../../../../firebase-config";
import { ItineraryDetails } from "../../components/sections/Itinerary";

export const useGetItinerary = (tripId: string) => {
  const [itinerary, setItinerary] = useState<ItineraryDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      setError("User not authenticated.");
      setLoading(false);
      return;
    }

    const ref = collection(db, `users/${user.uid}/trips/${tripId}/itinerary`);
    const q = query(ref);

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const itineraryList: ItineraryDetails[] = snapshot.docs.map((doc) => ({
          ...(doc.data() as ItineraryDetails),
        }));
        setItinerary(itineraryList);
        setLoading(false);
      },
      (err) => {
        setError("Failed to load itinerary data: " + err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [tripId]);

  return { itinerary, loading, error };
};
