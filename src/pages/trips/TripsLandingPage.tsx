import React, { useState } from "react";
import { twMerge } from "tailwind-merge";
import Button from "../../components/Button";
import { useAuth } from "../../hooks/useAuth";
import { FontFamily } from "../../types";
import ErrorPage from "../error/ErrorPage";
import Header from "./components/Header";
import PopupModal from "./components/PopupModal";
import MultiSelect, { SelectOption, SingleSelect } from "./components/Select";
import { useGetCountries } from "./hooks/getters/useGetCountries";
import { useGetCurrencies } from "./hooks/getters/useGetCurrencies";
import art1 from "./images/jan-brueghel-the-younger/art-1.jpg";
import EditImagePopup from "./components/EditImagePopup";
import { useFormik } from "formik";
import { convertToBase64 } from "./helpers";
import { useSaveTrip } from "./hooks/setters/useSaveTrips";
import { useHotToast } from "../../hooks/useHotToast";

export interface TripFormInput {
  tripName: string;
  startDate: string;
  endDate: string;
  countries: SelectOption[];
  numberOfPeople: number;
  currency: SelectOption | null;
  budget: number;
  image: string;
}

const TripsLandingPage = () => {
  const { settings } = useAuth();
  const { countries, error: countryFetchError } = useGetCountries();
  const { currencies, error: currencyFetchError } = useGetCurrencies();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [displayImage, setDisplayImage] = useState(art1);
  const { saveTrip } = useSaveTrip();
  const { notify } = useHotToast();

  const formik = useFormik<TripFormInput>({
    initialValues: {
      tripName: "my trip",
      startDate: "",
      endDate: "",
      countries: [],
      numberOfPeople: 0,
      currency: null,
      budget: 0,
      image: art1,
    },
    onSubmit: async (values) => {
      if (
        !values.tripName.trim() ||
        values.budget == undefined ||
        !values.startDate ||
        !values.endDate ||
        !values.countries.length ||
        values.numberOfPeople == undefined ||
        !values.currency
      ) {
        notify("Please fill in all the fields.", "error");
        return;
      }

      if (values.budget <= 0 || values.numberOfPeople <= 0) {
        notify("Please enter a valid number.", "error");
        return;
      }

      if (new Date(values.startDate) > new Date(values.endDate)) {
        notify("End date must be after start date.", "error");
        return;
      } else if (new Date(values.startDate) < new Date()) {
        notify("Start date must be in the future.", "error");
        return;
      }

      const error = await saveTrip({
        tripName: values.tripName,
        startDate: values.startDate,
        endDate: values.endDate,
        countries: values.countries,
        numberOfPeople: values.numberOfPeople,
        currency: values.currency,
        budget: values.budget,
        image: values.image,
      });

      if (error) {
        notify("Something went wrong. Please try again.", "error");
      } else {
        setIsModalOpen(false);
        formik.resetForm();
      }
    },
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
    formik.resetForm();
  };

  const handleImageSelect = (imageSrc: string) => {
    formik.setFieldValue("image", imageSrc);
    setDisplayImage(imageSrc);
  };

  const handleImageUpload = async (file: File) => {
    const imageData = await convertToBase64(file);
    formik.setFieldValue("image", imageData);
    setDisplayImage(URL.createObjectURL(file));
  };

  return (
    <div className={settings?.font ?? FontFamily.HANDWRITTEN}>
      <Header />
      <div className="px-20">
        <div className="flex justify-center text-5xl tracking-widest">
          <h1>my trips</h1>
        </div>
        <div className="py-14">
          <CreateNewTripButton onClick={() => setIsModalOpen(true)} />
          <PopupModal isOpen={isModalOpen} onClose={handleCloseModal}>
            <form onSubmit={formik.handleSubmit}>
              <div className="relative">
                <img
                  src={displayImage}
                  alt="background image"
                  className="h-40 w-full object-cover rounded-2xl drop-shadow-(--drop-shadow-default)"
                />
                <EditImagePopup
                  onImageClick={handleImageSelect}
                  onImageUpload={handleImageUpload}
                />
              </div>
              <div className="px-3 mt-3 text-secondary text-lg space-y-6">
                <input
                  className="text-4xl opacity-45 focus:opacity-100 focus:outline-0 underline underline-offset-4"
                  defaultValue={formik.values.tripName}
                  id="tripName"
                  onChange={formik.handleChange}
                />
                <div>
                  <p>When are you going?</p>
                  <div className="space-x-4 flex items-center mt-3.5">
                    <input
                      type="date"
                      id="startDate"
                      onChange={formik.handleChange}
                      className="border border-secondary rounded-xl px-2 py-1 w-1/2"
                    />
                    <p>to</p>
                    <input
                      type="date"
                      id="endDate"
                      onChange={formik.handleChange}
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
                      id="numberOfPeople"
                      onChange={formik.handleChange}
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
                        id="budget"
                        onChange={formik.handleChange}
                        placeholder={formik.values.currency?.otherInfo?.symbol}
                        type="number"
                        className=" border border-secondary rounded-xl px-2 py-1 w-30"
                      />
                    </div>
                  </div>
                </div>
                <div className="space-x-4 mt-14">
                  <Button.Secondary
                    className={twMerge(
                      "normal-case not-italic",
                      settings?.font
                    )}
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
      </div>
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
