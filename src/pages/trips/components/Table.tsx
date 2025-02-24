import { twMerge } from "tailwind-merge";
import Checkbox from "./Checkbox";
import { useEffect, useState } from "react";
import { GoCopy } from "react-icons/go";
import { IoTrashBinOutline } from "react-icons/io5";

export type Data = {
  components: React.ReactNode[];
  checked: boolean;
};

interface TableProps {
  headers: string[];
  data: Data[];
  checkedColor: string;
}

const Table: React.FC<TableProps> = ({ checkedColor, headers, data }) => {
  const [allChecked, setAllChecked] = useState(false);

  useEffect(() => {
    const allChecked = data.every((row) => row.checked);
    setAllChecked(allChecked);
  }, [data]);

  return (
    <table className="text-secondary w-full border border-secondary rounded-2xl border-separate border-spacing-0 ">
      <thead className="font-normal">
        <tr>
          <td className="border-b border-r py-2 px-4">
            <div className="flex items-center space-x-4">
              <Checkbox checked={allChecked} />
              <span>{headers[0]}</span>
            </div>
          </td>
          {headers.slice(1).map((header, index) => (
            <td
              key={index}
              className="border-b pl-10 pr-4 border-r last:border-r-0 border-secondary py-2"
            >
              {header}
            </td>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => {
          return (
            <tr key={index} className="group">
              <td
                className={twMerge(
                  "group-last:border-b-0 border-b border-r py-2 px-4 group-last:rounded-bl-2xl",
                  row.checked ? checkedColor : ""
                )}
              >
                <div className="flex items-center space-x-4">
                  <span>
                    <Checkbox checked={row.checked} />
                  </span>
                  <span className="w-full">{row.components[0]}</span>
                </div>
              </td>
              {row.components.slice(1).map((component, index) => (
                <td
                  key={index}
                  className={twMerge(
                    "group-last:border-b-0 border-b pl-10 pr-4 border-r last:border-r-0 border-secondary py-2",
                    row.checked ? checkedColor : ""
                  )}
                >
                  {component}
                </td>
              ))}
              <td className="group-last:border-b-0 px-1 rounded-br-2xl border-b border-r last:border-r-0 border-secondary py-2">
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
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default Table;
