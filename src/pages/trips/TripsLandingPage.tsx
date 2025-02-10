import axios from "axios";
import { useAuth } from "../../hooks/useAuth";
import { FontFamily } from "../../types";
import Header from "./components/Header";
import PopupModal from "./components/PopupModal";
import art1 from "./images/art-1.jpg";
import { useState } from "react";
import { sortBy } from "lodash";
import { useHotToast } from "../../hooks/useHotToast";
import MultiSelect, { MultiSelectOption } from "./components/MultiSelect";

const TripsLandingPage = () => {
  const { settings } = useAuth();
  const [countries, setCountries] = useState<MultiSelectOption[]>([]);
  const { notify } = useHotToast();

  axios
    .get("https://restcountries.com/v3.1/all")
    .then((response) => {
      setCountries(
        sortBy(
          response.data.map((country) => ({
            id: country.name.common,
            name: country.name.common,
          }))
        )
      );
    })
    .catch(() => {
      notify("Some thing went wrong. Please try again.", "error");
    });

  return (
    <div className={settings?.font ?? FontFamily.HANDWRITTEN}>
      <Header />
      <div className="flex justify-center text-5xl tracking-widest">
        <h1>my trips</h1>
      </div>
      <PopupModal triggerElement={<CreateNewTripButton />}>
        <img
          src={art1}
          alt="background image"
          className="h-40 w-full object-cover rounded-2xl drop-shadow-(--drop-shadow-default)"
        />
        <div className="px-3 mt-3 text-secondary text-lg space-y-6">
          <input
            className="text-4xl opacity-45 focus:opacity-100 focus:outline-0 underline underline-offset-4"
            value="my trip"
          />
          <div>
            <p>When are you going?</p>
            <div className="space-x-4 flex items-center mt-3.5">
              <input
                type="date"
                className="border border-secondary rounded-xl px-2 py-1 w-1/2"
              />
              <p>to</p>
              <input
                type="date"
                className="border border-secondary rounded-xl px-2 py-1 w-1/2"
              />
            </div>
          </div>
          <div>
            <p>What countries will you visit?</p>
            <MultiSelect onChange={() => null} options={countries} />
          </div>
        </div>
      </PopupModal>
    </div>
  );
};

const CreateNewTripButton = () => {
  return (
    <div className="hover:opacity-60 transition ease-in-out duration-400 cursor-pointer border border-secondary w-80 rounded-2xl h-48  flex items-center justify-center drop-shadow-(--drop-shadow-default)">
      <p className="text-2xl text-secondary">Create new trip</p>
    </div>
  );
};

export default TripsLandingPage;
