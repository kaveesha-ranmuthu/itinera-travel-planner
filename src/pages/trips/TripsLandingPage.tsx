import React, { useState } from "react";
import { FiEdit } from "react-icons/fi";
import { twMerge } from "tailwind-merge";
import Button from "../../components/Button";
import { useAuth } from "../../hooks/useAuth";
import { FontFamily } from "../../types";
import ErrorPage from "../error/ErrorPage";
import Header from "./components/Header";
import PopupModal from "./components/PopupModal";
import MultiSelect, { SelectOption, SingleSelect } from "./components/Select";
import { useGetCountries } from "./hooks/useGetCountries";
import { useGetCurrencies } from "./hooks/useGetCurrencies";
import art1 from "./images/jan-brueghel-the-younger/art-1.jpg";

const TripsLandingPage = () => {
  const { settings } = useAuth();
  const { countries, error: countryFetchError } = useGetCountries();
  const { currencies, error: currencyFetchError } = useGetCurrencies();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCountries, setSelectedCountries] = useState<SelectOption[]>(
    []
  );
  const [selectedCurrency, setSelectedCurrency] = useState<SelectOption | null>(
    null
  );

  if (countryFetchError || currencyFetchError) {
    return <ErrorPage />;
  }

  const handleCountryInputChange = (countries: SelectOption[]) => {
    if (!countries) return;

    setSelectedCountries(countries);
  };

  const handleCurrencyInputChange = (currency: SelectOption) => {
    setSelectedCurrency(currency);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className={settings?.font ?? FontFamily.HANDWRITTEN}>
      <Header />
      <div className="flex justify-center text-5xl tracking-widest">
        <h1>my trips</h1>
      </div>
      <CreateNewTripButton onClick={() => setIsModalOpen(true)} />
      <PopupModal isOpen={isModalOpen} onClose={handleCloseModal}>
        <div className="relative">
          <img
            src={art1}
            alt="background image"
            className="h-40 w-full object-cover rounded-2xl drop-shadow-(--drop-shadow-default)"
          />
          <button
            type="button"
            className="bg-primary absolute bottom-2 right-2 p-2 rounded-lg cursor-pointer hover:opacity-85 transition ease-in-out duration-300"
          >
            <FiEdit stroke="#3b4043" size={20} />
          </button>
        </div>
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
          <div className="space-x-6 flex items-center mt-3.5">
            <div className="w-1/2">
              <p className="mb-4">What countries will you visit?</p>
              <div className="w-56">
                <MultiSelect
                  onChange={handleCountryInputChange}
                  options={countries}
                  currentlySelectedOptions={selectedCountries}
                />
              </div>
            </div>
            <div>
              <p className="mb-4">How many people are going?</p>
              <input
                type="number"
                className="border border-secondary rounded-xl px-2 py-1 w-20"
              />
            </div>
          </div>
          <div className="space-x-6 flex items-center mt-3.5">
            <div className="w-1/2">
              <p className="mb-4">What's your currency?</p>
              <div className="w-56">
                <SingleSelect
                  onChange={handleCurrencyInputChange}
                  options={currencies}
                  currentlySelectedOption={selectedCurrency}
                />
              </div>
            </div>
            <div>
              <p className="mb-4">What's your budget?</p>
              <div className="relative">
                <input
                  placeholder={selectedCurrency?.otherInfo?.symbol}
                  type="number"
                  className=" border border-secondary rounded-xl px-2 py-1 w-30"
                />
              </div>
            </div>
          </div>
          <div className="space-x-4 mt-14">
            <Button.Secondary
              className={twMerge("normal-case not-italic", settings?.font)}
            >
              Confirm
            </Button.Secondary>
            <Button.Primary
              className={twMerge(
                "normal-case not-italic border border-secondary",
                settings?.font
              )}
              onClick={handleCloseModal}
            >
              Cancel
            </Button.Primary>
          </div>
        </div>
      </PopupModal>
    </div>
  );
};

type CreateNewTripButtonProps = {
  onClick: () => void;
};
const CreateNewTripButton: React.FC<CreateNewTripButtonProps> = ({
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className="hover:opacity-60 transition ease-in-out duration-400 cursor-pointer border border-secondary w-80 rounded-2xl h-48  flex items-center justify-center drop-shadow-(--drop-shadow-default)"
    >
      <p className="text-2xl text-secondary">Create new trip</p>
    </button>
  );
};

export default TripsLandingPage;
