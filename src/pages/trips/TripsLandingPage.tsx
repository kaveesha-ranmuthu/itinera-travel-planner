import { useAuth } from "../../hooks/useAuth";
import { FontFamily } from "../../types";
import Header from "./components/Header";

const TripsLandingPage = () => {
  const { settings } = useAuth();

  return (
    <div className={settings?.font ?? FontFamily.HANDWRITTEN}>
      <Header />
    </div>
  );
};

export default TripsLandingPage;
