import { User } from "firebase/auth";
import { createContext } from "react";
import { UserSettings } from "../types/types";

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
