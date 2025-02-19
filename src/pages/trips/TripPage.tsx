import React, { PropsWithChildren } from "react";
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
  const { error, loading, trip } = useGetTrip(tripId);
  const { settings } = useAuth();

  if (loading) {
    return <LoadingState />;
  }

  if (error || !trip) {
    return <ErrorPage />;
  }

  const headerIcons = [
    {
      icon: (
        <FiEdit stroke="var(--color-primary)" size={20} strokeWidth={1.5} />
      ),
      tooltipText: "Edit trip details",
      onClick: () => null,
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
    },
  ];

  return (
    <div className={settings?.font}>
      <Header />
      <div className="px-10">
        <TripHeader trip={trip} />
      </div>
      <div className="px-16">
        <div className="space-x-2 mt-4 w-full text-right">
          {headerIcons.map((icon, index) => (
            <HeaderIconButton
              key={index}
              onClick={icon.onClick}
              tooltipText={icon.tooltipText}
            >
              {icon.icon}
            </HeaderIconButton>
          ))}
        </div>
      </div>
    </div>
  );
};

interface HeaderIconButtonProps {
  tooltipText: string;
  onClick: () => void;
}

const HeaderIconButton: React.FC<PropsWithChildren<HeaderIconButtonProps>> = ({
  children,
  tooltipText,
  onClick,
}) => {
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
};

export default TripPage;
