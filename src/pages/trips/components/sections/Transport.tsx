import { useState } from "react";
import SmallButton from "../SmallButton";
import Table from "../Table";

interface TransportProps {
  userCurrency?: string;
}

const Transport: React.FC<TransportProps> = ({ userCurrency }) => {
  const headers = [
    "name",
    "total price",
    "departure time",
    "arrival time",
    "from",
    "to",
    "",
  ];

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
        <Table headers={headers} data={data} checkedColor="bg-green" />
      </div>
    </div>
  );
};

export default Transport;
