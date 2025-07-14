import { twMerge } from "tailwind-merge";
import { useAuth } from "../hooks/useAuth";
import errorGraphic from "./errorGraphic.svg";

const Error = () => {
  const { settings } = useAuth();
  return (
    <div
      className={twMerge(
        "w-full flex flex-col items-center justify-center h-screen",
        settings?.font ?? "font-brand tracking-wide"
      )}
    >
      <img
        src={errorGraphic}
        alt="Person with binoculars"
        className="w-1/2 -mb-16 -mt-20"
      />
      <h1 className="text-4xl mb-2">Oops! Something went wrong.</h1>
      <p className="text-lg">
        We couldn’t process your request. Please try again.
      </p>
    </div>
  );
};

export default Error;
