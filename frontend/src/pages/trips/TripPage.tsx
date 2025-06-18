import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Element } from "react-scroll";
import { twMerge } from "tailwind-merge";
import Button from "../../components/Button";
import { useAuth } from "../../hooks/useAuth";
import { useHotToast } from "../../hooks/useHotToast";
import ErrorPage from "../error/ErrorPage";
import { LoadingState } from "../landing-page/LandingPage";
import { CreateCustomSectionPopup } from "./components/CreateCustomSectionPopup";
import CreateTripPopup from "./components/CreateTripPopup";
import FadeInSection from "./components/FadeInSection";
import Accommodation from "./components/sections/Accommodation";
import Activities from "./components/sections/Activities";
import Food from "./components/sections/Food";
import Header from "./components/sections/Header";
import HeaderIcons from "./components/sections/HeaderIcons";
import Itinerary from "./components/sections/Itinerary";
import PackingList from "./components/sections/PackingList";
import Transport from "./components/sections/Transport";
import TripHeader from "./components/sections/TripHeader";
import useGetTrip from "./hooks/getters/useGetTrip";
import useGetTripData from "./hooks/setters/useGetTripData";
import { useSaveCustomSection } from "./hooks/setters/useSaveCustomSection";
import CustomSection from "./components/sections/CustomSection";

const TripPage = () => {
  const { tripId } = useParams();

  if (!tripId) {
    return <ErrorPage />;
  }

  return <TripInfo tripId={tripId} />;
};

interface TripInfoProps {
  tripId: string;
}

const TripInfo: React.FC<TripInfoProps> = ({ tripId }) => {
  const { error, loading, trip, updateTripDetails } = useGetTrip(tripId);
  const {
    accommodationError,
    accommodationRows,
    foodError,
    foodItems,
    activitiesError,
    activities,
    transportError,
    transportRows,
    itineraryError,
    itinerary,
    loading: tripDataLoading,
  } = useGetTripData(tripId);
  const { saveCustomSection } = useSaveCustomSection();

  const { settings } = useAuth();
  const [isEditTripModalOpen, setIsEditTripModalOpen] = useState(false);
  const [isCreateSectionModalOpen, setIsCreateSectionModalOpen] =
    useState(false);
  const [showLoading, setShowLoading] = useState(true);

  const { notify } = useHotToast();

  useEffect(() => {
    const isLoading = loading || tripDataLoading;

    if (isLoading) {
      setShowLoading(true);
    } else {
      const timeout = setTimeout(() => {
        setShowLoading(false);
      }, 1500);

      return () => clearTimeout(timeout); // Cleanup timeout
    }
  }, [loading, tripDataLoading]);

  if (showLoading) {
    return <LoadingState />;
  }

  if (error || !trip) {
    return <ErrorPage />;
  }

  const handleCreateNewSection = (sectionName: string) => {
    try {
      saveCustomSection(trip.id, sectionName, []);
      updateTripDetails({
        ...trip,
        customCollections: [...trip.customCollections, sectionName],
      });
    } catch {
      notify("Something went wrong. Please try again.", "error");
    }
  };

  return (
    <div className={twMerge(settings?.font, "pb-16")}>
      <Header />
      <FadeInSection>
        <div className="px-10">
          <TripHeader trip={trip} />
        </div>
      </FadeInSection>
      <div className="px-16">
        <HeaderIcons
          trip={trip}
          onEditButtonClick={() => setIsEditTripModalOpen(true)}
        />
        <div className="space-y-10">
          <Element name="transport">
            <FadeInSection>
              <Transport
                userCurrency={trip.currency?.otherInfo?.symbol}
                startDate={trip.startDate}
                endDate={trip.endDate}
                tripId={trip.id}
                transportRows={transportRows}
                error={transportError}
              />
            </FadeInSection>
          </Element>
          <Element name="accommodation">
            <FadeInSection>
              <Accommodation
                userCurrencySymbol={trip.currency?.otherInfo?.symbol}
                userCurrencyCode={trip.currency?.name}
                numberOfPeople={trip.numberOfPeople}
                startDate={trip.startDate}
                endDate={trip.endDate}
                tripId={trip.id}
                accommodationRows={accommodationRows}
                error={accommodationError}
              />
            </FadeInSection>
          </Element>
          <Element name="food">
            <FadeInSection>
              <Food
                userCurrencySymbol={trip.currency?.otherInfo?.symbol}
                userCurrencyCode={trip.currency?.name}
                tripId={trip.id}
                error={foodError}
                foodItems={foodItems}
              />
            </FadeInSection>
          </Element>
          <Element name="activities">
            <FadeInSection>
              <Activities
                userCurrencySymbol={trip.currency?.otherInfo?.symbol}
                userCurrencyCode={trip.currency?.name}
                tripId={trip.id}
                error={activitiesError}
                activities={activities}
              />
            </FadeInSection>
          </Element>
          {trip.customCollections.map((col) => {
            return (
              <FadeInSection key={col}>
                <CustomSection
                  userCurrencySymbol={trip.currency?.otherInfo?.symbol}
                  userCurrencyCode={trip.currency?.name}
                  tripId={trip.id}
                  sectionName={col}
                />
              </FadeInSection>
            );
          })}
          <FadeInSection>
            <Button.Primary
              className={twMerge(
                "border border-secondary normal-case not-italic mt-5",
                settings?.font
              )}
              onClick={() => setIsCreateSectionModalOpen(true)}
            >
              <span>+ Create custom section</span>
            </Button.Primary>
          </FadeInSection>
          <Element name="itinerary">
            <FadeInSection>
              <div className="flex space-x-10 items-start">
                <div className="w-2/3">
                  <Itinerary
                    startDate={trip.startDate}
                    endDate={trip.endDate}
                    tripId={trip.id}
                    error={itineraryError}
                    itinerary={itinerary}
                  />
                </div>
                <div className="w-1/3">
                  <PackingList
                    tripId={trip.id}
                    savedPackingList={trip.packingList}
                  />
                </div>
              </div>
            </FadeInSection>
          </Element>
        </div>
      </div>
      <CreateTripPopup
        isOpen={isEditTripModalOpen}
        onClose={() => setIsEditTripModalOpen(false)}
        initialValues={trip}
        onSubmit={updateTripDetails}
      />
      <CreateCustomSectionPopup
        isOpen={isCreateSectionModalOpen}
        onClose={() => setIsCreateSectionModalOpen(false)}
        currentCollections={[...trip.subCollections, ...trip.customCollections]}
        onConfirm={handleCreateNewSection}
      />
    </div>
  );
};

export default TripPage;
