import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { auth, db } from "../../../../config/firebase-config";
import { TripData, Trip } from "../../../../types/types";

const useGetTrip = (tripId: string) => {
  const [trip, setTrip] = useState<TripData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
        setError("User not authenticated.");
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  // ✅ Real-time listener for the trip document
  useEffect(() => {
    if (!tripId || !userId) return;

    setLoading(true);
    const tripRef = doc(db, `users/${userId}/trips/${tripId}`);

    const unsubscribeTrip = onSnapshot(
      tripRef,
      (snapshot) => {
        if (snapshot.exists()) {
          setTrip({ ...snapshot.data(), id: snapshot.id } as TripData);
          setError(null);
        } else {
          setTrip(null);
          setError("Trip not found.");
        }
        setLoading(false);
      },
      (err) => {
        setError("Failed to fetch trip: " + err.message);
        setLoading(false);
      }
    );

    return () => unsubscribeTrip();
  }, [tripId, userId]);

  const updateTripDetails = async (
    updatedFields: TripData | Trip
  ): Promise<undefined | Error> => {
    if (!tripId) return new Error("Trip ID is missing.");
    if (!userId) return new Error("User not authenticated.");

    try {
      const tripRef = doc(db, `users/${userId}/trips/${tripId}`);
      await updateDoc(tripRef, { ...updatedFields, updatedAt: new Date() });
    } catch {
      return new Error("Failed to update trip.");
    }
  };

  return { trip, loading, error, updateTripDetails };
};

export default useGetTrip;
