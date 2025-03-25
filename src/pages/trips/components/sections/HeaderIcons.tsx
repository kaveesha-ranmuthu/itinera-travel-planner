import { useFormik } from "formik";
import React, { PropsWithChildren } from "react";
import { FiEdit } from "react-icons/fi";
import { GoTasklist } from "react-icons/go";
import { IoMapOutline } from "react-icons/io5";
import { PiMoneyWavy } from "react-icons/pi";
import { useGetCurrencies } from "../../hooks/getters/useGetCurrencies";
import { TripData } from "../../hooks/getters/useGetTrips";
import CurrencyConverter from "../CurrencyConverter";
import PopoverMenu from "../PopoverMenu";
import { SelectOption } from "../Select";
import SimpleTooltip from "../SimpleTooltip";
import Tasklist from "../Tasklist";
import { twMerge } from "tailwind-merge";
import useGetTrip from "../../hooks/getters/useGetTrip";
import { MdOutlineMenuBook } from "react-icons/md";
import PageNavigation from "../PageNavigation";
import { Link } from "react-router-dom";

type HeaderIcon = {
  icon: React.ReactNode;
  tooltipText: string;
  onClick: () => void;
  popoverComponent?: React.ReactNode;
  popoverHeight?: string;
  popoverWidth?: string;
};

type CurrencyForm = {
  baseAmount: number;
  otherAmount: number;
  selectedCurrency: SelectOption;
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

  const { updateTripDetails } = useGetTrip(trip.id);

  const userCurrency = trip.currency?.name;
  const countriesVisiting = trip.countries.map((country) => country.id);

  const currencyOptions: SelectOption[] = countriesVisiting
    .map((country) => currencies.find((curr) => curr.id === country))
    .filter(Boolean)
    .map((currency) => ({
      id: currency!.currencyCode,
      name: currency!.currencyCode,
    }))
    .filter((curr) => curr.name !== userCurrency);

  const formik = useFormik<CurrencyForm>({
    initialValues: {
      baseAmount: 0,
      otherAmount: 0,
      selectedCurrency: currencyOptions[0],
    },
    enableReinitialize: true,
    onSubmit: async () => {},
  });

  const { baseAmount, otherAmount, selectedCurrency } = formik.values;

  const headerIcons: HeaderIcon[] = [
    {
      icon: <MdOutlineMenuBook fill="var(--color-primary)" size={20} />,
      tooltipText: "Page navigation",
      onClick: () => null,
      popoverComponent: <PageNavigation subCollections={trip.subCollections} />,
      popoverHeight: "h-fit",
      popoverWidth: "w-fit",
    },
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
      popoverComponent: (
        <Tasklist
          savedTaskList={trip.taskList}
          onSubmit={async (tasklist: string) =>
            await updateTripDetails({ ...trip, taskList: tasklist })
          }
          tripId={trip.id}
        />
      ),
      popoverHeight: "h-60",
      popoverWidth: "w-60",
    },
    {
      icon: <PiMoneyWavy fill="var(--color-primary)" size={20} />,
      tooltipText: "Currency converter",
      onClick: () => null,
      popoverHeight: "h-32",
      popoverComponent: currencyFetchLoading ? (
        <>Loading...</>
      ) : (
        <CurrencyConverter
          userCurrency={trip.currency?.name}
          error={currencyFetchError}
          baseAmount={baseAmount}
          currencyOptions={currencyOptions}
          selectedCurrencyCode={selectedCurrency}
          otherAmount={otherAmount}
          onBaseAmountChange={(amount) =>
            formik.setFieldValue("baseAmount", amount)
          }
          onOtherAmountChange={(amount) =>
            formik.setFieldValue("otherAmount", amount)
          }
          onCurrencyCodeChange={(currency) =>
            formik.setFieldValue("selectedCurrency", currency)
          }
        />
      ),
    },
    {
      icon: (
        <Link to={`/trip/${trip.id}/map`}>
          <IoMapOutline stroke="var(--color-primary)" size={20} />
        </Link>
      ),
      tooltipText: "View map",
      onClick: () => null,
    },
  ];
  return (
    <div className="space-x-2 mt-4 w-full flex items-center justify-end sticky top-2 z-10 bg-primary">
      {headerIcons.map((icon, index) => (
        <HeaderIconButton
          key={index}
          onClick={icon.onClick}
          tooltipText={icon.tooltipText}
          popoverComponent={icon.popoverComponent}
          popoverHeight={icon.popoverHeight}
          popoverWidth={icon.popoverWidth}
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
  popoverHeight?: string;
  popoverWidth?: string;
}

const HeaderIconButton: React.FC<PropsWithChildren<HeaderIconButtonProps>> = ({
  children,
  tooltipText,
  onClick,
  popoverComponent,
  popoverHeight,
  popoverWidth,
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
      panelClassName={twMerge(
        "mt-1.5",
        popoverHeight ? popoverHeight : "h-30",
        popoverWidth ? popoverWidth : ""
      )}
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
