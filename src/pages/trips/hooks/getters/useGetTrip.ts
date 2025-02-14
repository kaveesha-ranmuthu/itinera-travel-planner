import { useState, useEffect } from "react";
import { TripData } from "./useGetTrips";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../../../firebase-config";
import { onAuthStateChanged } from "firebase/auth";

const useGetTrip = (tripId: string) => {
  const [trip, setTrip] = useState<TripData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setLoading(false);
        setError("User not authenticated.");
        return;
      }

      try {
        const tripRef = doc(db, `users/${user.uid}/trips/${tripId}`);
        const tripSnap = await getDoc(tripRef);

        if (!tripSnap.exists()) {
          setError("Trip not found");
          setLoading(false);
          return;
        }

        setTrip({ ...tripSnap.data(), id: tripSnap.id } as TripData);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [tripId]);

  return { trip, loading, error };
};

export default useGetTrip;
