import { Field, FieldArray, Form, Formik } from "formik";
import { GoCopy } from "react-icons/go";
import { IoTrashBinOutline } from "react-icons/io5";
import Checkbox from "../Checkbox";
import SmallButton from "../SmallButton";
import Table from "../Table";
import { PiSealQuestionFill } from "react-icons/pi";
import { twMerge } from "tailwind-merge";
import { useAuth } from "../../../../hooks/useAuth";
import { FontFamily } from "../../../../types";
import SimpleTooltip from "../SimpleTooltip";
import { debounce } from "lodash";

type Data = {
  name: string;
  totalPrice: number;
  departureTime: string;
  arrivalTime: string;
  from: string;
  to: string;
  checked: boolean;
};

interface TransportProps {
  userCurrency?: string;
  startDate: string;
  endDate: string;
}

const LOCAL_STORAGE_KEY = "transportData";

const Transport: React.FC<TransportProps> = ({
  userCurrency,
  startDate,
  endDate,
}) => {
  const { settings } = useAuth();
  const defaultRow: Data = {
    name: "",
    totalPrice: 0,
    departureTime: `${startDate}T00:00`,
    arrivalTime: `${endDate}T00:00`,
    from: "",
    to: "",
    checked: false,
  };

  const handleFormSubmit = debounce((values: { data: Data[] }) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(values));
  }, 500);

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
          data: [defaultRow],
        }}
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
                        onClick={() => arrayHelpers.push(defaultRow)}
                      >
                        + Add item
                      </SmallButton>
                    </div>
                    <Table>
                      <Table.Header>
                        <Table.Row>
                          <Table.Cell>
                            <div className="flex items-center space-x-4 w-72">
                              <Checkbox
                                checked={values.data.every(
                                  (row) => row.checked
                                )}
                                onClick={() => {
                                  const allChecked = values.data.every(
                                    (row) => row.checked
                                  );
                                  values.data.forEach((index) => {
                                    setFieldValue(
                                      `data.${index}.checked`,
                                      !allChecked
                                    );
                                  });
                                }}
                              />
                              <span>name</span>
                            </div>
                          </Table.Cell>
                          <Table.Cell className="w-50">total price</Table.Cell>
                          <Table.Cell className="w-60">
                            departure time
                          </Table.Cell>
                          <Table.Cell className="w-60">arrival time</Table.Cell>
                          <Table.Cell className="w-50">from</Table.Cell>
                          <Table.Cell className="w-50">to</Table.Cell>
                          <Table.Cell className="w-30" />
                        </Table.Row>
                      </Table.Header>
                      <Table.Body>
                        {values.data.map((row, index) => {
                          return (
                            <Table.Row key={index} className="group">
                              <Table.Cell className="group-last:border-b-0">
                                <div className="flex items-center space-x-4">
                                  <span>
                                    <Checkbox
                                      checked={row.checked}
                                      onClick={() =>
                                        setFieldValue(
                                          `data.${index}.checked`,
                                          !row.checked
                                        )
                                      }
                                    />
                                  </span>
                                  <span className="w-full">
                                    <Field
                                      type="text"
                                      className="focus:outline-0 w-full "
                                      name={`data.${index}.name`}
                                      defaultValue={row.name}
                                    />
                                  </span>
                                </div>
                              </Table.Cell>
                              <Table.Cell className="group-last:border-b-0">
                                <div className="flex w-full">
                                  {userCurrency && (
                                    <p className="w-fit">{userCurrency}</p>
                                  )}
                                  <Field
                                    type="number"
                                    className="focus:outline-0 ml-2 w-full"
                                    name={`data.${index}.totalPrice`}
                                    defaultValue={row.totalPrice}
                                  />
                                </div>
                              </Table.Cell>
                              <Table.Cell className="group-last:border-b-0">
                                <Field
                                  type="datetime-local"
                                  className="focus:outline-0 w-full"
                                  name={`data.${index}.departureTime`}
                                  defaultValue={row.departureTime}
                                />
                              </Table.Cell>
                              <Table.Cell className="group-last:border-b-0">
                                <Field
                                  type="datetime-local"
                                  className="focus:outline-0 w-full"
                                  name={`data.${index}.arrivalTime`}
                                  defaultValue={row.arrivalTime}
                                />
                              </Table.Cell>
                              <Table.Cell className="group-last:border-b-0">
                                <Field
                                  type="text"
                                  className="focus:outline-0 w-full"
                                  name={`data.${index}.from`}
                                  defaultValue={row.from}
                                />
                              </Table.Cell>
                              <Table.Cell className="group-last:border-b-0">
                                <Field
                                  type="text"
                                  className="focus:outline-0 w-full"
                                  name={`data.${index}.to`}
                                  defaultValue={row.to}
                                />
                              </Table.Cell>
                              <Table.Cell className="group-last:border-b-0">
                                <div className="space-x-3 flex items-center justify-center">
                                  <button
                                    type="button"
                                    onClick={() => arrayHelpers.push(row)}
                                    className="cursor-pointer hover:opacity-60 transition ease-in-out duration-300"
                                  >
                                    <GoCopy
                                      stroke="var(--color-secondary)"
                                      size={20}
                                    />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => arrayHelpers.remove(index)}
                                    disabled={values.data.length === 1}
                                    className="cursor-pointer hover:opacity-60 transition ease-in-out duration-300 disabled:cursor-default disabled:opacity-50"
                                  >
                                    <IoTrashBinOutline
                                      stroke="var(--color-secondary)"
                                      size={20}
                                    />
                                  </button>
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
