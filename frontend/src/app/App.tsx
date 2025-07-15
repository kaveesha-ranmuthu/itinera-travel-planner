import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Loading } from "../components/Loading";
import { useAuth } from "../hooks/useAuth";
import { useSaving } from "../hooks/useSaving";
import AdvancedSettingsPage from "../pages-2/AdvancedSettingsPage";
import DashboardPage from "../pages-2/DashboardPage";
import LandingPage from "../pages-2/LandingPage";
import LoginPage from "../pages-2/LoginPage";
import ResetPasswordPage from "../pages-2/ResetPasswordPage";
import SignupPage from "../pages-2/SignupPage";
import { saveTripData } from "../features/trip/utils/helpers";
import useSaveAllData from "../pages/trips/hooks/setters/useSaveAllData";
import MapViewPage from "../pages/trips/MapView";
import "./App.css";
import TripPage from "../pages-2/TripPage";

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
                <DashboardPage />
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
                <AdvancedSettingsPage />
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
