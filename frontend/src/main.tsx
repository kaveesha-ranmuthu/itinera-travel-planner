import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { AuthProvider } from "./AuthProvider.tsx";
import { SavingProvider } from "./saving-provider/SavingProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <SavingProvider>
      <StrictMode>
        <App />
      </StrictMode>
    </SavingProvider>
  </AuthProvider>
);
