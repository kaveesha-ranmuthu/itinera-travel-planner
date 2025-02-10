import { useAuth } from "../../hooks/useAuth";
import { FontFamily } from "../../types";
import Header from "./components/Header";

const TripsLandingPage = () => {
  const { settings } = useAuth();

  return (
    <div className={settings?.font ?? FontFamily.HANDWRITTEN}>
      <Header />
      <div className="flex justify-center text-5xl tracking-widest">
        <h1>my trips</h1>
      </div>
      <CreateNewTripButton />
    </div>
  );
};

const CreateNewTripButton = () => {
  return (
    <button className="hover:opacity-60 transition ease-in-out duration-400 cursor-pointer border border-secondary w-96 rounded-2xl h-56 flex items-center justify-center drop-shadow-(--drop-shadow-default)">
      <p className="text-2xl">Create new trip</p>
    </button>
  );
};

export default TripsLandingPage;
