import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Loading } from "../components/Loading";
import { useAuth } from "../hooks/useAuth";
import { useSaving } from "../hooks/useSaving";
import AdvancedSettings from "../pages-2/AdvancedSettings";
import Dashboard from "../pages-2/Dashboard";
import LandingPage from "../pages-2/LandingPage";
import LoginPage from "../pages-2/LoginPage";
import ResetPasswordPage from "../pages-2/ResetPasswordPage";
import SignupPage from "../pages-2/SignupPage";
import { saveTripData } from "../pages/trips/components/sections/helpers";
import useSaveAllData from "../pages/trips/hooks/setters/useSaveAllData";
import MapViewPage from "../pages/trips/MapView";
import TripPage from "../pages/trips/TripPage";
import "./App.css";

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
              showLoading ? <Loading /> : user ? <Dashboard /> : <LandingPage />
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
                <ResetPasswordPage />
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
