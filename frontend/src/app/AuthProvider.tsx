import { onAuthStateChanged, User } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { PropsWithChildren, useEffect, useState } from "react";
import { auth, db } from "../config/firebase-config";
import { FontFamily, UserSettings } from "../types";
import { AuthContext } from "./contexts";

export const AuthProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeUser: (() => void) | null = null;
    let unsubscribeSettings: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        const userRef = doc(db, `users/${currentUser.uid}`);

        unsubscribeUser = onSnapshot(userRef, (docSnap) => {
          if (!docSnap.exists()) {
            console.warn("User document missing in Firestore");
          }
        });

        const settingsRef = doc(
          db,
          `users/${currentUser.uid}/settings/default`
        );

        unsubscribeSettings = onSnapshot(settingsRef, (docSnap) => {
          if (docSnap.exists()) {
            setSettings(docSnap.data() as UserSettings);
          } else {
            setSettings({
              font: FontFamily.HANDWRITTEN,
              packingList: "",
              preferredDisplay: "gallery",
            });
          }
          setLoading(false);
        });
      } else {
        setSettings(null);
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeUser) unsubscribeUser();
      if (unsubscribeSettings) unsubscribeSettings();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, settings, setSettings, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
