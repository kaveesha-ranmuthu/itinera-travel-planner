import BackgroundWrapper from "../../../../shared/components/ui/BackgroundWrapper";
import Logo from "../../../../shared/components/ui/Logo";

export const LoadingPage = () => {
  return (
    <BackgroundWrapper>
      <div className="absolute bottom-5 left-0 flex items-center justify-center w-full h-full">
        <div className="text-center animate-pulse">
          <Logo marginLeft="ml-24" />
        </div>
      </div>
    </BackgroundWrapper>
  );
};
