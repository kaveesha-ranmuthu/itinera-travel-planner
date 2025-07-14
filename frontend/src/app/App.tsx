import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AdvancedSettings from "../pages-2/AdvancedSettings";
import LoginPage from "../features/authentication/components/LoginPage";
import ResetPassword from "../features/authentication/components/ResetPassword";
import SignupPage from "../features/authentication/components/SignupPage";
import { useAuth } from "../hooks/useAuth";
import { useSaving } from "../hooks/useSaving";
import { saveTripData } from "../pages/trips/components/sections/helpers";
import useSaveAllData from "../pages/trips/hooks/setters/useSaveAllData";
import MapViewPage from "../pages/trips/MapView";
import TripPage from "../pages/trips/TripPage";
import TripsLandingPage from "../pages-2/TripsLandingPage";
import "./App.css";
import { Loading } from "../components/Loading";
import LandingPage from "../pages-2/LandingPage";

function App() {
  const { user, loading } = useAuth();
  const { setIsSaving } = useSaving();
  const { saveAllData } = useSaveAllData();
  const [showLoading, setShowLoading] = useState(true);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        setIsSaving(true);
        await saveTripData(saveAllData);
      } finally {
        setIsSaving(false);
      }
    }, 5 * 60 * 1000);

    return () => {
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
                <Loading />
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
                <Loading />
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
                <Loading />
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
                <Loading />
              ) : !user ? (
                <Navigate to="/login" />
              ) : (
                <AdvancedSettings />
              )
            }
          />
          <Route
            path="/reset-password"
            element={
              showLoading ? (
                <Loading />
              ) : user ? (
                <Navigate to="/" />
              ) : (
                <ResetPassword />
              )
            }
          />
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
