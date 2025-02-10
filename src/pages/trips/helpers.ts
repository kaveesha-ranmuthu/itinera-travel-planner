import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase-config";
import { UserSettings } from "../../types";

export const updateUserSettings = async (
  userId: string,
  newSettings: UserSettings
) => {
  try {
    const userSettingsRef = doc(db, "user-settings", userId);
    await updateDoc(userSettingsRef, newSettings);
  } catch (error) {
    throw new Error(`Error updating settings:, ${error}`);
  }
};
