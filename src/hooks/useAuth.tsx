import {
  useState,
  useEffect,
  createContext,
  useContext,
  PropsWithChildren,
} from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "../firebase-config";
import { FontFamily, UserSettings } from "../types";

interface AuthContextType {
  user: User | null;
  settings: UserSettings | null;
  setSettings: (settings: UserSettings) => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userSettingsRef = doc(db, "settings", currentUser.uid);

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

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
