import { Grid2 } from "@mui/material";
import { FieldArray, Form, Formik } from "formik";
import { sortBy } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { PiSealQuestionFill } from "react-icons/pi";
import { twMerge } from "tailwind-merge";
import { useAuth } from "../../../../hooks/useAuth";
import { FontFamily } from "../../../../types";
import { useSaveActivities } from "../../hooks/setters/useSaveActivities";
import LocationSearch, { LocationSearchResult } from "../LocationSearch";
import LocationWithPhotoCard, {
  LocationCardDetails,
} from "../LocationWithPhotoCard";
import SimpleTooltip from "../SimpleTooltip";
import WarningConfirmationModal from "../WarningConfirmationModal";
import { getActivitiesLocalStorageKey, getAveragePrice } from "./helpers";
import { ErrorBox, NoDataBox } from "../InfoBox";

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
  const { deleteActivity, saveActivities } = useSaveActivities();
  const [itemToDelete, setItemToDelete] = useState<LocationCardDetails | null>(
    null
  );
  const finalSaveData = localStorage.getItem(
    getActivitiesLocalStorageKey(tripId)
  );

  const allRows: LocationCardDetails[] = useMemo(
    () => (finalSaveData ? JSON.parse(finalSaveData).data : activities),
    [finalSaveData, activities]
  );

  const sortedRows = sortBy(allRows, "createdAt");

  const handleFormSubmit = (values: { data: LocationCardDetails[] }) => {
    localStorage.setItem(
      getActivitiesLocalStorageKey(tripId),
      JSON.stringify(values)
    );
  };

  useEffect(() => {
    const interval = setInterval(async () => {
      const unsavedData = localStorage.getItem(
        getActivitiesLocalStorageKey(tripId)
      );
      if (unsavedData) {
        await saveActivities(tripId, JSON.parse(unsavedData).data);
      }
    }, 5 * 60 * 1000); // 10 * 60 * 1000

    return () => {
      clearInterval(interval);
    };
  }, [saveActivities, tripId]);

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
        <Formik
          initialValues={{
            data: sortedRows.length
              ? sortedRows
              : ([] as LocationCardDetails[]),
          }}
          enableReinitialize={true}
          onSubmit={async (values) => {
            handleFormSubmit(values);
          }}
          component={({ values, submitForm }) => {
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
                              const startPrice = location?.priceRange
                                ?.startPrice?.units
                                ? parseFloat(
                                    location?.priceRange?.startPrice?.units
                                  )
                                : undefined;
                              const endPrice = location?.priceRange?.endPrice
                                ?.units
                                ? parseFloat(
                                    location?.priceRange?.endPrice?.units
                                  )
                                : undefined;

                              const newItem: LocationCardDetails = {
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
                                startPrice,
                                endPrice,
                                averagePrice: getAveragePrice(
                                  startPrice,
                                  endPrice
                                ),
                                mainPhotoName:
                                  location?.photos?.[0]?.name || "",
                                websiteUri: location?.websiteUri,
                                createdAt: new Date().toISOString(),
                              };
                              arrayHelpers.push(newItem);
                              submitForm();
                            }}
                          />
                          {!values.data.length ? (
                            <NoDataBox />
                          ) : (
                            <div className="mt-4">
                              <Grid2 container spacing={2.8}>
                                {values.data.map((activity, index) => {
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
                                        isOpen={
                                          itemToDelete?.id === activity.id
                                        }
                                        onClose={() => setItemToDelete(null)}
                                        onConfirm={() => {
                                          if (!itemToDelete) return;
                                          arrayHelpers.remove(index);
                                          submitForm();
                                          deleteActivity(
                                            tripId,
                                            itemToDelete.id
                                          );
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
            );
          }}
        />
      )}
    </div>
  );
};

export default Activities;
