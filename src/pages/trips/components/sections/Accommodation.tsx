import { Field, FieldArray, Form, Formik } from "formik";
import { orderBy } from "lodash";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { GoCopy } from "react-icons/go";
import { IoTrashBinOutline } from "react-icons/io5";
import { PiSealQuestionFill } from "react-icons/pi";
import { twMerge } from "tailwind-merge";
import { useAuth } from "../../../../hooks/useAuth";
import { FontFamily } from "../../../../types";
import { useSaveAccommodation } from "../../hooks/setters/useSaveAccommodation";
import Checkbox from "../Checkbox";
import LocationSearch, { LocationSearchResult } from "../LocationSearch";
import SimpleTooltip from "../SimpleTooltip";
import Table from "../Table";
import WarningConfirmationModal from "../WarningConfirmationModal";
import {
  getAccommodationLocalStorageKey,
  getSortArrowComponent,
} from "./helpers";
import { ErrorBox } from "../ErrorBox";

export interface AccommodationRow {
  id: string;
  name: string;
  totalPrice: number;
  checkIn: string;
  checkOut: string;
  pricePerNightPerPerson: number;
  mainPhotoName: string;
  formattedAddress: string;
  location: {
    name: string;
    latitude?: number;
    longitude?: number;
  };
  checked: boolean;
  createdAt: string;
}

enum SortOptions {
  ID = "id",
  NAME = "name",
  TOTAL_PRICE = "totalPrice",
  CHECK_IN = "checkIn",
  CHECK_OUT = "checkOut",
  PRICE_PER_NIGHT_PER_PERSON = "pricePerNightPerPerson",
  LOCATION = "location",
  CREATED_AT = "createdAt",
}

interface AccommodationProps {
  userCurrencySymbol?: string;
  userCurrencyCode?: string;
  numberOfPeople: number;
  startDate: string;
  endDate: string;
  tripId: string;
  accommodationRows: AccommodationRow[];
  error: string | null;
}

