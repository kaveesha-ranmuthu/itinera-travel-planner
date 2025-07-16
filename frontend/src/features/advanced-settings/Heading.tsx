interface HeadingProps {
  title: string;
}

export const Heading: React.FC<HeadingProps> = ({ title }) => {
  return (
    <>
      <h1 className="text-xl">{title}</h1>
      <hr className="opacity-20 mb-2 mt-1" />
    </>
  );
};
