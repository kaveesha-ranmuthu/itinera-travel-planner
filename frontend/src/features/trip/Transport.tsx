import { Field, FieldArray, Form, FormikProvider, useFormik } from "formik";
import { isEqual, orderBy, round } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { GoCopy } from "react-icons/go";
import { PiTrashSimple } from "react-icons/pi";
import { twMerge } from "tailwind-merge";
import { useAuth } from "../../hooks/useAuth";
import { useSaving } from "../../hooks/useSaving";
import Checkbox from "../../components/Checkbox";
import EstimatedCostContainer from "./EstimatedCostContainer";
import { ErrorBox, NoDataBox } from "../../components/InfoBox";
import SmallButton from "../../components/SmallButton";
import Table from "./Table";
import WarningConfirmationModal from "../../components/WarningConfirmationModal";
import { getEstimatedCost, getSortArrowComponent } from "./utils/helpers";
import InfoTooltip from "../../components/InfoTooltip";
import { FontFamily, TransportationDetails } from "../../types/types";
import {
  getTransportLocalStorageKey,
  addTripToLocalStorage,
} from "../../utils/helpers";

enum SortOptions {
  ID = "id",
  NAME = "name",
  TOTAL_PRICE = "totalPrice",
  DEPARTURE_TIME = "departureTime",
  ARRIVAL_TIME = "arrivalTime",
  FROM = "from",
  TO = "to",
  CREATED_AT = "createdAt",
}

interface TransportProps {
  userCurrency?: string;
  startDate: string;
  endDate: string;
  tripId: string;
  transportRows: TransportationDetails[];
  error: string | null;
}

