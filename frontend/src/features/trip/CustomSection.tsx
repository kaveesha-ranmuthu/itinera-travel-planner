import Grid from "@mui/material/Grid";
import { FieldArray, Form, FormikProvider, useFormik } from "formik";
import { round, sortBy } from "lodash";
import { Fragment, useEffect, useMemo, useState } from "react";
import { twMerge } from "tailwind-merge";
import { useAuth } from "../../hooks/useAuth";
import { useHotToast } from "../../hooks/useHotToast";
import { useSaving } from "../../hooks/useSaving";
import { useGetCustomSection } from "../../pages/trips/hooks/getters/useGetCustomSection";
import { LocationDetails } from "../../pages/trips/types";
import EstimatedCostContainer from "../../pages/trips/components/EstimatedCostContainer";
import {
  ErrorBox,
  LoadingBox,
  NoDataBox,
} from "../../pages/trips/components/InfoBox";
import ListSettings from "../../pages/trips/components/ListSettings";
import LocationSearch, {
  LocationSearchResult,
} from "../../pages/trips/components/LocationSearch";
import {
  LocationListItem,
  LocationWithPhotoCard,
} from "../../pages/trips/components/LocationWithPhotoCard";
import WarningConfirmationModal from "../../components/WarningConfirmationModal";
import {
  addTripToLocalStorage,
  getCustomSectionLocalStorageKey,
  getEstimatedCost,
  getLocationDetails,
  getPhotoDownloadUrl,
  getPricesList,
  getUniqueLocations,
  getUnsavedSectionsStorageKey,
  isLocationIncluded,
  isPriceIncluded,
} from "../../pages/trips/components/sections/helpers";
import { useSaveCustomSection } from "../../pages/trips/hooks/setters/useSaveCustomSection";
import { useGetLatLng } from "../../pages/trips/hooks/getters/useGetLatLng";
import InfoTooltip from "../../components/InfoTooltip";
import { ViewDisplayOptions } from "../../types/types";

interface CustomSectionProps {
  userCurrencySymbol?: string;
  userCurrencyCode?: string;
  tripId: string;
  sectionName: string;
  onDelete: () => void;
  destinationCountry: string;
}

const CustomSection: React.FC<CustomSectionProps> = ({
  userCurrencySymbol,
  userCurrencyCode,
  tripId,
  sectionName,
  onDelete,
  destinationCountry,
}) => {
  const { settings } = useAuth();
  const { notify } = useHotToast();
  const { isSaving } = useSaving();
  const { items, error } = useGetCustomSection(tripId, sectionName);
  const { deleteCustomSection } = useSaveCustomSection();
  const { latLng, loading } = useGetLatLng(destinationCountry);

  const [itemToDelete, setItemToDelete] = useState<LocationDetails | null>(
    null
  );

  const customSectionStorageKey = getCustomSectionLocalStorageKey(
    tripId,
    sectionName
  );
  const finalSaveData = localStorage.getItem(customSectionStorageKey);
  const [selectedFilterLocations, setSelectedFilterLocations] = useState<
    string[]
  >([]);
  const [selectedFilterPrices, setSelectedFilterPrices] = useState<number[]>();

  const [view, setView] = useState<ViewDisplayOptions>(
    settings?.preferredDisplay || "gallery"
  );

  const allRows: LocationDetails[] = useMemo(
    () =>
      finalSaveData
        ? JSON.parse(finalSaveData).data
        : items.filter((item) => Object.keys(item).length),
    [finalSaveData, items]
  );

  const sortedRows = sortBy(allRows, "createdAt");

  const handleFormSubmit = (values: { data: LocationDetails[] }) => {
    localStorage.setItem(customSectionStorageKey, JSON.stringify(values));
    addTripToLocalStorage(tripId, sectionName);
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

  const handleDelete = () => {
    try {
      onDelete();
      deleteCustomSection(tripId, sectionName);
      localStorage.removeItem(customSectionStorageKey);

      const unsavedSections = localStorage.getItem(
        getUnsavedSectionsStorageKey(tripId)
      );
      if (unsavedSections) {
        const sections = JSON.parse(unsavedSections);
        const updatedSections = sections.filter(
          (section: string) => section !== sectionName
        );
        localStorage.setItem(
          getUnsavedSectionsStorageKey(tripId),
          JSON.stringify(updatedSections)
        );
      }
    } catch {
      notify(`Something went wrong. Please try again.`, "error");
    }
  };

  return (
    <div
      className={twMerge(
        "text-secondary",
        isSaving && "pointer-events-none opacity-50"
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <h1 className="text-3xl">{sectionName}</h1>
          <InfoTooltip content="Find places to eat by searching for a specific place or a general term like 'breakfast in Paris'." />
        </div>
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
          onDelete={handleDelete}
        />
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
                        <div className="flex items-center space-x-2">
                          <LocationSearch
                            userCurrency={userCurrencyCode}
                            latitude={latLng?.[0]}
                            longitude={latLng?.[1]}
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
                            {formik.values.data.map((place, index) => {
                              const isIncluded =
                                !place._deleted &&
                                isLocationIncluded(
                                  selectedFilterLocations,
                                  place.location.name
                                ) &&
                                isPriceIncluded(
                                  selectedFilterPrices,
                                  place.price
                                );

                              if (!isIncluded) {
                                return null;
                              }
                              return (
                                <Fragment key={`${place.id}-${index}`}>
                                  {view === "gallery" ? (
                                    <Grid>
                                      <LocationWithPhotoCard
                                        location={place}
                                        currencySymbol={userCurrencySymbol}
                                        onDelete={() => {
                                          setItemToDelete(place);
                                        }}
                                        locationFieldName={`data.${index}.location.name`}
                                        priceFieldName={`data.${index}.price`}
                                      />
                                    </Grid>
                                  ) : (
                                    <Grid size={6}>
                                      <LocationListItem
                                        location={place}
                                        currencySymbol={userCurrencySymbol}
                                        onDelete={() => {
                                          setItemToDelete(place);
                                        }}
                                        locationFieldName={`data.${index}.location.name`}
                                        priceFieldName={`data.${index}.price`}
                                      />
                                    </Grid>
                                  )}
                                  <WarningConfirmationModal
                                    description="Once deleted, this is gone forever. Are you sure you want to continue?"
                                    title={`Are you sure you want to delete "${place.name}"?`}
                                    isOpen={itemToDelete?.id === place.id}
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

export default CustomSection;
