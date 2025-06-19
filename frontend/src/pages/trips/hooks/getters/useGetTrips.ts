import { useEffect, useState } from "react";
import { Trip } from "../../TripsLandingPage";
import { collection, query, onSnapshot, orderBy } from "firebase/firestore";
import { auth, db } from "../../../../firebase-config";

export interface TripData extends Trip {
  id: string;
  updatedAt: Date;
  subCollections: string[];
  customCollections: string[];
  currentSavings: number;
  taskList: string;
  packingList?: string;
}

export function useGetTrips() {
  const [trips, setTrips] = useState<TripData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      setLoading(false);
      setError("User not authenticated.");
      return;
    }

    const tripsRef = collection(db, `users/${user.uid}/trips`);
    const tripsQuery = query(tripsRef, orderBy("updatedAt", "desc"));

    const unsubscribe = onSnapshot(
      tripsQuery,
      (snapshot) => {
        const tripData = snapshot.docs.map((doc) => {
          const updatedAt = new Date(doc.data().updatedAt.seconds * 1000);

          return {
            ...doc.data(),
            id: doc.id,
            updatedAt: updatedAt,
          };
        }) as TripData[];

        setTrips(tripData);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching trips:", error);
        setError("Failed to fetch trips.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { trips, loading, error };
}
