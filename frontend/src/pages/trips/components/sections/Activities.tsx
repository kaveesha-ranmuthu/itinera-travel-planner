import { Grid } from "@mui/material";
import { FieldArray, Form, FormikProvider, useFormik } from "formik";
import { round, sortBy } from "lodash";
import { Fragment, useEffect, useMemo, useState } from "react";
import { PiSealQuestionFill } from "react-icons/pi";
import { twMerge } from "tailwind-merge";
import { useAuth } from "../../../../hooks/useAuth";
import { FontFamily } from "../../../../types";
import { useSaveActivities } from "../../hooks/setters/useSaveActivities";
import EstimatedCostContainer from "../EstimatedCostContainer";
import { ErrorBox, NoDataBox } from "../InfoBox";
import LocationSearch, { LocationSearchResult } from "../LocationSearch";
import {
  LocationWithPhotoCard,
  LocationCardDetails,
  LocationListItem,
} from "../LocationWithPhotoCard";
import SimpleTooltip from "../SimpleTooltip";
import WarningConfirmationModal from "../WarningConfirmationModal";
import {
  addTripToLocalStorage,
  getActivitiesLocalStorageKey,
  getEstimatedFoodAndActivitiesCost,
  getLocationCardDetails,
  getPricesList,
  getUniqueLocations,
  isLocationIncluded,
  isPriceIncluded,
} from "./helpers";
import ListSettings from "../ListSettings";
import { DataView } from "../ViewSelector";
import { useHotToast } from "../../../../hooks/useHotToast";

interface ActivitiesProps {
  userCurrencySymbol?: string;
  userCurrencyCode?: string;
  tripId: string;
  error: string | null;
  activities: LocationCardDetails[];
}

const Activities: React.FC<ActivitiesProps> = ({
  userCurrencySymbol,
  userCurrencyCode,
  tripId,
  error,
  activities,
}) => {
  const { settings } = useAuth();
  const { deleteActivity } = useSaveActivities();
  const { notify } = useHotToast();
  const [itemToDelete, setItemToDelete] = useState<LocationCardDetails | null>(
    null
  );
  const finalSaveData = localStorage.getItem(
    getActivitiesLocalStorageKey(tripId)
  );

  const [selectedFilterLocations, setSelectedFilterLocations] = useState<
    string[]
  >([]);
  const [selectedFilterPrices, setSelectedFilterPrices] = useState<number[]>();

  const [view, setView] = useState<DataView>("gallery");

  const allRows: LocationCardDetails[] = useMemo(
    () => (finalSaveData ? JSON.parse(finalSaveData).data : activities),
    [finalSaveData, activities]
  );

  const sortedRows = sortBy(allRows, "createdAt");

  const formik = useFormik<{ data: LocationCardDetails[] }>({
    initialValues: {
      data: sortedRows.length ? sortedRows : ([] as LocationCardDetails[]),
    },
    enableReinitialize: true,
    onSubmit: async (values) => {
      handleFormSubmit(values);
    },
  });

  const handleFormSubmit = (values: { data: LocationCardDetails[] }) => {
    localStorage.setItem(
      getActivitiesLocalStorageKey(tripId),
      JSON.stringify(values)
    );
    addTripToLocalStorage(tripId);
  };

  const estimatedTotalCost = round(
    getEstimatedFoodAndActivitiesCost(formik.values.data),
    2
  );

  const locations = getUniqueLocations(formik.values.data);
  const prices = getPricesList(formik.values.data);

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
    <div className="text-secondary">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <h1 className="text-3xl">activities</h1>
          <SimpleTooltip
            content="Find things to do by searching for a specific place or a general term like 'Sydney activities'."
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
        {!!formik.values.data.length && (
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
                        <LocationSearch
                          userCurrency={userCurrencyCode}
                          placeholder="e.g. Sydney activities, Disneyland"
                          onSelectLocation={(
                            location: LocationSearchResult
                          ) => {
                            const locationIds = formik.values.data.map(
                              (location) => location.id
                            );
                            if (locationIds.includes(location.id)) {
                              notify(
                                "This location has already been added.",
                                "info"
                              );
                              return;
                            }
                            if (!location) return;
                            const newItem = getLocationCardDetails(location);
                            arrayHelpers.push(newItem);
                            formik.submitForm();
                          }}
                        />

                        <EstimatedCostContainer
                          estimatedTotalCost={estimatedTotalCost}
                          userCurrencySymbol={userCurrencySymbol}
                          backgroundColor="bg-secondary/20"
                        />
                      </div>
                      {!formik.values.data.length ? (
                        <NoDataBox />
                      ) : (
                        <div className="mt-4">
                          <Grid
                            container
                            spacing={view === "gallery" ? 2.8 : 2}
                          >
                            {formik.values.data.map((activity, index) => {
                              const isIncluded =
                                isLocationIncluded(
                                  selectedFilterLocations,
                                  activity.location.name
                                ) &&
                                isPriceIncluded(
                                  selectedFilterPrices,
                                  activity.averagePrice
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
                                        priceFieldName={`data.${index}.averagePrice`}
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
                                        priceFieldName={`data.${index}.averagePrice`}
                                      />
                                    </Grid>
                                  )}
                                  <WarningConfirmationModal
                                    description="Once deleted, this is gone forever. Are you sure you want to continue?"
                                    title={`Are you sure you want to delete "${activity.name}"?`}
                                    isOpen={itemToDelete?.id === activity.id}
                                    onClose={() => setItemToDelete(null)}
                                    onConfirm={() => {
                                      if (!itemToDelete) return;
                                      arrayHelpers.remove(index);
                                      formik.submitForm();
                                      deleteActivity(tripId, itemToDelete.id);
                                      setItemToDelete(null);
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
