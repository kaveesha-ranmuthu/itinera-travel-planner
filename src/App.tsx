import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import LandingPage from "./pages/landing-page/LandingPage";
import LoginPage from "./pages/authentication/LoginPage";
import SignupPage from "./pages/authentication/SignupPage";
import { auth } from "./firebase-config";
import TripsPage from "./pages/trips-page/TripsPage";
import { onAuthStateChanged, User } from "firebase/auth";
import { useEffect, useState } from "react";

function App() {
  const [user, setUser] = useState<null | User>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  console.log(user);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={user ? <TripsPage /> : <LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
