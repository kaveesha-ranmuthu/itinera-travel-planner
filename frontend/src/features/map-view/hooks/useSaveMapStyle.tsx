import { doc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../../config/firebase-config";
import { MapViewStyles } from "../types/types";

export const useSaveMapStyle = () => {
  const saveMapStyle = async (tripId: string, mapStyle: MapViewStyles) => {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    const tripRef = doc(db, `users/${user.uid}/trips/${tripId}`);

    await updateDoc(tripRef, {
      "settings.mapStyle": mapStyle,
    });
  };

  return { saveMapStyle };
};
