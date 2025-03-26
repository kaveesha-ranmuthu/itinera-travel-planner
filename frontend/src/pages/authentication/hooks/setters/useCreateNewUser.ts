import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../../../firebase-config";
import { User } from "firebase/auth";
import { FontFamily } from "../../../../types";

export const useCreateNewUser = () => {
  const createUser = async (user: User) => {
    const userRef = doc(db, `users/${user.uid}`);
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) return;

    try {
      await setDoc(doc(db, `users/${user.uid}`), {
        userId: user.uid,
        email: user.email,
        createdAt: new Date(),
      });

      await setDoc(doc(db, `users/${user.uid}/settings/default`), {
        font: FontFamily.HANDWRITTEN,
      });
    } catch {
      throw new Error("Failed to create user.");
    }
  };

  return { createUser };
};
