import { Grid2 } from "@mui/material";
import { FieldArray, Form, FormikProvider, useFormik } from "formik";
import { round, sortBy } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { PiSealQuestionFill } from "react-icons/pi";
import { twMerge } from "tailwind-merge";
import { useAuth } from "../../../../hooks/useAuth";
import { FontFamily } from "../../../../types";
import { useSaveActivities } from "../../hooks/setters/useSaveActivities";
import EstimatedCostContainer from "../EstimatedCostContainer";
import { ErrorBox, NoDataBox } from "../InfoBox";
import LocationSearch, { LocationSearchResult } from "../LocationSearch";
import LocationWithPhotoCard, {
  LocationCardDetails,
} from "../LocationWithPhotoCard";
import SimpleTooltip from "../SimpleTooltip";
import WarningConfirmationModal from "../WarningConfirmationModal";
import {
  addTripToLocalStorage,
  getActivitiesLocalStorageKey,
  getAveragePrice,
  getEstimatedFoodAndActivitiesCost,
  getPricesList,
  getUniqueLocations,
  isLocationIncluded,
  isPriceIncluded,
} from "./helpers";
import ListSettings from "../ListSettings";

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

  const getLocationCardDetails = (
    location: LocationSearchResult
  ): LocationCardDetails => {
    const startPrice = location?.priceRange?.startPrice?.units
      ? parseFloat(location?.priceRange?.startPrice?.units)
      : undefined;
    const endPrice = location?.priceRange?.endPrice?.units
      ? parseFloat(location?.priceRange?.endPrice?.units)
      : undefined;

    return {
      id: crypto.randomUUID(),
      name: location?.displayName?.text || "",
      formattedAddress: location?.formattedAddress || "",
      location: {
        name:
          location?.addressComponents?.find((address) =>
            address.types?.includes("locality")
          )?.shortText || "",
        latitude: location?.location?.latitude,
        longitude: location?.location?.longitude,
      },
      startPrice,
      endPrice,
      averagePrice: getAveragePrice(startPrice, endPrice),
      mainPhotoName: location?.photos?.[0]?.name || "",
      websiteUri: location?.websiteUri,
      createdAt: new Date().toISOString(),
    };
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
                            placeholder="e.g. Sydney activities, Disneyland"
                            onSelectLocation={(
                              location: LocationSearchResult
                            ) => {
                              if (!location) return;
                              const newItem = getLocationCardDetails(location);
                              arrayHelpers.push(newItem);
                              formik.submitForm();
                            }}
                          />
                          {!!formik.values.data.length && (
                            <ListSettings
                              locations={locations}
                              selectedLocations={selectedFilterLocations}
                              handleLocationSelect={setSelectedFilterLocations}
                              maxPrice={
                                prices.length ? Math.max(...prices) : undefined
                              }
                              selectedPrices={selectedFilterPrices}
                              handlePriceChange={setSelectedFilterPrices}
                              userCurrencySymbol={userCurrencySymbol}
                            />
                          )}
                        </div>
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
                          <Grid2 container spacing={2.8}>
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
                                <div key={`${activity.id}-${index}`}>
                                  <Grid2>
                                    <LocationWithPhotoCard
                                      location={activity}
                                      currencySymbol={userCurrencySymbol}
                                      onDelete={() => {
                                        setItemToDelete(activity);
                                      }}
                                      locationFieldName={`data.${index}.location.name`}
                                      priceFieldName={`data.${index}.averagePrice`}
                                    />
                                  </Grid2>
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
                                </div>
                              );
                            })}
                          </Grid2>
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
