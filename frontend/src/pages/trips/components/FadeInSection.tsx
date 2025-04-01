import { useInView } from "../hooks/useInView";

const FadeInSection = ({ children }: { children: React.ReactNode }) => {
  const { ref, isVisible } = useInView();

  return (
    <div
      ref={ref}
      className={`transition-opacity duration-1000 ease-in-out ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      {children}
    </div>
  );
};

export default FadeInSection;
