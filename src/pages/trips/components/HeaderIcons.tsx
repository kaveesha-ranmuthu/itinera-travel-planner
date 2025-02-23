import React, { PropsWithChildren } from "react";
import PopoverMenu from "./PopoverMenu";
import SimpleTooltip from "./SimpleTooltip";
import { FiEdit } from "react-icons/fi";
import { GoTasklist } from "react-icons/go";
import { IoMapOutline } from "react-icons/io5";
import { PiMoneyWavy } from "react-icons/pi";
import CurrencyConverter from "./CurrencyConverter";
import { TripData } from "../hooks/getters/useGetTrips";
import { useGetCurrencies } from "../hooks/getters/useGetCurrencies";

type HeaderIcon = {
  icon: React.ReactNode;
  tooltipText: string;
  onClick: () => void;
  popoverComponent?: React.ReactNode;
};

interface HeaderIconsProps {
  trip: TripData;
  onEditButtonClick: () => void;
}

const HeaderIcons: React.FC<HeaderIconsProps> = ({
  onEditButtonClick,
  trip,
}) => {
  const {
    currencies,
    error: currencyFetchError,
    loading: currencyFetchLoading,
  } = useGetCurrencies();

  const headerIcons: HeaderIcon[] = [
    {
      icon: (
        <FiEdit stroke="var(--color-primary)" size={20} strokeWidth={1.5} />
      ),
      tooltipText: "Edit trip details",
      onClick: onEditButtonClick,
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
      popoverComponent: (
        <CurrencyConverter
          userCurrency={trip.currency?.name}
          countriesVisiting={trip.countries.map((country) => country.id)}
          currencies={currencies}
          error={currencyFetchError}
          loading={currencyFetchLoading}
        />
      ),
    },
    {
      icon: <IoMapOutline stroke="var(--color-primary)" size={20} />,
      tooltipText: "View map",
      onClick: () => null,
    },
  ];
  return (
    <div className="space-x-2 mt-4 w-full flex items-center justify-end">
      {headerIcons.map((icon, index) => (
        <HeaderIconButton
          key={index}
          onClick={icon.onClick}
          tooltipText={icon.tooltipText}
          popoverComponent={icon.popoverComponent}
        >
          {icon.icon}
        </HeaderIconButton>
      ))}
    </div>
  );
};

interface HeaderIconButtonProps {
  tooltipText: string;
  onClick: () => void;
  popoverComponent?: React.ReactNode;
}

const HeaderIconButton: React.FC<PropsWithChildren<HeaderIconButtonProps>> = ({
  children,
  tooltipText,
  onClick,
  popoverComponent,
}) => {
  if (!popoverComponent) {
    return (
      <SimpleTooltip content={tooltipText} marginTop="mt-2" theme="dark">
        <button
          onClick={onClick}
          type="button"
          className="focus:outline-0 bg-secondary rounded-full p-2 hover:scale-105 cursor-pointer hover:opacity-95"
        >
          {children}
        </button>
      </SimpleTooltip>
    );
  }

  return (
    <PopoverMenu
      className="w-fit mt-1.5"
      panelClassName="mt-1.5 h-26"
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
      {popoverComponent}
    </PopoverMenu>
  );
};

export default HeaderIcons;
