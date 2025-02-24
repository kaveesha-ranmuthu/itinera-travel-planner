import { twMerge } from "tailwind-merge";
import Checkbox from "./Checkbox";
import { useEffect, useState } from "react";

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
          <td className="border-b border-r w-72 py-2 px-4">
            <div className="flex items-center space-x-4">
              <Checkbox checked={allChecked} />
              <span>{headers[0]}</span>
            </div>
          </td>
          {headers.slice(1).map((header, index) => (
            <td
              key={index}
              className="border-b pl-10 pr-4 w-72 border-r last:border-r-0 border-secondary py-2"
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
                  "group-last:border-b-0 border-b border-r w-86 py-2 px-4 group-last:rounded-bl-2xl",
                  row.checked ? checkedColor : ""
                )}
              >
                <div className="flex items-center space-x-4">
                  <Checkbox checked={row.checked} />
                  <span className="w-full">{row.components[0]}</span>
                </div>
              </td>
              {row.components.slice(1).map((component, index) => (
                <td
                  key={index}
                  className={twMerge(
                    "group-last:border-b-0 group-last:last:rounded-br-2xl border-b pl-10 pr-4 w-72 border-r last:border-r-0 border-secondary py-2",
                    row.checked ? checkedColor : ""
                  )}
                >
                  {component}
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default Table;
