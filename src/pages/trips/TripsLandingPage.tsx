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
import { compressAndConvertToBase64 } from "./helpers";
import { useSaveTrip } from "./hooks/setters/useSaveTrips";
import { useHotToast } from "../../hooks/useHotToast";
import { useFetchTrips } from "./hooks/getters/useFetchTrips";
import { sortBy } from "lodash";

export interface Trip {
  tripName: string;
  startDate: string;
  endDate: string;
  countries: SelectOption[];
  numberOfPeople: number;
  currency: SelectOption | null;
  budget: number;
  imageData: string;
}

const TripsLandingPage = () => {
  const { settings } = useAuth();
  const { trips, error: tripsFetchError } = useFetchTrips();
  const { countries, error: countryFetchError } = useGetCountries();
  const { currencies, error: currencyFetchError } = useGetCurrencies();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [displayImage, setDisplayImage] = useState(art1);
  const { saveTrip } = useSaveTrip();
  const { notify } = useHotToast();

  const formik = useFormik<Trip>({
    initialValues: {
      tripName: "my trip",
      startDate: "",
      endDate: "",
      countries: [],
      numberOfPeople: 0,
      currency: null,
      budget: 0,
      imageData: art1,
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
        imageData: values.imageData,
      });

      if (error) {
        notify("Something went wrong. Please try again.", "error");
      } else {
        setIsModalOpen(false);
        formik.resetForm();
      }
    },
  });

  if (countryFetchError || currencyFetchError || tripsFetchError) {
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
    setDisplayImage(art1);
  };

  const handleImageSelect = (imageSrc: string) => {
    formik.setFieldValue("image", imageSrc);
    setDisplayImage(imageSrc);
  };

  const handleImageUpload = async (file: File) => {
    try {
      const imageData = await compressAndConvertToBase64(file);
      formik.setFieldValue("image", imageData);
      setDisplayImage(URL.createObjectURL(file));
    } catch {
      notify("Something went wrong. Please try again.", "error");
    }
  };

  const sortedTrips = sortBy(trips, "createdAt").reverse();

  console.log(sortedTrips);

  return (
    <div className={settings?.font ?? FontFamily.HANDWRITTEN}>
      <Header />
      <div className="px-20">
        <div className="flex justify-center text-5xl tracking-widest">
          <h1>my trips</h1>
        </div>
        <div className="py-14">
          <div className="grid grid-cols-3 gap-10">
            {sortedTrips.map(({ imageData, tripName }) => {
              return (
                <TripCard
                  backgroundImage={imageData}
                  tripName={tripName}
                  onClick={() => null}
                />
              );
            })}
            <CreateNewTripButton onClick={() => setIsModalOpen(true)} />
          </div>

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
    <div
      onClick={onClick}
      className="hover:opacity-60 transition ease-in-out duration-400 cursor-pointer border border-secondary w-80 rounded-2xl h-48  flex items-center justify-center drop-shadow-(--drop-shadow-default)"
    >
      <p className="text-2xl text-secondary">Create new trip</p>
    </div>
  );
};

interface TripCardProps {
  onClick: () => void;
  tripName: string;
  backgroundImage: string;
}

const TripCard: React.FC<TripCardProps> = ({
  tripName,
  backgroundImage,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className="bg-black rounded-2xl w-80 relative group cursor-pointer"
    >
      <img
        src={backgroundImage}
        className="object-cover group-hover:opacity-60 transition ease-in-out duration-400 cursor-pointer w-full rounded-2xl h-48  flex items-center justify-center drop-shadow-(--drop-shadow-default)"
      />
      <div className="absolute opacity-0 flex group-hover:opacity-100 top-0 transition ease-in-out duration-400 text-primary text-2xl items-center w-full justify-center h-full">
        <span className="w-[70%] text-center truncate">{tripName}</span>
      </div>
    </div>
  );
};

export default TripsLandingPage;
