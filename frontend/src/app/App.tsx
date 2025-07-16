import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Loading } from "../components/Loading";
import { useAuth } from "../hooks/useAuth";
import { useSaving } from "../hooks/useSaving";
import AdvancedSettingsPage from "../pages/AdvancedSettingsPage";
import DashboardPage from "../pages/DashboardPage";
import LandingPage from "../pages/LandingPage";
import LoginPage from "../pages/LoginPage";
import ResetPasswordPage from "../pages/ResetPasswordPage";
import SignupPage from "../pages/SignupPage";
import { saveTripData } from "../features/trip/utils/helpers";
import useSaveAllData from "../hooks/useSaveAllData";
import MapViewPage from "../pages/MapViewPage";
import "./App.css";
import TripPage from "../pages/TripPage";

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
