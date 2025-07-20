import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import Bold from "@tiptap/extension-bold";
import BulletList from "@tiptap/extension-bullet-list";
import Document from "@tiptap/extension-document";
import Heading from "@tiptap/extension-heading";
import Italic from "@tiptap/extension-italic";
import ListItem from "@tiptap/extension-list-item";
import OrderedList from "@tiptap/extension-ordered-list";
import Paragraph from "@tiptap/extension-paragraph";
import Strike from "@tiptap/extension-strike";
import Text from "@tiptap/extension-text";
import { EditorContent, useEditor } from "@tiptap/react";
import { FieldArray, Form, Formik } from "formik";
import { sortBy } from "lodash";
import moment from "moment";
import React, { useEffect, useMemo } from "react";
import { twMerge } from "tailwind-merge";
import EditorBubbleMenu from "./EditorBubbleMenu";
import InfoTooltip from "./InfoTooltip";
import { useAuth } from "../hooks/useAuth";
import { useSaving } from "../hooks/useSaving";
import { FontFamily } from "../types/types";
import {
  addTripToLocalStorage,
  getItineraryLocalStorageKey,
} from "../utils/helpers";
import { ErrorBox } from "./InfoBox";
import { UndoRedo } from "@tiptap/extensions";
export interface ItineraryDetails {
  id: string;
  dayNumber: number;
  date: string;
  plans: string;
}

interface ItineraryProps {
  startDate: string;
  endDate: string;
  tripId: string;
  showHeader?: boolean;
  error: string | null;
  itinerary: ItineraryDetails[];
}

const Itinerary: React.FC<ItineraryProps> = ({
  endDate,
  startDate,
  tripId,
  showHeader = true,
  error,
  itinerary,
}) => {
  const finalSaveData = localStorage.getItem(
    getItineraryLocalStorageKey(tripId)
  );

  const { isSaving } = useSaving();

  const savedItinerary: ItineraryDetails[] = useMemo(
    () => (finalSaveData ? JSON.parse(finalSaveData).itinerary : itinerary),
    [finalSaveData, itinerary]
  );
  const sortedItinerary = sortBy(savedItinerary, "dayNumber");

  const getDefaultItinerary = () => {
    const startDateMoment = moment(startDate);
    const endDateMoment = moment(endDate);
    const difference = endDateMoment.diff(startDateMoment, "days");
    const itinerary: ItineraryDetails[] = [];

    for (let i = 0; i <= difference; i++) {
      itinerary.push({
        id: crypto.randomUUID(),
        dayNumber: i + 1,
        date: moment(startDate).add(i, "days").format("YYYY-MM-DD"),
        plans: "<ul><li>Start typing...</li></ul>",
      });
    }
    return itinerary;
  };

  const handleFormSubmit = (values: { itinerary: ItineraryDetails[] }) => {
    localStorage.setItem(
      getItineraryLocalStorageKey(tripId),
      JSON.stringify(values)
    );
    addTripToLocalStorage(tripId);
  };

  return (
    <div
      className={twMerge(
        "text-secondary",
        isSaving && "pointer-events-none opacity-50"
      )}
    >
      {showHeader && (
        <div className="flex items-center space-x-3 mb-5">
          <h1 className="text-3xl">itinerary</h1>
          <InfoTooltip content="Select any day of your trip to customise your plan." />
        </div>
      )}
      {error ? (
        <ErrorBox />
      ) : (
        <Formik
          initialValues={{
            itinerary:
              sortedItinerary && sortedItinerary.length
                ? sortedItinerary
                : getDefaultItinerary(),
          }}
          onSubmit={async (values) => {
            handleFormSubmit(values);
          }}
          component={({ values, setFieldValue, submitForm }) => {
            return (
              <Form className="mt-2" onChange={submitForm}>
                <FieldArray
                  name="data"
                  render={() => {
                    return (
                      <div className="space-y-3">
                        {values.itinerary.map((itinerary, index) => {
                          return (
                            <ItineraryBox
                              key={itinerary.id}
                              id={itinerary.id}
                              date={itinerary.date}
                              dayNumber={itinerary.dayNumber}
                              plans={itinerary.plans}
                              onPlansChange={(plans: string) => {
                                setFieldValue(
                                  `itinerary[${index}].plans`,
                                  plans
                                );
                                submitForm();
                              }}
                              defaultOpen={true}
                            />
                          );
                        })}
                      </div>
                    );
                  }}
                />
              </Form>
            );
          }}
        />
      )}
    </div>
  );
};

interface ItineraryBoxProps extends ItineraryDetails {
  onPlansChange: (plans: string) => void;
  defaultOpen?: boolean;
}
const ItineraryBox: React.FC<ItineraryBoxProps> = ({
  date,
  dayNumber,
  plans,
  onPlansChange,
  defaultOpen = false,
}) => {
  const { settings } = useAuth();
  const editor = useEditor({
    extensions: [
      Document,
      Text,
      Paragraph,
      Bold,
      Italic,
      Strike,
      ListItem,
      BulletList.configure({
        HTMLAttributes: {
          class: "list-disc",
        },
      }),
      OrderedList.configure({
        HTMLAttributes: {
          class: "list-decimal",
        },
      }),
      Heading.configure({
        levels: [2, 3, 4],
      }),
      UndoRedo,
    ],
    content: plans,
  });

  useEffect(() => {
    if (editor) {
      editor.on("update", () => {
        onPlansChange(editor.getHTML());
      });
    }
  }, [editor, onPlansChange]);

  return (
    <Disclosure
      as="div"
      className="border border-secondary w-full rounded-2xl py-3 pl-4 pr-7 space-x-4"
      defaultOpen={defaultOpen}
    >
      <DisclosureButton className="flex items-center space-x-4 cursor-pointer hover:opacity-70 transition ease-in-out duration-200">
        <div
          className={twMerge(
            "flex flex-col items-start",
            settings?.font === FontFamily.HANDWRITTEN ? "mb-1" : ""
          )}
        >
          <span className="text-xl">day {dayNumber}</span>
          <span className="text-sm opacity-70">
            {moment(date).format("dddd - MMM D, YYYY")}
          </span>
        </div>
      </DisclosureButton>
      <DisclosurePanel>
        {editor && (
          <>
            <EditorBubbleMenu
              editor={editor}
              actionsToShow={{
                bold: true,
                italic: true,
                strike: true,
                heading1: true,
                heading2: true,
                heading3: true,
                bulletList: true,
                orderedList: true,
              }}
            />
            <div className="text-secondary/80">
              <EditorContent
                editor={editor}
                className="ml-5 mt-2 mb-3"
                onBlur={() => onPlansChange(editor.getHTML())}
              />
            </div>
          </>
        )}
      </DisclosurePanel>
    </Disclosure>
  );
};

export default Itinerary;
