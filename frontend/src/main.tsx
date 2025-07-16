import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import { AuthProvider } from "./app/AuthProvider.tsx";
import { SavingProvider } from "./app/SavingProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <SavingProvider>
      <StrictMode>
        <App />
      </StrictMode>
    </SavingProvider>
  </AuthProvider>
);
