import { doc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../../../firebase-config";
import { IconStyles } from "../../types";

export const useSaveIconStyles = () => {
  const saveIconStyles = async (tripId: string, iconStyles: IconStyles) => {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    const tripRef = doc(db, `users/${user.uid}/trips/${tripId}`);

    await updateDoc(tripRef, {
      "settings.iconStyles": iconStyles,
      updatedAt: new Date().toISOString(),
    });
  };

  return { saveIconStyles };
};
