import SmallButton from "../SmallButton";
import Table from "../Table";

const Transport = () => {
  return (
    <div className="text-secondary">
      <h1 className="text-3xl mb-2">transport</h1>
      <SmallButton onClick={() => null}>+ Add item</SmallButton>
      <div className="mt-5">
        <Table />
      </div>
    </div>
  );
};

export default Transport;
