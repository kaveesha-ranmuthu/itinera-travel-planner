import React, { PropsWithChildren, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import ErrorPage from "../error/ErrorPage";
import { LoadingState } from "../landing-page/LandingPage";
import Header from "./components/Header";
import TripHeader from "./components/TripHeader";
import useGetTrip from "./hooks/getters/useGetTrip";
import { IoMapOutline } from "react-icons/io5";
import { GoTasklist } from "react-icons/go";
import SimpleTooltip from "./components/SimpleTooltip";
import { FiEdit } from "react-icons/fi";
import { PiMoneyWavy } from "react-icons/pi";
import CreateTripPopup from "./components/CreateTripPopup";
import PopoverMenu from "./components/PopoverMenu";

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

type HeaderIcon = {
  icon: React.ReactNode;
  tooltipText: string;
  onClick: () => void;
  isPopover?: boolean;
};

const TripInfo: React.FC<TripInfoProps> = ({ tripId }) => {
  const { error, loading, trip, updateTripDetails } = useGetTrip(tripId);
  const { settings } = useAuth();
  const [isEditTripModalOpen, setIsEditTripModalOpen] = useState(false);

  if (loading) {
    return <LoadingState />;
  }

  if (error || !trip) {
    return <ErrorPage />;
  }

  const headerIcons: HeaderIcon[] = [
    {
      icon: (
        <FiEdit stroke="var(--color-primary)" size={20} strokeWidth={1.5} />
      ),
      tooltipText: "Edit trip details",
      onClick: () => setIsEditTripModalOpen(true),
      isPopover: false,
    },
    {
      icon: <GoTasklist fill="var(--color-primary)" size={20} />,
      tooltipText: "Tasklist",
      onClick: () => null,
    },
    {
      icon: <PiMoneyWavy fill="var(--color-primary)" size={20} />,
      tooltipText: "Currency converter",
      onClick: () => null,
    },
    {
      icon: <IoMapOutline stroke="var(--color-primary)" size={20} />,
      tooltipText: "View map",
      onClick: () => null,
      isPopover: false,
    },
  ];

  return (
    <div className={settings?.font}>
      <Header />
      <div className="px-10">
        <TripHeader trip={trip} />
      </div>
      <div className="px-16">
        <div className="space-x-2 mt-4 w-full flex items-center justify-end">
          {headerIcons.map((icon, index) => (
            <HeaderIconButton
              key={index}
              onClick={icon.onClick}
              tooltipText={icon.tooltipText}
              isPopover={icon.isPopover}
            >
              {icon.icon}
            </HeaderIconButton>
          ))}
        </div>
      </div>
      <CreateTripPopup
        isOpen={isEditTripModalOpen}
        onClose={() => setIsEditTripModalOpen(false)}
        initialValues={trip}
        onSubmit={updateTripDetails}
      />
    </div>
  );
};

interface HeaderIconButtonProps {
  tooltipText: string;
  onClick: () => void;
  isPopover?: boolean;
}

const HeaderIconButton: React.FC<PropsWithChildren<HeaderIconButtonProps>> = ({
  children,
  tooltipText,
  onClick,
  isPopover = true,
}) => {
  if (!isPopover) {
    return (
      <SimpleTooltip content={tooltipText} marginTop="mt-2" theme="dark">
        <button
          onClick={onClick}
          type="button"
          className="bg-secondary rounded-full p-2 hover:scale-105 cursor-pointer hover:opacity-95"
        >
          {children}
        </button>
      </SimpleTooltip>
    );
  }

  return (
    <PopoverMenu
      className="w-fit mt-1.5"
      popoverTrigger={
        <SimpleTooltip content={tooltipText} marginTop="mt-2" theme="dark">
          <div
            onClick={onClick}
            className="bg-secondary rounded-full p-2 hover:scale-105 cursor-pointer hover:opacity-95"
          >
            {children}
          </div>
        </SimpleTooltip>
      }
    >
      aaaa
    </PopoverMenu>
  );
};

export default TripPage;