const Transport: React.FC<TransportProps> = ({
  userCurrency,
  startDate,
  endDate,
  tripId,
  error,
  transportRows,
}) => {
  const { settings } = useAuth();
  const { isSaving } = useSaving();
  const [deleteRow, setDeleteRow] = useState<TransportationDetails | null>(
    null
  );
  const finalSaveData = localStorage.getItem(
    getTransportLocalStorageKey(tripId)
  );

  const allRows: TransportationDetails[] = useMemo(
    () => (finalSaveData ? JSON.parse(finalSaveData).data : transportRows),
    [finalSaveData, transportRows]
  );

  const [sortOption, setSortOption] = useState<SortOptions>(
    SortOptions.CREATED_AT
  );
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [sortedTransportRows, setSortedTransportRows] = useState(
    orderBy(allRows, sortOption, sortDirection)
  );

  const defaultRow: TransportationDetails = {
    id: crypto.randomUUID(),
    name: "",
    price: 0,
    startTime: `${startDate}T00:00`,
    endTime: `${endDate}T00:00`,
    originCity: "",
    destinationCity: "",
    checked: false,
    createdAt: new Date().toISOString(),
  };

  const formik = useFormik<{ data: TransportationDetails[] }>({
    initialValues: {
      data: sortedTransportRows.length ? sortedTransportRows : [],
    },
    enableReinitialize: true,
    onSubmit: async (values) => {
      handleFormSubmit(values);
    },
  });

  const handleFormSubmit = (values: { data: TransportationDetails[] }) => {
    localStorage.setItem(
      getTransportLocalStorageKey(tripId),
      JSON.stringify(values)
    );
    addTripToLocalStorage(tripId);
  };

  useEffect(() => {
    const newSortedRows = orderBy(allRows, sortOption, sortDirection);
    setSortedTransportRows([...newSortedRows]);
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

  const estimatedTotalCost = round(
    getEstimatedCost(formik.values.data.filter((value) => !value._deleted)),
    2
  );

  return (
    <div
      className={twMerge(
        "text-secondary",
        isSaving && "pointer-events-none opacity-50"
      )}
    >
      <div className="flex items-center space-x-3">
        <h1 className="text-3xl">transport</h1>
        <InfoTooltip content="Add your transport options and tick the checkboxes to see your estimated total cost." />
      </div>
      {error ? (
        <ErrorBox />
      ) : (
        <FormikProvider value={formik}>
          <Form className="mt-2" onChange={formik.submitForm}>
            <FieldArray
              name="data"
              render={(arrayHelpers) => (
                <div>
                  <div className="mb-4 flex items-center justify-between">
                    <SmallButton
                      onClick={() => {
                        setSortDirection("asc");
                        setSortOption(SortOptions.CREATED_AT);
                        arrayHelpers.push({
                          ...defaultRow,
                          id: crypto.randomUUID(),
                          createdAt: new Date().toISOString(),
                        });
                      }}
                    >
                      + Add item
                    </SmallButton>
                    <EstimatedCostContainer
                      estimatedTotalCost={estimatedTotalCost}
                      userCurrencySymbol={userCurrency}
                      backgroundColor="bg-green/20"
                    />
                  </div>
                  {!formik.values.data.filter((value) => !value._deleted)
                    .length ? (
                    <NoDataBox subtitle="Start by adding an item." />
                  ) : (
                    <Table>
                      <Table.Header>
                        <Table.Row>
                          <Table.HeaderCell>
                            <div className="flex items-center space-x-4 w-72">
                              <Checkbox
                                checked={formik.values.data
                                  .filter((value) => !value._deleted)
                                  .every((row) => row.checked)}
                                onClick={() => {
                                  const allChecked = formik.values.data
                                    .filter((value) => !value._deleted)
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
                          <Table.HeaderCell className="w-50">
                            {getTableHeader(
                              SortOptions.TOTAL_PRICE,
                              "total price / person"
                            )}
                          </Table.HeaderCell>
                          <Table.HeaderCell className="w-60">
                            {getTableHeader(
                              SortOptions.DEPARTURE_TIME,
                              "departure time"
                            )}
                          </Table.HeaderCell>
                          <Table.HeaderCell className="w-60">
                            {getTableHeader(
                              SortOptions.ARRIVAL_TIME,
                              "arrival time"
                            )}
                          </Table.HeaderCell>
                          <Table.HeaderCell className="w-50">
                            {getTableHeader(SortOptions.FROM, "from")}
                          </Table.HeaderCell>
                          <Table.HeaderCell className="w-50">
                            {getTableHeader(SortOptions.TO, "to")}
                          </Table.HeaderCell>
                          <Table.HeaderCell className="w-30" />
                        </Table.Row>
                      </Table.Header>
                      <Table.Body>
                        {formik.values.data.map((row, index) => {
                          if (row._deleted) {
                            return null;
                          }
                          return (
                            <Table.Row key={index} className="group">
                              <Table.Cell
                                className={twMerge(
                                  "group-last:border-b-0 group-last:rounded-bl-xl",
                                  row.checked
                                    ? "bg-green/20 transition ease-in-out duration-200"
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
                                      className="focus:outline-0 w-full "
                                      name={`data.${index}.name`}
                                    />
                                  </span>
                                </div>
                              </Table.Cell>
                              <Table.Cell
                                className={twMerge(
                                  "group-last:border-b-0",
                                  row.checked
                                    ? "bg-green/20 transition ease-in-out duration-200"
                                    : "bg-transparent transition ease-in-out duration-200"
                                )}
                              >
                                <div className="flex w-full">
                                  {userCurrency && (
                                    <p className="text-nowrap w-fit">
                                      {userCurrency}
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
                                    ? "bg-green/20 transition ease-in-out duration-200"
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
                                    ? "bg-green/20 transition ease-in-out duration-200"
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
                                    ? "bg-green/20 transition ease-in-out duration-200"
                                    : "bg-transparent transition ease-in-out duration-200"
                                )}
                              >
                                <Field
                                  type="text"
                                  className="focus:outline-0 w-full"
                                  name={`data.${index}.originCity`}
                                />
                              </Table.Cell>
                              <Table.Cell
                                className={twMerge(
                                  "group-last:border-b-0",
                                  row.checked
                                    ? "bg-green/20 transition ease-in-out duration-200"
                                    : "bg-transparent transition ease-in-out duration-200"
                                )}
                              >
                                <Field
                                  type="text"
                                  className="focus:outline-0 w-full"
                                  name={`data.${index}.destinationCity`}
                                />
                              </Table.Cell>
                              <Table.Cell
                                className={twMerge(
                                  "group-last:border-b-0 group-last:rounded-br-xl",
                                  row.checked
                                    ? "bg-green/20 transition ease-in-out duration-200"
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
                                      formik.submitForm();
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
                                      const isRowChanged = !isEqual(
                                        { ...row, id: "", createdAt: "" },
                                        {
                                          ...defaultRow,
                                          id: "",
                                          createdAt: "",
                                        }
                                      );
                                      if (isRowChanged) {
                                        setDeleteRow(row);
                                      } else {
                                        formik.setFieldValue(
                                          `data.${index}._deleted`,
                                          true
                                        );
                                        formik.submitForm();
                                      }
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
              )}
            />
          </Form>
        </FormikProvider>
      )}
    </div>
  );
};

export default Transport;
