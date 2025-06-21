import { sampleSize } from "lodash";
import { useRef } from "react";
import { iconColours, IconId } from "../../icon-map";
import { CustomSectionData } from "./useGetAllCustomSections";

export interface CustomSectionStyles {
  [key: string]: {
    id: IconId;
    backgroundColour: string;
    colour: string;
  };
}

export const useGetCustomSectionStyles = () => {
  const colourMapRef = useRef<CustomSectionStyles>({});

  const getCustomSectionStyles = (customSections: CustomSectionData) => {
    Object.keys(customSections).forEach((sectionName) => {
      if (!colourMapRef.current[sectionName]) {
        const backgroundColour = sampleSize(
          iconColours.map((c) => c.backgroundColour),
          1
        );
        const colourOptions = sampleSize(
          iconColours.map((c) => c.colour),
          2
        );
        const isBackgroundColourAndColourSame =
          colourOptions[0].substring(colourOptions[0].indexOf("-") + 1) ===
          backgroundColour[0].substring(backgroundColour[0].indexOf("-") + 1);

        const colour = isBackgroundColourAndColourSame
          ? colourOptions[1]
          : colourOptions[0];

        colourMapRef.current[sectionName] = {
          backgroundColour: backgroundColour[0],
          colour,
          id: "star",
        };
      }
    });

    return colourMapRef.current;
  };

  return {
    getCustomSectionStyles,
  };
};
