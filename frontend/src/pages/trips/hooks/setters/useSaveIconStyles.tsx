import { doc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../../../config/firebase-config";
import { IconId } from "../../icon-map";

export const useSaveIconStyles = () => {
  const saveIcon = async (tripId: string, iconId: IconId, section: string) => {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    const tripRef = doc(db, `users/${user.uid}/trips/${tripId}`);

    const updateKey = `settings.iconStyles.${section}.id`;
    await updateDoc(tripRef, {
      [updateKey]: iconId,
    });
  };

  const saveIconColour = async (
    tripId: string,
    colour: string,
    section: string
  ) => {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    const tripRef = doc(db, `users/${user.uid}/trips/${tripId}`);

    const updateKey = `settings.iconStyles.${section}.colour`;
    await updateDoc(tripRef, {
      [updateKey]: colour,
    });
  };

  const saveIconBackgroundColour = async (
    tripId: string,
    colour: string,
    section: string
  ) => {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    const tripRef = doc(db, `users/${user.uid}/trips/${tripId}`);

    const updateKey = `settings.iconStyles.${section}.backgroundColour`;
    await updateDoc(tripRef, {
      [updateKey]: colour,
    });
  };

  return { saveIcon, saveIconBackgroundColour, saveIconColour };
};
