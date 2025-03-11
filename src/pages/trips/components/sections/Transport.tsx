import { Field, FieldArray, Form, Formik } from "formik";
import { isEqual, orderBy } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { GoCopy } from "react-icons/go";
import { IoTrashBinOutline } from "react-icons/io5";
import { PiSealQuestionFill } from "react-icons/pi";
import { twMerge } from "tailwind-merge";
import { useAuth } from "../../../../hooks/useAuth";
import { FontFamily } from "../../../../types";
import { useGetTransport } from "../../hooks/getters/useGetTransport";
import { useSaveTransport } from "../../hooks/setters/useSaveTransport";
import Checkbox from "../Checkbox";
import SimpleTooltip from "../SimpleTooltip";
import SmallButton from "../SmallButton";
import Table from "../Table";
import WarningConfirmationModal from "../WarningConfirmationModal";
import { getSortArrowComponent } from "./helpers";

export interface TransportRow {
  id: string;
  name: string;
  totalPrice: number;
  departureTime: string;
  arrivalTime: string;
  from: string;
  to: string;
  checked: boolean;
  createdAt: string;
}

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
}

const LOCAL_STORAGE_KEY = (tripId: string) => `unsaved-transport-${tripId}`;

const Transport: React.FC<TransportProps> = ({
  userCurrency,
  startDate,
  endDate,
  tripId,
}) => {
  const { settings } = useAuth();
  const { saveTransport, deleteTransportRow } = useSaveTransport();
  const { error, loading, transportRows } = useGetTransport(tripId);
  const [deleteRow, setDeleteRow] = useState<TransportRow | null>(null);
  const finalSaveData = localStorage.getItem(LOCAL_STORAGE_KEY(tripId));

  const allRows: TransportRow[] = useMemo(
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

  const defaultRow: TransportRow = {
    id: crypto.randomUUID(),
    name: "",
    totalPrice: 0,
    departureTime: `${startDate}T00:00`,
    arrivalTime: `${endDate}T00:00`,
    from: "",
    to: "",
    checked: false,
    createdAt: new Date().toISOString(),
  };

  const handleFormSubmit = (values: { data: TransportRow[] }) => {
    localStorage.setItem(LOCAL_STORAGE_KEY(tripId), JSON.stringify(values));
  };

  useEffect(() => {
    const newSortedRows = orderBy(allRows, sortOption, sortDirection);
    setSortedTransportRows([...newSortedRows]);
  }, [allRows, sortOption, sortDirection]);

  useEffect(() => {
    const interval = setInterval(async () => {
      const unsavedData = localStorage.getItem(LOCAL_STORAGE_KEY(tripId));
      if (unsavedData) {
        await saveTransport(tripId, JSON.parse(unsavedData).data);
      }
    }, 5 * 60 * 1000); // 10 * 60 * 1000

    return () => {
      clearInterval(interval);
    };
  }, [saveTransport, tripId]);

  // TODO: Make these look better
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error...</div>;
  }

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

  return (
    <div className="text-secondary">
      <div className="flex items-center space-x-3">
        <h1 className="text-3xl">transport</h1>
        <SimpleTooltip
          content="Add your transport options and tick the checkboxes to see your estimated total cost."
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
          data: sortedTransportRows.length
            ? sortedTransportRows
            : [
                {
                  ...defaultRow,
                  id: crypto.randomUUID(),
                  createdAt: new Date().toISOString(),
                },
              ],
        }}
        enableReinitialize={true}
        onSubmit={async (values) => {
          handleFormSubmit(values);
        }}
        component={({ values, setFieldValue, submitForm }) => {
          return (
            <Form className="mt-2" onChange={submitForm}>
              <FieldArray
                name="data"
                render={(arrayHelpers) => (
                  <div>
                    <div className="mb-4">
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
                    </div>
                    <Table>
                      <Table.Header>
                        <Table.Row>
                          <Table.HeaderCell>
                            <div className="flex items-center space-x-4 w-72">
                              <Checkbox
                                checked={values.data.every(
                                  (row) => row.checked
                                )}
                                onClick={() => {
                                  const allChecked = values.data.every(
                                    (row) => row.checked
                                  );
                                  values.data.forEach((_, index) => {
                                    setFieldValue(
                                      `data.${index}.checked`,
                                      !allChecked
                                    );
                                  });
                                  submitForm();
                                }}
                              />
                              {getTableHeader(SortOptions.NAME, "name")}
                            </div>
                          </Table.HeaderCell>
                          <Table.HeaderCell className="w-50">
                            {getTableHeader(
                              SortOptions.TOTAL_PRICE,
                              "total price"
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
                        {values.data.map((row, index) => {
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
                                        setFieldValue(
                                          `data.${index}.checked`,
                                          !row.checked
                                        );
                                        submitForm();
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
                                    name={`data.${index}.totalPrice`}
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
                                  name={`data.${index}.departureTime`}
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
                                  name={`data.${index}.arrivalTime`}
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
                                  name={`data.${index}.from`}
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
                                  name={`data.${index}.to`}
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
                                      submitForm();
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
                                        { ...defaultRow, id: "", createdAt: "" }
                                      );
                                      if (isRowChanged) {
                                        setDeleteRow(row);
                                      } else {
                                        arrayHelpers.remove(index);
                                        deleteTransportRow(tripId, row.id);
                                        submitForm();
                                      }
                                    }}
                                    disabled={values.data.length === 1}
                                    className="cursor-pointer hover:opacity-60 transition ease-in-out duration-300 disabled:cursor-default disabled:opacity-50"
                                  >
                                    <IoTrashBinOutline
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
                                      if (!deleteRow) return;
                                      arrayHelpers.remove(index);
                                      submitForm();
                                      deleteTransportRow(tripId, deleteRow.id);
                                      setDeleteRow(null);
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
                  </div>
                )}
              />
            </Form>
          );
        }}
      />
    </div>
  );
};

export default Transport;
