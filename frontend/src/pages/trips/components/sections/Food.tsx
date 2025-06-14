import Grid from "@mui/material/Grid";
import { FieldArray, Form, FormikProvider, useFormik } from "formik";
import { round, sortBy } from "lodash";
import { Fragment, useEffect, useMemo, useState } from "react";
import { twMerge } from "tailwind-merge";
import { useAuth } from "../../../../hooks/useAuth";
import { useHotToast } from "../../../../hooks/useHotToast";
import { useSaving } from "../../../../saving-provider/useSaving";
import { LocationDetails } from "../../types";
import EstimatedCostContainer from "../EstimatedCostContainer";
import { ErrorBox, NoDataBox } from "../InfoBox";
import InfoTooltip from "../InfoTooltip";
import ListSettings from "../ListSettings";
import LocationSearch, { LocationSearchResult } from "../LocationSearch";
import {
  LocationListItem,
  LocationWithPhotoCard,
} from "../LocationWithPhotoCard";
import { ViewDisplayOptions } from "../ViewSelector";
import WarningConfirmationModal from "../WarningConfirmationModal";
import {
  addTripToLocalStorage,
  getEstimatedCost,
  getFoodLocalStorageKey,
  getLocationDetails,
  getPhotoDownloadUrl,
  getPricesList,
  getUniqueLocations,
  isLocationIncluded,
  isPriceIncluded,
} from "./helpers";

interface FoodProps {
  userCurrencySymbol?: string;
  userCurrencyCode?: string;
  tripId: string;
  foodItems: LocationDetails[];
  error: string | null;
}

const Food: React.FC<FoodProps> = ({
  userCurrencySymbol,
  userCurrencyCode,
  tripId,
  error,
  foodItems,
}) => {
  const { settings } = useAuth();
  const { notify } = useHotToast();
  const { isSaving } = useSaving();

  const [itemToDelete, setItemToDelete] = useState<LocationDetails | null>(
    null
  );
  const finalSaveData = localStorage.getItem(getFoodLocalStorageKey(tripId));
  const [selectedFilterLocations, setSelectedFilterLocations] = useState<
    string[]
  >([]);
  const [selectedFilterPrices, setSelectedFilterPrices] = useState<number[]>();

  const [view, setView] = useState<ViewDisplayOptions>(
    settings?.preferredDisplay || "gallery"
  );

  const allRows: LocationDetails[] = useMemo(
    () => (finalSaveData ? JSON.parse(finalSaveData).data : foodItems),
    [finalSaveData, foodItems]
  );

  const sortedRows = sortBy(allRows, "createdAt");

  const handleFormSubmit = (values: { data: LocationDetails[] }) => {
    localStorage.setItem(
      getFoodLocalStorageKey(tripId),
      JSON.stringify(values)
    );
    addTripToLocalStorage(tripId);
  };

  const formik = useFormik<{ data: LocationDetails[] }>({
    initialValues: {
      data: sortedRows.length ? sortedRows : ([] as LocationDetails[]),
    },
    enableReinitialize: true,
    onSubmit: async (values) => {
      handleFormSubmit(values);
    },
  });

  const estimatedTotalCost = round(
    getEstimatedCost(formik.values.data.filter((row) => !row._deleted)),
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
          <h1 className="text-3xl">food</h1>
          <InfoTooltip content="Find places to eat by searching for a specific place or a general term like 'breakfast in Paris'." />
        </div>
        {!!formik.values.data.length && (
          <ListSettings
            locations={locations}
            selectedLocations={selectedFilterLocations}
            handleLocationSelect={setSelectedFilterLocations}
            maxPrice={Math.max(...prices)}
            selectedPrices={selectedFilterPrices}
            handlePriceChange={setSelectedFilterPrices}
            userCurrencySymbol={userCurrencySymbol}
            selectedListView={view}
            onSelectView={setView}
          />
        )}
      </div>
      {error ? (
        <ErrorBox />
      ) : (
        <FormikProvider value={formik}>
          <Form className="mt-2" onChange={formik.submitForm}>
            <FieldArray
              name="data"
              render={(arrayHelpers) => {
                return (
                  <div>
                    <div className="mb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <LocationSearch
                            userCurrency={userCurrencyCode}
                            placeholder="e.g. breakfast in Paris, Nobu LA"
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
                              const newItem = getLocationDetails(
                                location,
                                null
                              );
                              const index = formik.values.data.length;
                              arrayHelpers.push(newItem);
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
                          backgroundColor="bg-secondary/20"
                        />
                      </div>
                      {!formik.values.data.filter((row) => !row._deleted)
                        .length ? (
                        <NoDataBox />
                      ) : (
                        <div className="mt-4">
                          <Grid
                            container
                            spacing={view === "gallery" ? 2.8 : 2}
                          >
                            {formik.values.data.map((foodPlace, index) => {
                              const isIncluded =
                                !foodPlace._deleted &&
                                isLocationIncluded(
                                  selectedFilterLocations,
                                  foodPlace.location.name
                                ) &&
                                isPriceIncluded(
                                  selectedFilterPrices,
                                  foodPlace.price
                                );

                              if (!isIncluded) {
                                return null;
                              }
                              return (
                                <Fragment key={`${foodPlace.id}-${index}`}>
                                  {view === "gallery" ? (
                                    <Grid>
                                      <LocationWithPhotoCard
                                        location={foodPlace}
                                        currencySymbol={userCurrencySymbol}
                                        onDelete={() => {
                                          setItemToDelete(foodPlace);
                                        }}
                                        locationFieldName={`data.${index}.location.name`}
                                        priceFieldName={`data.${index}.price`}
                                      />
                                    </Grid>
                                  ) : (
                                    <Grid size={6}>
                                      <LocationListItem
                                        location={foodPlace}
                                        currencySymbol={userCurrencySymbol}
                                        onDelete={() => {
                                          setItemToDelete(foodPlace);
                                        }}
                                        locationFieldName={`data.${index}.location.name`}
                                        priceFieldName={`data.${index}.price`}
                                      />
                                    </Grid>
                                  )}
                                  <WarningConfirmationModal
                                    description="Once deleted, this is gone forever. Are you sure you want to continue?"
                                    title={`Are you sure you want to delete "${foodPlace.name}"?`}
                                    isOpen={itemToDelete?.id === foodPlace.id}
                                    onClose={() => setItemToDelete(null)}
                                    onConfirm={() => {
                                      formik.setFieldValue(
                                        `data.${index}._deleted`,
                                        true
                                      );
                                      formik.submitForm();
                                    }}
                                    lightOpacity={true}
                                  />
                                </Fragment>
                              );
                            })}
                          </Grid>
                        </div>
                      )}
                    </div>
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

export default Food;
