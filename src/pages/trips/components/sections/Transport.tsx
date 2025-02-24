import { useState } from "react";
import SmallButton from "../SmallButton";
import Table from "../Table";
import Checkbox from "../Checkbox";
import { GoCopy } from "react-icons/go";
import { IoTrashBinOutline } from "react-icons/io5";

interface TransportProps {
  userCurrency?: string;
}

const Transport: React.FC<TransportProps> = ({ userCurrency }) => {
  const defaultComponent = {
    components: [
      <input type="text" className="focus:outline-0 w-full " />,
      <div className="flex w-full">
        {userCurrency && <p className="w-fit">{userCurrency}</p>}
        <input type="number" className="focus:outline-0 ml-2 w-full" />
      </div>,
      <input type="datetime-local" />,
      <input type="datetime-local" />,
      <input type="text" className="focus:outline-0 w-full " />,
      <input type="text" className="focus:outline-0 w-full " />,
    ],
    checked: false,
  };

  const [data, setData] = useState([defaultComponent]);

  return (
    <div className="text-secondary">
      <h1 className="text-3xl mb-2">transport</h1>
      <SmallButton onClick={() => setData([...data, defaultComponent])}>
        + Add item
      </SmallButton>
      <div className="mt-5">
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.Cell>
                <div className="flex items-center space-x-4 w-72">
                  <Checkbox checked={true} />
                  <span>name</span>
                </div>
              </Table.Cell>
              <Table.Cell className="w-50">total price</Table.Cell>
              <Table.Cell className="w-60">departure time</Table.Cell>
              <Table.Cell className="w-60">arrival time</Table.Cell>
              <Table.Cell className="w-50">from</Table.Cell>
              <Table.Cell className="w-50">to</Table.Cell>
              <Table.Cell className="w-30" />
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {data.map((row, index) => {
              return (
                <Table.Row key={index} className="group">
                  <Table.Cell className="group-last:border-b-0">
                    <div className="flex items-center space-x-4">
                      <span>
                        <Checkbox checked={row.checked} />
                      </span>
                      <span className="w-full">{row.components[0]}</span>
                    </div>
                  </Table.Cell>
                  {row.components.slice(1).map((component, index) => (
                    <Table.Cell key={index} className="group-last:border-b-0">
                      {component}
                    </Table.Cell>
                  ))}
                  <Table.Cell className="group-last:border-b-0">
                    <div className="text-center space-x-3">
                      <button className="cursor-pointer hover:opacity-60 transition ease-in-out duration-300">
                        <GoCopy stroke="var(--color-secondary)" size={20} />
                      </button>
                      <button className="cursor-pointer hover:opacity-60 transition ease-in-out duration-300">
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
    </div>
  );
};

export default Transport;
