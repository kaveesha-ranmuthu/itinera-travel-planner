import { Grid } from "@mui/material";
import { FieldArray, Form, FormikProvider, useFormik } from "formik";
import { round, sortBy } from "lodash";
import { Fragment, useEffect, useMemo, useState } from "react";
import { twMerge } from "tailwind-merge";
import WarningConfirmationModal from "../../components/WarningConfirmationModal";
import { useAuth } from "../../hooks/useAuth";
import { useHotToast } from "../../hooks/useHotToast";
import { useSaving } from "../../hooks/useSaving";
import { useGetLatLng } from "../../hooks/useGetLatLng";
import { LocationDetails } from "../../pages/trips/types";
import EstimatedCostContainer from "./EstimatedCostContainer";
import { ErrorBox, LoadingBox, NoDataBox } from "../../components/InfoBox";
import ListSettings from "./ListSettings";
import LocationSearch, {
  LocationSearchResult,
} from "../../components/LocationSearch";
import {
  LocationListItem,
  LocationWithPhotoCard,
} from "./LocationWithPhotoCard";
import {
  addTripToLocalStorage,
  getActivitiesLocalStorageKey,
  getEstimatedCost,
  getLocationDetails,
  getPhotoDownloadUrl,
  getPricesList,
  getUniqueLocations,
  isLocationIncluded,
  isPriceIncluded,
} from "./utils/helpers";
import InfoTooltip from "../../components/InfoTooltip";
import { ViewDisplayOptions } from "../../types/types";

interface ActivitiesProps {
  userCurrencySymbol?: string;
  userCurrencyCode?: string;
  tripId: string;
  error: string | null;
  activities: LocationDetails[];
  destinationCountry: string;
}

const Activities: React.FC<ActivitiesProps> = ({
  userCurrencySymbol,
  userCurrencyCode,
  tripId,
  error,
  activities,
  destinationCountry,
}) => {
  const { settings } = useAuth();
  const { notify } = useHotToast();
  const { isSaving } = useSaving();
  const { latLng, loading } = useGetLatLng(destinationCountry);

  const [itemToDelete, setItemToDelete] = useState<LocationDetails | null>(
    null
  );
  const finalSaveData = localStorage.getItem(
    getActivitiesLocalStorageKey(tripId)
  );

  const [selectedFilterLocations, setSelectedFilterLocations] = useState<
    string[]
  >([]);
  const [selectedFilterPrices, setSelectedFilterPrices] = useState<number[]>();

  const [view, setView] = useState<ViewDisplayOptions>(
    settings?.preferredDisplay || "gallery"
  );

  const allRows: LocationDetails[] = useMemo(
    () => (finalSaveData ? JSON.parse(finalSaveData).data : activities),
    [finalSaveData, activities]
  );

  const sortedRows = sortBy(allRows, "createdAt");

  const formik = useFormik<{ data: LocationDetails[] }>({
    initialValues: {
      data: sortedRows.length ? sortedRows : ([] as LocationDetails[]),
    },
    enableReinitialize: true,
    onSubmit: async (values) => {
      handleFormSubmit(values);
    },
  });

  const handleFormSubmit = (values: { data: LocationDetails[] }) => {
    localStorage.setItem(
      getActivitiesLocalStorageKey(tripId),
      JSON.stringify(values)
    );
    addTripToLocalStorage(tripId);
  };

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
      setSelectedFilterPrices(
        prices.length ? [0, Math.max(...prices)] : undefined
      );
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
          <h1 className="text-3xl">activities</h1>
          <InfoTooltip content="Find things to do by searching for a specific place or a general term like 'Sydney activities'." />
        </div>
        {!!formik.values.data.filter((row) => !row._deleted).length && (
          <ListSettings
            locations={locations}
            selectedLocations={selectedFilterLocations}
            handleLocationSelect={setSelectedFilterLocations}
            maxPrice={prices.length ? Math.max(...prices) : undefined}
            selectedPrices={selectedFilterPrices}
            handlePriceChange={setSelectedFilterPrices}
            userCurrencySymbol={userCurrencySymbol}
            onSelectView={setView}
            selectedListView={view}
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
                    <div className="mb-4">
                      <div className="flex items-center justify-between">
                        <LocationSearch
                          userCurrency={userCurrencyCode}
                          latitude={latLng?.[0]}
                          longitude={latLng?.[1]}
                          placeholder="e.g. Sydney activities, Disneyland"
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
                            {formik.values.data.map((activity, index) => {
                              const isIncluded =
                                !activity._deleted &&
                                isLocationIncluded(
                                  selectedFilterLocations,
                                  activity.location.name
                                ) &&
                                isPriceIncluded(
                                  selectedFilterPrices,
                                  activity.price
                                );

                              if (!isIncluded) {
                                return null;
                              }
                              return (
                                <Fragment key={`${activity.id}-${index}`}>
                                  {view === "gallery" ? (
                                    <Grid>
                                      <LocationWithPhotoCard
                                        location={activity}
                                        currencySymbol={userCurrencySymbol}
                                        onDelete={() => {
                                          setItemToDelete(activity);
                                        }}
                                        locationFieldName={`data.${index}.location.name`}
                                        priceFieldName={`data.${index}.price`}
                                      />
                                    </Grid>
                                  ) : (
                                    <Grid size={6}>
                                      <LocationListItem
                                        location={activity}
                                        currencySymbol={userCurrencySymbol}
                                        onDelete={() => {
                                          setItemToDelete(activity);
                                        }}
                                        locationFieldName={`data.${index}.location.name`}
                                        priceFieldName={`data.${index}.price`}
                                      />
                                    </Grid>
                                  )}
                                  <WarningConfirmationModal
                                    description="Once deleted, this is gone forever. Are you sure you want to continue?"
                                    title={`Are you sure you want to delete "${activity.name}"?`}
                                    isOpen={itemToDelete?.id === activity.id}
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

export default Activities;
