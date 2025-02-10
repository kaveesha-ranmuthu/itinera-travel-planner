import { Toaster } from "react-hot-toast";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import LoginPage from "./pages/authentication/LoginPage";
import ResetPassword from "./pages/authentication/ResetPassword";
import SignupPage from "./pages/authentication/SignupPage";
import LandingPage, { LoadingState } from "./pages/landing-page/LandingPage";
import TripsLandingPage from "./pages/trips/TripsLandingPage";
import { useAuth } from "./hooks/useAuth";

function App() {
  const { user, loading } = useAuth();

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
