import { Field, FieldArray, Form, FormikProvider, useFormik } from "formik";
import { orderBy, round } from "lodash";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { PiTrashSimple } from "react-icons/pi";
import { twMerge } from "tailwind-merge";
import { useAuth } from "../../hooks/useAuth";
import { useHotToast } from "../../hooks/useHotToast";
import Checkbox from "../../components/Checkbox";
import EstimatedCostContainer from "./EstimatedCostContainer";
import { ErrorBox, LoadingBox, NoDataBox } from "../../components/InfoBox";
import ListSettings from "./ListSettings";
import LocationSearch, {
  LocationSearchResult,
} from "../../components/LocationSearch";
import Table from "./Table";
import WarningConfirmationModal from "../../components/WarningConfirmationModal";
import {
  getEstimatedCost,
  getLocationDetails,
  getPhotoDownloadUrl,
  getPricesList,
  getSortArrowComponent,
  getUniqueLocations,
  isLocationIncluded,
  isPriceIncluded,
} from "./utils/helpers";
import { useSaving } from "../../hooks/useSaving";
import { useGetLatLng } from "../../hooks/useGetLatLng";
import { AccommodationDetails, FontFamily } from "../../types/types";
import InfoTooltip from "../../components/InfoTooltip";
import {
  getAccommodationLocalStorageKey,
  addTripToLocalStorage,
} from "../../utils/helpers";

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
  accommodationRows: AccommodationDetails[];
  error: string | null;
  destinationCountry: string;
}

