import { Toaster } from "react-hot-toast";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import LoginPage from "./pages/authentication/LoginPage";
import ResetPassword from "./pages/authentication/ResetPassword";
import SignupPage from "./pages/authentication/SignupPage";
import LandingPage, { LoadingState } from "./pages/landing-page/LandingPage";
import TripsLandingPage from "./pages/trips/TripsLandingPage";
import { useAuth } from "./hooks/useAuth";
import TripPage from "./pages/trips/TripPage";
import MapViewPage from "./pages/trips/MapView";
import { useEffect, useState } from "react";
import { saveTripData } from "./pages/trips/components/sections/helpers";
import useSaveAllData from "./pages/trips/hooks/setters/useSaveAllData";

function App() {
  const { user, loading } = useAuth();
  const { saveAllData } = useSaveAllData();
  const [showLoading, setShowLoading] = useState(true);

  useEffect(() => {
    const interval = setInterval(async () => {
      await saveTripData(saveAllData);
    }, 5 * 60 * 1000);

    return () => {
      clearInterval(interval);
    };
  }, [saveAllData]);

  useEffect(() => {
    const isLoading = loading;

    if (isLoading) {
      setShowLoading(true);
    } else {
      const timeout = setTimeout(() => {
        setShowLoading(false);
      }, 1500);

      return () => clearTimeout(timeout);
    }
  }, [loading]);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              showLoading ? (
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
              showLoading ? (
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
              showLoading ? (
                <LoadingState />
              ) : user ? (
                <Navigate to="/" />
              ) : (
                <SignupPage />
              )
            }
          />
          <Route
            path="/advanced-settings"
            element={
              showLoading ? (
                <LoadingState />
              ) : !user ? (
                <Navigate to="/login" />
              ) : (
                <ResetPassword />
              )
            }
          />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/trip/:tripId" element={<TripPage />} />
          <Route path="/trip/:tripId/map" element={<MapViewPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </>
  );
}

export default App;
