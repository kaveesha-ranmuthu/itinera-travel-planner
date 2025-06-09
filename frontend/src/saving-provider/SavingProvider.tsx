import { useState } from "react";
import { SavingContext } from "../contexts";

export const SavingProvider = ({ children }: { children: React.ReactNode }) => {
  const [isSaving, setIsSaving] = useState(false);

  return (
    <SavingContext.Provider value={{ isSaving, setIsSaving }}>
      {children}
    </SavingContext.Provider>
  );
};