const Accommodation: React.FC<AccommodationProps> = ({
  userCurrencySymbol,
  userCurrencyCode,
  numberOfPeople,
  startDate,
  endDate,
  tripId,
  accommodationRows,
  error,
}) => {
  const { settings } = useAuth();
  const { deleteAccommodationRow, saveAccommodation } = useSaveAccommodation();
  const [deleteRow, setDeleteRow] = useState<AccommodationRow | null>(null);
  const finalSaveData = localStorage.getItem(
    getAccommodationLocalStorageKey(tripId)
  );

  const allRows: AccommodationRow[] = useMemo(
    () => (finalSaveData ? JSON.parse(finalSaveData).data : accommodationRows),
    [finalSaveData, accommodationRows]
  );

  const [sortOption, setSortOption] = useState<SortOptions>(
    SortOptions.CREATED_AT
  );
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [sortedAccommodationRows, setSortedAccommodationRows] = useState(
    orderBy(allRows, sortOption, sortDirection)
  );

  const defaultRow: AccommodationRow = {
    id: crypto.randomUUID(),
    name: "",
    totalPrice: 0,
    checkIn: `${startDate}T00:00`,
    checkOut: `${endDate}T00:00`,
    pricePerNightPerPerson: 0,
    mainPhotoName: "",
    formattedAddress: "",
    location: {
      name: "",
    },
    checked: false,
    createdAt: new Date().toISOString(),
  };

  const handleFormSubmit = (values: { data: AccommodationRow[] }) => {
    values.data.forEach((row) => {
      const { checkIn, checkOut } = row;
      const checkInDate = moment(checkIn);
      const checkOutDate = moment(checkOut);
      const nights = checkOutDate.diff(checkInDate, "days");
      const pricePerNightPerPerson = row.totalPrice / nights / numberOfPeople;
      row.pricePerNightPerPerson = pricePerNightPerPerson;
    });
    localStorage.setItem(
      getAccommodationLocalStorageKey(tripId),
      JSON.stringify(values)
    );
  };

  useEffect(() => {
    const newSortedRows = orderBy(allRows, sortOption, sortDirection);
    setSortedAccommodationRows([...newSortedRows]);
  }, [allRows, sortOption, sortDirection]);

  useEffect(() => {
    const interval = setInterval(async () => {
      const unsavedData = localStorage.getItem(
        getAccommodationLocalStorageKey(tripId)
      );
      if (unsavedData) {
        await saveAccommodation(tripId, JSON.parse(unsavedData).data);
      }
    }, 5 * 60 * 1000); // 10 * 60 * 1000

    return () => {
      clearInterval(interval);
    };
  }, [saveAccommodation, tripId]);

  const setSorting = (clickedOption: SortOptions) => {
    if (sortOption === clickedOption) {
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else if (sortDirection === "desc") {
        setSortDirection("asc");
        setSortOption(SortOptions.CREATED_AT);
      }
    } else {
      setSortDirection("asc");
      setSortOption(clickedOption);
    }
  };

  const getTableHeader = (
    selectedSortOption: SortOptions,
    headerTitle: string
  ) => {
    return (
      <button
        type="button"
        className="cursor-pointer w-full items-center flex justify-between"
        onClick={() => setSorting(selectedSortOption)}
      >
        <span>{headerTitle}</span>
        <div
          className={twMerge(
            sortOption === selectedSortOption ? "visible" : "invisible",
            settings?.font === FontFamily.HANDWRITTEN ? "mt-1.5 " : ""
          )}
        >
          {getSortArrowComponent(sortDirection)}
        </div>
      </button>
    );
  };

  return (
    <div className="text-secondary">
      <div className="flex items-center space-x-3">
        <h1 className="text-3xl">accommodation</h1>
        <SimpleTooltip
          content="Find your accommodation by searching for a specific place or a general term like 'hotel in Tokyo'. Tick the checkboxes to include them in your estimated total cost."
          theme="dark"
          side="top"
          width="w-50"
        >
          <PiSealQuestionFill
            size={20}
            className={twMerge(
              "opacity-50 cursor-pointer",
              settings?.font === FontFamily.HANDWRITTEN ? "mt-2.5" : ""
            )}
          />
        </SimpleTooltip>
      </div>
      {error ? (
        <ErrorBox />
      ) : (
        <Formik
          initialValues={{
            data: sortedAccommodationRows.length
              ? sortedAccommodationRows
              : ([] as AccommodationRow[]),
          }}
          enableReinitialize={true}
          onSubmit={async (values) => {
            handleFormSubmit(values);
          }}
          component={({ values, setFieldValue, submitForm }) => {
            return (
              <Form className="mt-2" onChange={submitForm}>
                <FieldArray
                  name="data"
                  render={(arrayHelpers) => {
                    return (
                      <div>
                        <div className="mb-4">
                          <LocationSearch
                            userCurrency={userCurrencyCode}
                            onSelectLocation={(
                              location: LocationSearchResult
                            ) => {
                              if (!location) return;
                              console.log(location);

                              const newRow: AccommodationRow = {
                                ...defaultRow,
                                id: crypto.randomUUID(),
                                name: location?.displayName?.text || "",
                                formattedAddress:
                                  location?.formattedAddress || "",
                                location: {
                                  name:
                                    location?.addressComponents?.find(
                                      (address) =>
                                        address.types?.includes("locality")
                                    )?.shortText || "",
                                  latitude: location?.location?.latitude,
                                  longitude: location?.location?.longitude,
                                },
                                mainPhotoName:
                                  location?.photos?.[0]?.name || "",
                                createdAt: new Date().toISOString(),
                              };
                              arrayHelpers.push(newRow);
                              submitForm();
                            }}
                          />
                        </div>
                        <Table>
                          <Table.Header>
                            <Table.Row>
                              <Table.HeaderCell
                                className={
                                  values.data.length ? "" : "border-b-0"
                                }
                              >
                                <div className="flex items-center space-x-4 w-72">
                                  <Checkbox
                                    checked={values.data.every(
                                      (row) => row.checked
                                    )}
                                    onClick={() => {
                                      const allChecked = values.data.every(
                                        (row) => row.checked
                                      );
                                      values.data.forEach((_, index) => {
                                        setFieldValue(
                                          `data.${index}.checked`,
                                          !allChecked
                                        );
                                      });
                                      submitForm();
                                    }}
                                  />
                                  {getTableHeader(SortOptions.NAME, "name")}
                                </div>
                              </Table.HeaderCell>
                              <Table.HeaderCell
                                className={twMerge(
                                  "w-40",
                                  values.data.length ? "" : "border-b-0"
                                )}
                              >
                                {getTableHeader(
                                  SortOptions.TOTAL_PRICE,
                                  "total price"
                                )}
                              </Table.HeaderCell>
                              <Table.HeaderCell
                                className={twMerge(
                                  "w-60",
                                  values.data.length ? "" : "border-b-0"
                                )}
                              >
                                {getTableHeader(
                                  SortOptions.CHECK_IN,
                                  "check-in"
                                )}
                              </Table.HeaderCell>
                              <Table.HeaderCell
                                className={twMerge(
                                  "w-60",
                                  values.data.length ? "" : "border-b-0"
                                )}
                              >
                                {getTableHeader(
                                  SortOptions.CHECK_OUT,
                                  "check-out"
                                )}
                              </Table.HeaderCell>
                              <Table.HeaderCell
                                className={twMerge(
                                  "w-50",
                                  values.data.length ? "" : "border-b-0"
                                )}
                              >
                                {getTableHeader(
                                  SortOptions.PRICE_PER_NIGHT_PER_PERSON,
                                  "price / night / person"
                                )}
                              </Table.HeaderCell>
                              <Table.HeaderCell
                                className={twMerge(
                                  "w-40",
                                  values.data.length ? "" : "border-b-0"
                                )}
                              >
                                {getTableHeader(
                                  SortOptions.LOCATION,
                                  "location"
                                )}
                              </Table.HeaderCell>
                              <Table.HeaderCell
                                className={twMerge(
                                  "w-30",
                                  values.data.length ? "" : "border-b-0"
                                )}
                              />
                            </Table.Row>
                          </Table.Header>
                          <Table.Body>
                            {values.data.map((row, index) => {
                              return (
                                <Table.Row key={index} className="group">
                                  <Table.Cell
                                    className={twMerge(
                                      "group-last:border-b-0 group-last:rounded-bl-xl",
                                      row.checked
                                        ? "bg-blue-munsell/20 transition ease-in-out duration-200"
                                        : "bg-transparent transition ease-in-out duration-200"
                                    )}
                                  >
                                    <div className="flex items-center space-x-4">
                                      <span>
                                        <Checkbox
                                          checked={row.checked}
                                          onClick={() => {
                                            setFieldValue(
                                              `data.${index}.checked`,
                                              !row.checked
                                            );
                                            submitForm();
                                          }}
                                        />
                                      </span>
                                      <span className="w-full">
                                        <Field
                                          type="text"
                                          className="focus:outline-0 w-full"
                                          name={`data.${index}.name`}
                                        />
                                      </span>
                                    </div>
                                  </Table.Cell>
                                  <Table.Cell
                                    className={twMerge(
                                      "group-last:border-b-0",
                                      row.checked
                                        ? "bg-blue-munsell/20 transition ease-in-out duration-200"
                                        : "bg-transparent transition ease-in-out duration-200"
                                    )}
                                  >
                                    <div className="flex w-full">
                                      {userCurrencySymbol && (
                                        <p className="text-nowrap w-fit">
                                          {userCurrencySymbol}
                                        </p>
                                      )}
                                      <Field
                                        type="number"
                                        className="focus:outline-0 ml-2 w-full"
                                        name={`data.${index}.totalPrice`}
                                      />
                                    </div>
                                  </Table.Cell>
                                  <Table.Cell
                                    className={twMerge(
                                      "group-last:border-b-0",
                                      row.checked
                                        ? "bg-blue-munsell/20 transition ease-in-out duration-200"
                                        : "bg-transparent transition ease-in-out duration-200"
                                    )}
                                  >
                                    <Field
                                      type="datetime-local"
                                      className="focus:outline-0 w-full"
                                      name={`data.${index}.checkIn`}
                                    />
                                  </Table.Cell>
                                  <Table.Cell
                                    className={twMerge(
                                      "group-last:border-b-0",
                                      row.checked
                                        ? "bg-blue-munsell/20 transition ease-in-out duration-200"
                                        : "bg-transparent transition ease-in-out duration-200"
                                    )}
                                  >
                                    <Field
                                      type="datetime-local"
                                      className="focus:outline-0 w-full"
                                      name={`data.${index}.checkOut`}
                                    />
                                  </Table.Cell>
                                  <Table.Cell
                                    className={twMerge(
                                      "group-last:border-b-0",
                                      row.checked
                                        ? "bg-blue-munsell/20 transition ease-in-out duration-200"
                                        : "bg-transparent transition ease-in-out duration-200"
                                    )}
                                  >
                                    <div className="flex w-full">
                                      {userCurrencySymbol && (
                                        <p className="text-nowrap w-fit">
                                          {userCurrencySymbol}
                                        </p>
                                      )}
                                      <Field
                                        type="number"
                                        className="focus:outline-0 ml-2 w-full"
                                        name={`data.${index}.pricePerNightPerPerson`}
                                      />
                                    </div>
                                  </Table.Cell>
                                  <Table.Cell
                                    className={twMerge(
                                      "group-last:border-b-0",
                                      row.checked
                                        ? "bg-blue-munsell/20 transition ease-in-out duration-200"
                                        : "bg-transparent transition ease-in-out duration-200"
                                    )}
                                  >
                                    <Field
                                      type="text"
                                      className="focus:outline-0 w-full"
                                      name={`data.${index}.location.name`}
                                    />
                                  </Table.Cell>
                                  <Table.Cell
                                    className={twMerge(
                                      "group-last:border-b-0 group-last:rounded-br-xl",
                                      row.checked
                                        ? "bg-blue-munsell/20 transition ease-in-out duration-200"
                                        : "bg-transparent transition ease-in-out duration-200"
                                    )}
                                  >
                                    <div className="space-x-3 flex items-center justify-center">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const newRow = {
                                            ...row,
                                            id: crypto.randomUUID(),
                                            createdAt: new Date().toISOString(),
                                          };
                                          arrayHelpers.push(newRow);
                                          submitForm();
                                        }}
                                        className="cursor-pointer hover:opacity-60 transition ease-in-out duration-300"
                                      >
                                        <GoCopy
                                          stroke="var(--color-secondary)"
                                          size={20}
                                        />
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setDeleteRow(row);
                                        }}
                                        className="cursor-pointer hover:opacity-60 transition ease-in-out duration-300 disabled:cursor-default disabled:opacity-50"
                                      >
                                        <IoTrashBinOutline
                                          stroke="var(--color-secondary)"
                                          size={20}
                                        />
                                      </button>
                                      <WarningConfirmationModal
                                        description="Once deleted, this row is gone forever. Are you sure you want to continue?"
                                        title={
                                          deleteRow?.name
                                            ? `Are you sure you want to delete "${deleteRow.name}"?`
                                            : `Are you sure you want to delete this row?`
                                        }
                                        isOpen={deleteRow?.id === row.id}
                                        onClose={() => setDeleteRow(null)}
                                        onConfirm={() => {
                                          if (!deleteRow) return;
                                          arrayHelpers.remove(index);
                                          submitForm();
                                          deleteAccommodationRow(
                                            tripId,
                                            deleteRow.id
                                          );
                                          setDeleteRow(null);
                                        }}
                                        lightOpacity={true}
                                      />
                                    </div>
                                  </Table.Cell>
                                </Table.Row>
                              );
                            })}
                          </Table.Body>
                        </Table>
                      </div>
                    );
                  }}
                />
              </Form>
            );
          }}
        />
      )}
    </div>
  );
};

export default Accommodation;
