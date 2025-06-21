import { useEffect, useState } from "react";
import { collection, onSnapshot, query, Unsubscribe } from "firebase/firestore";
import { db, auth } from "../../../../firebase-config";
import { onAuthStateChanged } from "firebase/auth";
import { LocationDetails } from "../../types";

export interface CustomSectionData {
  [sectionName: string]: LocationDetails[];
}

export const useGetAllCustomSections = (
  tripId: string,
  sectionNames: string[]
) => {
  const [data, setData] = useState<CustomSectionData>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribes: Unsubscribe[] = [];

    const authUnsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setError("User not authenticated.");
        setLoading(false);
        return;
      }

      sectionNames.forEach((sectionName) => {
        const ref = collection(
          db,
          `users/${user.uid}/trips/${tripId}/${sectionName}`
        );
        const q = query(ref);

        const unsubscribe = onSnapshot(
          q,
          (snapshot) => {
            setData((prev) => ({
              ...prev,
              [sectionName]: snapshot.docs.map((doc) => ({
                ...(doc.data() as LocationDetails),
              })),
            }));
            setLoading(false);
          },
          (err) => {
            setError(`Failed to load section ${sectionName}: ${err.message}`);
            setLoading(false);
          }
        );

        unsubscribes.push(unsubscribe);
      });
    });

    return () => {
      unsubscribes.forEach((unsub) => unsub());
      authUnsubscribe?.();
    };
  }, [sectionNames, tripId]);

  return { data, loading, error };
};
