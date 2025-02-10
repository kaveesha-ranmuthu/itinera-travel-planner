import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import LandingPage, { LoadingState } from "./pages/landing-page/LandingPage";
import LoginPage from "./pages/authentication/LoginPage";
import SignupPage from "./pages/authentication/SignupPage";
import { auth } from "./firebase-config";
import TripsLandingPage from "./pages/trips/TripsLandingPage";
import { onAuthStateChanged, User } from "firebase/auth";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import ResetPassword from "./pages/authentication/ResetPassword";

function App() {
  const [user, setUser] = useState<null | User>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const MIN_LOADING_TIME = 3000;
    const startTime = Date.now();

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);

      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, MIN_LOADING_TIME - elapsedTime);

      setTimeout(() => setLoading(false), remainingTime);
    });

    return () => unsubscribe();
  }, []);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              loading ? (
                <LoadingState />
              ) : user ? (
                <TripsLandingPage />
              ) : (
                <LandingPage />
              )
            }
          />
          <Route
            path="/login"
            element={
              loading ? (
                <LoadingState />
              ) : user ? (
                <Navigate to="/" />
              ) : (
                <LoginPage />
              )
            }
          />
          <Route
            path="/signup"
            element={
              loading ? (
                <LoadingState />
              ) : user ? (
                <Navigate to="/" />
              ) : (
                <SignupPage />
              )
            }
          />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </>
  );
}

export default App;
