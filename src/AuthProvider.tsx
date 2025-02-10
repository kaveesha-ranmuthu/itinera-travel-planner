import { onAuthStateChanged, User } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { PropsWithChildren, useEffect, useState } from "react";
import { auth, db } from "./firebase-config";
import { FontFamily, UserSettings } from "./types";
import { AuthContext } from "./contexts";

export const AuthProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userSettingsRef = doc(db, "user-settings", currentUser.uid);

        const unsubscribeSettings = onSnapshot(userSettingsRef, (document) => {
          if (document.exists()) {
            setSettings(document.data() as UserSettings);
          } else {
            setSettings({ font: FontFamily.HANDWRITTEN });
          }
        });
        setLoading(false);
        return () => unsubscribeSettings();
      } else {
        setSettings(null);
      }
      setLoading(false);
    });

    return () => unsubscribeAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, settings, setSettings, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
