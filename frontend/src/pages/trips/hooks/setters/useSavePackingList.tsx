import { useEffect, useState } from "react";

import { onAuthStateChanged } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../../../config/firebase-config";
import { getPackingListLocalStorageKey } from "../../../../features/trip/utils/helpers";

const useSavePackingList = () => {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
        console.error("User not authenticated.");
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const savePackingList = async (tripId: string, packingList: string) => {
    if (!userId) throw new Error("User not authenticated.");

    try {
      const tripRef = doc(db, `users/${userId}/trips/${tripId}`);
      await updateDoc(tripRef, {
        packingList: packingList,
        updatedAt: new Date(),
      });
      localStorage.removeItem(getPackingListLocalStorageKey(tripId));
    } catch {
      throw new Error("Failed to update trip.");
    }
  };

  return { savePackingList };
};

export default useSavePackingList;
