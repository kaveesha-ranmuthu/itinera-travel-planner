import { useAuth } from "../../hooks/useAuth";
import { FontFamily } from "../../types";
import Header from "./components/Header";

const TripsLandingPage = () => {
  const { settings } = useAuth();

  return (
    <div className={settings?.font ?? FontFamily.HANDWRITTEN}>
      <Header />
      <div className="flex justify-center text-4xl tracking-widest">
        <h1>my trips</h1>
      </div>
    </div>
  );
};

export default TripsLandingPage;
