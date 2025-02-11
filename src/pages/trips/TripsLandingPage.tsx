import React, { useState } from "react";
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
import EditImagePopup from "./components/EditImagePopup";
import { useFormik } from "formik";

type TripFormInput = {
  tripName: string;
  startDate: string;
  endDate: string;
  countries: SelectOption[];
  people: number;
  currency: SelectOption | null;
  budget: number;
  image: string;
};

const TripsLandingPage = () => {
  const { settings } = useAuth();
  const { countries, error: countryFetchError } = useGetCountries();
  const { currencies, error: currencyFetchError } = useGetCurrencies();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formik = useFormik<TripFormInput>({
    initialValues: {
      tripName: "my trip",
      startDate: "",
      endDate: "",
      countries: [],
      people: 0,
      currency: null,
      budget: 0,
      image: art1,
    },
    validate: (values) => {},
    onSubmit: async (values) => {},
  });

  if (countryFetchError || currencyFetchError) {
    return <ErrorPage />;
  }

  const handleCountryInputChange = (countries: SelectOption[]) => {
    if (!countries) return;

    formik.setFieldValue("countries", countries);
  };

  const handleCurrencyInputChange = (currency: SelectOption) => {
    formik.setFieldValue("currency", currency);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleImageSelect = (imageSrc: string) => {
    formik.setFieldValue("image", imageSrc);
  };

  return (
    <div className={settings?.font ?? FontFamily.HANDWRITTEN}>
      <Header />
      <div className="flex justify-center text-5xl tracking-widest">
        <h1>my trips</h1>
      </div>
      <CreateNewTripButton onClick={() => setIsModalOpen(true)} />
      <PopupModal isOpen={isModalOpen} onClose={handleCloseModal}>
        <form onSubmit={formik.handleSubmit}>
          <div className="relative">
            <img
              src={formik.values.image}
              alt="background image"
              className="h-40 w-full object-cover rounded-2xl drop-shadow-(--drop-shadow-default)"
            />
            <EditImagePopup onImageClick={handleImageSelect} />
          </div>
          <div className="px-3 mt-3 text-secondary text-lg space-y-6">
            <input
              className="text-4xl opacity-45 focus:opacity-100 focus:outline-0 underline underline-offset-4"
              defaultValue={formik.values.tripName}
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
                    currentlySelectedOptions={formik.values.countries}
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
                    currentlySelectedOption={formik.values.currency}
                  />
                </div>
              </div>
              <div>
                <p className="mb-4">What's your budget?</p>
                <div className="relative">
                  <input
                    placeholder={formik.values.currency?.otherInfo?.symbol}
                    type="number"
                    className=" border border-secondary rounded-xl px-2 py-1 w-30"
                  />
                </div>
              </div>
            </div>
            <div className="space-x-4 mt-14">
              <Button.Secondary
                className={twMerge("normal-case not-italic", settings?.font)}
                type="submit"
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
        </form>
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