const Accommodation: React.FC<AccommodationProps> = ({
  userCurrencySymbol,
  userCurrencyCode,
  numberOfPeople,
  startDate,
  endDate,
  tripId,
  destinationCountry,
  accommodationRows,
  error,
}) => {
  const { settings } = useAuth();
  const { notify } = useHotToast();
  const { latLng, loading } = useGetLatLng(destinationCountry);

  const [deleteRow, setDeleteRow] = useState<AccommodationDetails | null>(null);
  const finalSaveData = localStorage.getItem(
    getAccommodationLocalStorageKey(tripId)
  );
  const { isSaving } = useSaving();

  const allRows: AccommodationDetails[] = useMemo(
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

  const [selectedFilterLocations, setSelectedFilterLocations] = useState<
    string[]
  >([]);
  const [selectedFilterPrices, setSelectedFilterPrices] = useState<number[]>();

  const defaultRow: AccommodationDetails = {
    id: crypto.randomUUID(),
    name: "",
    price: 0,
    startTime: `${startDate}T00:00`,
    endTime: `${endDate}T00:00`,
    pricePerNightPerPerson: 0,
    photoUrl: null,
    formattedAddress: "",
    location: {
      name: "",
    },
    checked: false,
    createdAt: new Date().toISOString(),
  };

  const handleFormSubmit = (values: { data: AccommodationDetails[] }) => {
    values.data.forEach((row) => {
      const { startTime, endTime } = row;
      const checkInDate = moment(startTime);
      const checkOutDate = moment(endTime);
      const nights = checkOutDate.diff(checkInDate, "days");
      const pricePerNightPerPerson = (row.price ?? 0) / nights / numberOfPeople;
      row.pricePerNightPerPerson = round(pricePerNightPerPerson, 2);
    });
    localStorage.setItem(
      getAccommodationLocalStorageKey(tripId),
      JSON.stringify(values)
    );
    addTripToLocalStorage(tripId);
  };

  useEffect(() => {
    const newSortedRows = orderBy(allRows, sortOption, sortDirection);
    setSortedAccommodationRows([...newSortedRows]);
  }, [allRows, sortOption, sortDirection]);

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

  const formik = useFormik<{ data: AccommodationDetails[] }>({
    initialValues: {
      data: sortedAccommodationRows.length
        ? sortedAccommodationRows
        : ([] as AccommodationDetails[]),
    },
    enableReinitialize: true,
    onSubmit: async (values) => {
      handleFormSubmit(values);
    },
  });

  const estimatedTotalCost = round(
    getEstimatedCost(formik.values.data.filter((row) => !row._deleted)) /
      numberOfPeople,
    2
  );

  const locations = getUniqueLocations(
    formik.values.data.filter((row) => !row._deleted)
  );
  const prices = getPricesList(
    formik.values.data.filter((row) => !row._deleted)
  );

  useEffect(() => {
    if (
      selectedFilterLocations.some((location) => !locations.includes(location))
    ) {
      setSelectedFilterLocations((prev) =>
        prev.filter((location) => locations.includes(location))
      );
    }

    if (selectedFilterPrices && selectedFilterPrices[1] > Math.max(...prices)) {
      setSelectedFilterPrices([0, Math.max(...prices)]);
    }
  }, [locations, prices, selectedFilterLocations, selectedFilterPrices]);

  return (
    <div
      className={twMerge(
        "text-secondary",
        isSaving && "pointer-events-none opacity-50"
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <h1 className="text-3xl">accommodation</h1>
          <InfoTooltip content="Find your accommodation by searching for a specific place or a general term like 'hotel in Tokyo'. Tick the checkboxes to include them in your estimated total cost." />
        </div>
        {!!formik.values.data.filter((row) => !row._deleted).length && (
          <ListSettings
            locations={locations}
            selectedLocations={selectedFilterLocations}
            handleLocationSelect={setSelectedFilterLocations}
            maxPrice={Math.max(...prices) < 0 ? 0 : Math.max(...prices)}
            selectedPrices={selectedFilterPrices}
            handlePriceChange={setSelectedFilterPrices}
            userCurrencySymbol={userCurrencySymbol}
          />
        )}
      </div>
      {loading ? (
        <LoadingBox />
      ) : error ? (
        <ErrorBox />
      ) : (
        <FormikProvider value={formik}>
          <Form className="mt-2" onChange={formik.submitForm}>
            <FieldArray
              name="data"
              render={(arrayHelpers) => {
                return (
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="mb-4">
                        <LocationSearch
                          userCurrency={userCurrencyCode}
                          latitude={latLng?.[0]}
                          longitude={latLng?.[1]}
                          placeholder="e.g. hotel in Tokyo, ibis Osaka"
                          onSelectLocation={async (
                            location: LocationSearchResult
                          ) => {
                            const locationIds = formik.values.data
                              .filter((row) => !row._deleted)
                              .map((location) => location.googleId);
                            if (locationIds.includes(location.id)) {
                              notify(
                                "This location has already been added.",
                                "info"
                              );
                              return;
                            }
                            if (!location) return;
                            const newItem = getLocationDetails(location, null);
                            const index = formik.values.data.length;
                            arrayHelpers.push({ ...defaultRow, ...newItem });
                            const photoUrl = await getPhotoDownloadUrl(
                              location
                            );
                            await formik.setFieldValue(
                              `data.${index}.photoUrl`,
                              photoUrl
                            );
                            setTimeout(() => formik.submitForm(), 0);
                          }}
                        />
                      </div>
                      <EstimatedCostContainer
                        estimatedTotalCost={estimatedTotalCost}
                        userCurrencySymbol={userCurrencySymbol}
                        backgroundColor="bg-blue-munsell/20"
                      />
                    </div>
                    {!formik.values.data.filter((row) => !row._deleted)
                      .length ? (
                      <NoDataBox />
                    ) : (
                      <Table>
                        <Table.Header>
                          <Table.Row>
                            <Table.HeaderCell
                              className={
                                formik.values.data.filter(
                                  (row) => !row._deleted
                                ).length
                                  ? ""
                                  : "border-b-0"
                              }
                            >
                              <div className="flex items-center space-x-4 w-72">
                                <Checkbox
                                  checked={formik.values.data
                                    .filter((row) => !row._deleted)
                                    .every((row) => row.checked)}
                                  onClick={() => {
                                    const allChecked = formik.values.data
                                      .filter((row) => !row._deleted)
                                      .every((row) => row.checked);
                                    formik.values.data.forEach((_, index) => {
                                      formik.setFieldValue(
                                        `data.${index}.checked`,
                                        !allChecked
                                      );
                                    });
                                    formik.submitForm();
                                  }}
                                />
                                {getTableHeader(SortOptions.NAME, "name")}
                              </div>
                            </Table.HeaderCell>
                            <Table.HeaderCell
                              className={twMerge(
                                "w-40",
                                formik.values.data.filter(
                                  (row) => !row._deleted
                                ).length
                                  ? ""
                                  : "border-b-0"
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
                                formik.values.data.filter(
                                  (row) => !row._deleted
                                ).length
                                  ? ""
                                  : "border-b-0"
                              )}
                            >
                              {getTableHeader(SortOptions.CHECK_IN, "check-in")}
                            </Table.HeaderCell>
                            <Table.HeaderCell
                              className={twMerge(
                                "w-60",
                                formik.values.data.filter(
                                  (row) => !row._deleted
                                ).length
                                  ? ""
                                  : "border-b-0"
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
                                formik.values.data.filter(
                                  (row) => !row._deleted
                                ).length
                                  ? ""
                                  : "border-b-0"
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
                                formik.values.data.filter(
                                  (row) => !row._deleted
                                ).length
                                  ? ""
                                  : "border-b-0"
                              )}
                            >
                              {getTableHeader(SortOptions.LOCATION, "location")}
                            </Table.HeaderCell>
                            <Table.HeaderCell
                              className={twMerge(
                                "w-20",
                                formik.values.data.filter(
                                  (row) => !row._deleted
                                ).length
                                  ? ""
                                  : "border-b-0"
                              )}
                            />
                          </Table.Row>
                        </Table.Header>
                        <Table.Body>
                          {formik.values.data.map((row, index) => {
                            const isIncluded =
                              !row._deleted &&
                              isLocationIncluded(
                                selectedFilterLocations,
                                row.location.name
                              ) &&
                              isPriceIncluded(
                                selectedFilterPrices,
                                row.pricePerNightPerPerson
                              );

                            if (!isIncluded) {
                              return null;
                            }
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
                                          formik.setFieldValue(
                                            `data.${index}.checked`,
                                            !row.checked
                                          );
                                          formik.submitForm();
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
                                      name={`data.${index}.price`}
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
                                    name={`data.${index}.startTime`}
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
                                    name={`data.${index}.endTime`}
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
                                      readOnly
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
                                  <div className="flex items-center justify-center">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setDeleteRow(row);
                                      }}
                                      className="cursor-pointer hover:opacity-60 transition ease-in-out duration-300 disabled:cursor-default disabled:opacity-50"
                                    >
                                      <PiTrashSimple
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
                                        formik.setFieldValue(
                                          `data.${index}._deleted`,
                                          true
                                        );
                                        formik.submitForm();
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
                    )}
                  </div>
                );
              }}
            />
          </Form>
        </FormikProvider>
      )}
    </div>
  );
};

export default Accommodation;
