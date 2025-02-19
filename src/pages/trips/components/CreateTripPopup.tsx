import React, { useState } from "react";
import PopupModal from "./PopupModal";
import { useFormik } from "formik";
import { Trip } from "../TripsLandingPage";
import MultiSelect, { SelectOption, SingleSelect } from "./Select";
import { useHotToast } from "../../../hooks/useHotToast";
import art1 from "../images/jan-brueghel-the-younger/art-1.jpg";
import { useSaveTrip } from "../hooks/setters/useSaveTrip";
import { compressAndConvertToBase64 } from "../helpers";
import EditImagePopup from "./EditImagePopup";
import TripsInput from "./TripsInput";
import Button from "../../../components/Button";
import { twMerge } from "tailwind-merge";
import { useAuth } from "../../../hooks/useAuth";

interface CreateTripPopupProps {
  isOpen: boolean;
  onClose: () => void;
  countries: SelectOption[];
  currencies: SelectOption[];
}

const CreateTripPopup: React.FC<CreateTripPopupProps> = ({
  countries,
  currencies,
  isOpen,
  onClose,
}) => {
  const { notify } = useHotToast();
  const { saveTrip } = useSaveTrip();
  const [displayImage, setDisplayImage] = useState(art1);
  const { settings } = useAuth();

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
        onClose();
        formik.resetForm();
        setDisplayImage(art1);
      }
    },
  });

  const handleCountryInputChange = (countries: SelectOption[]) => {
    if (!countries) return;

    formik.setFieldValue("countries", countries);
  };

  const handleCurrencyInputChange = (currency: SelectOption) => {
    formik.setFieldValue("currency", currency);
  };

  const handleCloseModal = () => {
    onClose();
    formik.resetForm();
    setDisplayImage(art1);
  };

  const handleImageSelect = (imageSrc: string) => {
    formik.setFieldValue("imageData", imageSrc);
    setDisplayImage(imageSrc);
  };

  const handleImageUpload = async (file: File) => {
    try {
      const imageData = await compressAndConvertToBase64(file);
      formik.setFieldValue("imageData", imageData);
      setDisplayImage(URL.createObjectURL(file));
    } catch {
      notify("Something went wrong. Please try again.", "error");
    }
  };

  return (
    <PopupModal isOpen={isOpen} onClose={handleCloseModal}>
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
              <TripsInput
                type="number"
                id="numberOfPeople"
                onChange={formik.handleChange}
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
                <TripsInput
                  id="budget"
                  onChange={formik.handleChange}
                  placeholder={formik.values.currency?.otherInfo?.symbol}
                  type="number"
                  inputWidth="w-30"
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
  );
};

export default CreateTripPopup;
