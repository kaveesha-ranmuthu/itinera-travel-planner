import { FieldArray, Form, Formik } from "formik";
import { useEffect, useMemo, useState } from "react";
import { PiSealQuestionFill } from "react-icons/pi";
import { twMerge } from "tailwind-merge";
import { useAuth } from "../../../../hooks/useAuth";
import { FontFamily } from "../../../../types";
import { useSaveFood } from "../../hooks/setters/useSaveFood";
import LocationSearch, { LocationSearchResult } from "../LocationSearch";
import LocationWithPhotoCard, {
  LocationCardDetails,
} from "../LocationWithPhotoCard";
import SimpleTooltip from "../SimpleTooltip";
import WarningConfirmationModal from "../WarningConfirmationModal";
import { useGetFood } from "../../hooks/getters/useGetFood";
import { Grid2 } from "@mui/material";
import { sortBy } from "lodash";
import { getFoodLocalStorageKey } from "./helpers";

interface FoodProps {
  userCurrencySymbol?: string;
  userCurrencyCode?: string;
  tripId: string;
}

const Food: React.FC<FoodProps> = ({
  userCurrencySymbol,
  userCurrencyCode,
  tripId,
}) => {
  const { settings } = useAuth();
  const { deleteFoodItem, saveFood } = useSaveFood();
  const { error, loading, foodItems } = useGetFood(tripId);
  const [itemToDelete, setItemToDelete] = useState<LocationCardDetails | null>(
    null
  );
  const finalSaveData = localStorage.getItem(getFoodLocalStorageKey(tripId));

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
  };

  useEffect(() => {
    const interval = setInterval(async () => {
      const unsavedData = localStorage.getItem(getFoodLocalStorageKey(tripId));
      if (unsavedData) {
        await saveFood(tripId, JSON.parse(unsavedData).data);
      }
    }, 5 * 60 * 1000); // 10 * 60 * 1000

    return () => {
      clearInterval(interval);
    };
  }, [saveFood, tripId]);

  // TODO: Make these look better
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error...</div>;
  }

  return (
    <div className="text-secondary">
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
      <Formik
        initialValues={{
          data: sortedRows.length ? sortedRows : ([] as LocationCardDetails[]),
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
                            const newItem: LocationCardDetails = {
                              id: crypto.randomUUID(),
                              name: location?.displayName?.text || "",
                              formattedAddress:
                                location?.formattedAddress || "",
                              location: {
                                latitude: location?.location?.latitude,
                                longitude: location?.location?.longitude,
                                name:
                                  location?.addressComponents?.find((address) =>
                                    address.types?.includes("locality")
                                  )?.shortText || "",
                              },
                              startPrice: location?.priceRange?.startPrice
                                ?.units
                                ? parseFloat(
                                    location?.priceRange?.startPrice?.units
                                  )
                                : undefined,
                              endPrice: location?.priceRange?.endPrice?.units
                                ? parseFloat(
                                    location?.priceRange?.endPrice?.units
                                  )
                                : undefined,
                              mainPhotoName: location?.photos?.[0]?.name || "",
                              websiteUri: location?.websiteUri,
                              createdAt: new Date().toISOString(),
                            };
                            arrayHelpers.push(newItem);
                            submitForm();
                          }}
                        />
                        <div className="mt-4">
                          <Grid2 container spacing={2.8}>
                            {values.data.map((foodPlace, index) => {
                              return (
                                <div key={`${foodPlace.id}-${index}`}>
                                  <Grid2>
                                    <LocationWithPhotoCard
                                      location={foodPlace}
                                      currencySymbol={userCurrencySymbol}
                                      onDelete={() => {
                                        setItemToDelete(foodPlace);
                                      }}
                                      locationFieldName={`data.${index}.location.name`}
                                    />
                                  </Grid2>
                                  <WarningConfirmationModal
                                    description="Once deleted, this is gone forever. Are you sure you want to continue?"
                                    title={`Are you sure you want to delete "${foodPlace.name}"?`}
                                    isOpen={itemToDelete?.id === foodPlace.id}
                                    onClose={() => setItemToDelete(null)}
                                    onConfirm={() => {
                                      if (!itemToDelete) return;
                                      arrayHelpers.remove(index);
                                      submitForm();
                                      deleteFoodItem(tripId, itemToDelete.id);
                                      setItemToDelete(null);
                                    }}
                                    lightOpacity={true}
                                  />
                                </div>
                              );
                            })}
                          </Grid2>
                        </div>
                      </div>
                    </div>
                  );
                }}
              />
            </Form>
          );
        }}
      />
    </div>
  );
};

export default Food;
