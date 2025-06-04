import Grid from "@mui/material/Grid";
import { FieldArray, Form, FormikProvider, useFormik } from "formik";
import { round, sortBy } from "lodash";
import { Fragment, useEffect, useMemo, useState } from "react";
import { PiSealQuestionFill } from "react-icons/pi";
import { twMerge } from "tailwind-merge";
import { useAuth } from "../../../../hooks/useAuth";
import { FontFamily } from "../../../../types";
import { useSaveFood } from "../../hooks/setters/useSaveFood";
import EstimatedCostContainer from "../EstimatedCostContainer";
import { ErrorBox, NoDataBox } from "../InfoBox";
import ListSettings from "../ListSettings";
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
  getEstimatedFoodAndActivitiesCost,
  getFoodLocalStorageKey,
  getLocationCardDetails,
  getPricesList,
  getUniqueLocations,
  isLocationIncluded,
  isPriceIncluded,
} from "./helpers";
import { ViewDisplayOptions } from "../ViewSelector";
import { useHotToast } from "../../../../hooks/useHotToast";

interface FoodProps {
  userCurrencySymbol?: string;
  userCurrencyCode?: string;
  tripId: string;
  foodItems: LocationCardDetails[];
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
  const { deleteFoodItem } = useSaveFood();
  const { notify } = useHotToast();

  const [itemToDelete, setItemToDelete] = useState<LocationCardDetails | null>(
    null
  );
  const finalSaveData = localStorage.getItem(getFoodLocalStorageKey(tripId));
  const [selectedFilterLocations, setSelectedFilterLocations] = useState<
    string[]
  >([]);
  const [selectedFilterPrices, setSelectedFilterPrices] = useState<number[]>();

  const [view, setView] = useState<ViewDisplayOptions>("gallery");

  const allRows: LocationCardDetails[] = useMemo(
    () => (finalSaveData ? JSON.parse(finalSaveData).data : foodItems),
    [finalSaveData, foodItems]
  );

  const sortedRows = sortBy(allRows, "createdAt");

  const handleFormSubmit = (values: { data: LocationCardDetails[] }) => {
    localStorage.setItem(
      getFoodLocalStorageKey(tripId),
      JSON.stringify(values)
    );
    addTripToLocalStorage(tripId);
  };

  const formik = useFormik<{ data: LocationCardDetails[] }>({
    initialValues: {
      data: sortedRows.length ? sortedRows : ([] as LocationCardDetails[]),
    },
    enableReinitialize: true,
    onSubmit: async (values) => {
      handleFormSubmit(values);
    },
  });

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
      setSelectedFilterPrices([0, Math.max(...prices)]);
    }
  }, [locations, prices, selectedFilterLocations, selectedFilterPrices]);

  return (
    <div className="text-secondary">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <h1 className="text-3xl">food</h1>
          <SimpleTooltip
            content="Find places to eat by searching for a specific place or a general term like 'breakfast in Paris'."
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
                          <Grid
                            container
                            spacing={view === "gallery" ? 2.8 : 2}
                          >
                            {formik.values.data.map((foodPlace, index) => {
                              const isIncluded =
                                isLocationIncluded(
                                  selectedFilterLocations,
                                  foodPlace.location.name
                                ) &&
                                isPriceIncluded(
                                  selectedFilterPrices,
                                  foodPlace.averagePrice
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
                                        priceFieldName={`data.${index}.averagePrice`}
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
                                        priceFieldName={`data.${index}.averagePrice`}
                                      />
                                    </Grid>
                                  )}
                                  <WarningConfirmationModal
                                    description="Once deleted, this is gone forever. Are you sure you want to continue?"
                                    title={`Are you sure you want to delete "${foodPlace.name}"?`}
                                    isOpen={itemToDelete?.id === foodPlace.id}
                                    onClose={() => setItemToDelete(null)}
                                    onConfirm={() => {
                                      if (!itemToDelete) return;
                                      arrayHelpers.remove(index);
                                      formik.submitForm();
                                      deleteFoodItem(tripId, itemToDelete.id);
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

export default Food;
