import { PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";

const TableWrapper: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <table className="text-secondary w-full border border-secondary rounded-2xl border-separate border-spacing-0 ">
      {children}
    </table>
  );
};

const Header: React.FC<PropsWithChildren> = ({ children }) => {
  return <thead>{children}</thead>;
};

const Body: React.FC<PropsWithChildren> = ({ children }) => {
  return <tbody>{children}</tbody>;
};

const Row: React.FC<
  PropsWithChildren<React.HTMLAttributes<HTMLTableElement>>
> = ({ children, className }) => {
  return <tr className={className}>{children}</tr>;
};

const HeaderCell: React.FC<
  PropsWithChildren<React.HTMLAttributes<HTMLTableElement>>
> = ({ children, className }) => {
  return (
    <td
      className={twMerge(
        "border-b px-4 border-r last:border-r-0 border-secondary py-2",
        className
      )}
    >
      {children}
    </td>
  );
};

const Cell: React.FC<
  PropsWithChildren<React.HTMLAttributes<HTMLTableElement>>
> = ({ children, className }) => {
  return (
    <td
      className={twMerge(
        "px-4 border-r last:border-r-0 border-secondary py-2",
        className
      )}
    >
      {children}
    </td>
  );
};
interface TableComponent extends React.FC<PropsWithChildren> {
  Header: React.FC<PropsWithChildren>;
  Body: React.FC<PropsWithChildren>;
  Row: React.FC<PropsWithChildren<React.HTMLAttributes<HTMLTableElement>>>;
  Cell: React.FC<PropsWithChildren<React.HTMLAttributes<HTMLTableElement>>>;
  HeaderCell: React.FC<
    PropsWithChildren<React.HTMLAttributes<HTMLTableElement>>
  >;
}

const Table = TableWrapper as TableComponent;
Table.Header = Header;
Table.Body = Body;
Table.Row = Row;
Table.Cell = Cell;
Table.HeaderCell = HeaderCell;

export default Table;
