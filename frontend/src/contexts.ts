import { User } from "firebase/auth";
import { UserSettings } from "./types";
import { createContext } from "react";

interface AuthContextType {
  user: User | null;
  settings: UserSettings | null;
  setSettings: (settings: UserSettings) => void;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);

interface SavingContextType {
  isSaving: boolean;
  setIsSaving: (val: boolean) => void;
}

export const SavingContext = createContext<SavingContextType>({
  isSaving: false,
  setIsSaving: () => {},
});
