import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { FieldArray, Form, Formik } from "formik";
import moment from "moment";
import React from "react";
import { BsPlusLg } from "react-icons/bs";
import { PiSealQuestionFill } from "react-icons/pi";
import { twMerge } from "tailwind-merge";
import { useAuth } from "../../../../hooks/useAuth";
import { FontFamily } from "../../../../types";
import SimpleTooltip from "../SimpleTooltip";
import { EditorContent, useEditor, BubbleMenu } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Paragraph from "@tiptap/extension-paragraph";
import Document from "@tiptap/extension-document";
import Text from "@tiptap/extension-text";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";

interface ItineraryDetails {
  dayNumber: number;
  date: string;
  plans: string[];
}

interface ItineraryProps {
  startDate: string;
  endDate: string;
}

const Itinerary: React.FC<ItineraryProps> = ({ endDate, startDate }) => {
  const { settings } = useAuth();

  const getDefaultItinerary = () => {
    const startDateMoment = moment(startDate);
    const endDateMoment = moment(endDate);
    const difference = endDateMoment.diff(startDateMoment, "days");
    const itinerary: ItineraryDetails[] = [];

    for (let i = 0; i <= difference; i++) {
      itinerary.push({
        dayNumber: i + 1,
        date: moment(startDate).add(i, "days").format("YYYY-MM-DD"),
        plans: [""],
      });
    }
    return itinerary;
  };

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
          itinerary: getDefaultItinerary(),
        }}
        onSubmit={async (values) => {}}
        component={({ values }) => {
          console.log(values);

          return (
            <Form className="mt-2">
              <FieldArray
                name="data"
                render={(arrayHelpers) => {
                  return (
                    <div className="space-y-3">
                      {values.itinerary.map((itineray, index) => {
                        return (
                          <ItineraryBox
                            date={itineray.date}
                            dayNumber={itineray.dayNumber}
                            plans={itineray.plans}
                            plansFieldName={`itinerary.${index}.plans`}
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
  plansFieldName: string;
}
const ItineraryBox: React.FC<ItineraryBoxProps> = ({
  date,
  dayNumber,
  plans,
  plansFieldName,
}) => {
  const { settings } = useAuth();
  const editor = useEditor({
    extensions: [StarterKit, BulletList, ListItem],
    content: `
      <ul>
          <li>Start typing...</li>
        </ul>
    `,
  });

  return (
    <div className="border border-secondary w-full rounded-2xl py-3 px-4 space-x-4 drop-shadow-(--drop-shadow-default)">
      <Disclosure>
        <DisclosureButton className="flex items-center space-x-4 cursor-pointer">
          <BsPlusLg size={25} />
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
            <BubbleMenu
              editor={editor}
              tippyOptions={{ duration: 100 }}
              className="bg-primary"
            >
              <div className="bubble-menu">
                <button
                  onClick={() => editor.chain().focus().toggleBold().run()}
                  className={editor.isActive("bold") ? "is-active" : ""}
                >
                  Bold
                </button>
                <button
                  onClick={() => editor.chain().focus().toggleItalic().run()}
                  className={editor.isActive("italic") ? "is-active" : ""}
                >
                  Italic
                </button>
                <button
                  onClick={() => editor.chain().focus().toggleStrike().run()}
                  className={editor.isActive("strike") ? "is-active" : ""}
                >
                  Strike
                </button>
                <button
                  onClick={() =>
                    editor.chain().focus().toggleBulletList().run()
                  }
                  className={editor.isActive("bulletList") ? "is-active" : ""}
                >
                  Toggle bullet list
                </button>
              </div>
            </BubbleMenu>
          )}
          <EditorContent editor={editor} className="ml-10 mt-2 mb-3" />
        </DisclosurePanel>
      </Disclosure>
    </div>
  );
};

export default Itinerary;
