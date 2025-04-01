import { twMerge } from "tailwind-merge";
import { useInView } from "../hooks/useInView";

const FadeInSection = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const { ref, isVisible } = useInView();

  return (
    <div
      ref={ref}
      className={twMerge(
        "transition-opacity duration-1000 ease-in-out",
        isVisible ? "opacity-100" : "opacity-0",
        className
      )}
    >
      {children}
    </div>
  );
};

export default FadeInSection;
