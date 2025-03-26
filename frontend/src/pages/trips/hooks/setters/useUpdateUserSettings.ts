import { doc, updateDoc } from "firebase/firestore";
import { UserSettings } from "../../../../types";
import { auth, db } from "../../../../firebase-config";

export function useUpdateUserSettings() {
  const updateSettings = async (newSettings: UserSettings) => {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("User not authenticated.");
    }

    try {
      const settingsRef = doc(db, `users/${user.uid}/settings/default`);
      await updateDoc(settingsRef, newSettings);
    } catch (error) {
      throw new Error(`Error updating settings: ${error}`);
    }
  };

  return { updateSettings };
}
