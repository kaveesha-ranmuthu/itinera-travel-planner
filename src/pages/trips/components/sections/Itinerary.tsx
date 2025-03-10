import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import Highlight from "@tiptap/extension-highlight";
import { BubbleMenu, EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { FieldArray, Form, Formik } from "formik";
import moment from "moment";
import React, { useEffect, useMemo } from "react";
import {
  BsListOl,
  BsListUl,
  BsTypeBold,
  BsTypeItalic,
  BsTypeStrikethrough,
} from "react-icons/bs";
import { PiSealQuestionFill } from "react-icons/pi";
import { twMerge } from "tailwind-merge";
import { useAuth } from "../../../../hooks/useAuth";
import { FontFamily } from "../../../../types";
import SimpleTooltip from "../SimpleTooltip";
import { useGetItinerary } from "../../hooks/getters/useGetItinerary";
import { useSaveItinerary } from "../../hooks/setters/useSaveItinerary";

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
}

const LOCAL_STORAGE_KEY = (tripId: string) => `unsaved-itinerary-${tripId}`;

const Itinerary: React.FC<ItineraryProps> = ({
  endDate,
  startDate,
  tripId,
}) => {
  const { settings } = useAuth();
  const { error, itinerary, loading } = useGetItinerary(tripId);
  const { saveItinerary } = useSaveItinerary();
  const finalSaveData = localStorage.getItem(LOCAL_STORAGE_KEY(tripId));

  const savedItinerary: ItineraryDetails[] = useMemo(
    () => (finalSaveData ? JSON.parse(finalSaveData).itinerary : itinerary),
    [finalSaveData, itinerary]
  );

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
    localStorage.setItem(LOCAL_STORAGE_KEY(tripId), JSON.stringify(values));
  };

  useEffect(() => {
    const interval = setInterval(async () => {
      const unsavedData = localStorage.getItem(LOCAL_STORAGE_KEY(tripId));
      if (unsavedData) {
        await saveItinerary(tripId, JSON.parse(unsavedData).itinerary);
      }
    }, 5 * 60 * 1000); // 10 * 60 * 1000

    return () => {
      clearInterval(interval);
    };
  }, [saveItinerary, tripId]);

  // TODO: Make these look better
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error...</div>;
  }

  return (
    <div className="text-secondary">
      <div className="flex items-center space-x-3 mb-5">
        <h1 className="text-3xl">itinerary</h1>
        <SimpleTooltip content="" theme="dark" side="top" width="w-50">
          <PiSealQuestionFill
            size={20}
            className={twMerge(
              "opacity-50 cursor-pointer",
              settings?.font === FontFamily.HANDWRITTEN ? "mt-2.5" : ""
            )}
          />
        </SimpleTooltip>
      </div>
      <Formik
        initialValues={{
          itinerary:
            savedItinerary && savedItinerary.length
              ? savedItinerary
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
                              setFieldValue(`itinerary[${index}].plans`, plans);
                              submitForm();
                            }}
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
    </div>
  );
};

interface ItineraryBoxProps extends ItineraryDetails {
  onPlansChange: (plans: string) => void;
}
const ItineraryBox: React.FC<ItineraryBoxProps> = ({
  date,
  dayNumber,
  plans,
  onPlansChange,
}) => {
  const { settings } = useAuth();
  const editor = useEditor({
    extensions: [StarterKit, Highlight.configure({ multicolor: true })],
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
    <div className="border border-secondary w-full rounded-2xl py-3 pl-4 pr-7 space-x-4 drop-shadow-(--drop-shadow-default)">
      <Disclosure>
        <DisclosureButton className="flex items-center space-x-4 cursor-pointer hover:opacity-70 transition ease-in-out duration-200">
          <div
            className={twMerge(
              "flex flex-col items-start",
              settings?.font === FontFamily.HANDWRITTEN ? "mb-1" : ""
            )}
          >
            <span className="text-xl">day {dayNumber}</span>
            <span className="text-sm opacity-70">
              {moment(date).format("MMM D, YYYY")}
            </span>
          </div>
        </DisclosureButton>
        <DisclosurePanel className="text-gray-500">
          {editor && (
            <>
              <BubbleMenu
                editor={editor}
                tippyOptions={{ duration: 100 }}
                className="bg-primary"
              >
                <div className="bubble-menu flex items-center">
                  <button
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    disabled={settings?.font === FontFamily.HANDWRITTEN}
                    className={twMerge(
                      "p-2 cursor-pointer hover:bg-primary-hover transition ease-in-out duration-200 disabled:cursor-default disabled:opacity-50 disabled:hover:bg-primary",
                      editor.isActive("bold") ? "is-active" : ""
                    )}
                  >
                    <BsTypeBold size={20} />
                  </button>
                  <button
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={twMerge(
                      "p-2 cursor-pointer hover:bg-primary-hover transition ease-in-out duration-200",
                      editor.isActive("italic") ? "is-active" : ""
                    )}
                  >
                    <BsTypeItalic size={20} />
                  </button>
                  <button
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    className={twMerge(
                      "p-2 cursor-pointer hover:bg-primary-hover transition ease-in-out duration-200",
                      editor.isActive("strike") ? "is-active" : ""
                    )}
                  >
                    <BsTypeStrikethrough size={20} />
                  </button>
                  <button
                    onClick={() =>
                      editor.chain().focus().toggleBulletList().run()
                    }
                    className={twMerge(
                      "p-2 cursor-pointer hover:bg-primary-hover transition ease-in-out duration-200",
                      editor.isActive("bulletList") ? "is-active" : ""
                    )}
                  >
                    <BsListUl size={20} />
                  </button>
                  <button
                    onClick={() =>
                      editor.chain().focus().toggleOrderedList().run()
                    }
                    className={twMerge(
                      "p-2 cursor-pointer hover:bg-primary-hover transition ease-in-out duration-200",
                      editor.isActive("orderedList") ? "is-active" : ""
                    )}
                  >
                    <BsListOl size={20} />
                  </button>
                </div>
              </BubbleMenu>
              <EditorContent
                editor={editor}
                className="mt-2 mb-3"
                onBlur={() => onPlansChange(editor.getHTML())}
              />
            </>
          )}
        </DisclosurePanel>
      </Disclosure>
    </div>
  );
};

export default Itinerary;
