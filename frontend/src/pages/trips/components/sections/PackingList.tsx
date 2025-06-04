import { PiSealQuestionFill } from "react-icons/pi";
import { twMerge } from "tailwind-merge";
import Button from "../../../../components/Button";
import { useAuth } from "../../../../hooks/useAuth";
import { FontFamily } from "../../../../types";
import SimpleTooltip from "../SimpleTooltip";
import {
  addTripToLocalStorage,
  getPackingListLocalStorageKey,
} from "./helpers";
import { EditorContent, useEditor } from "@tiptap/react";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import { useState } from "react";
import Document from "@tiptap/extension-document";
import Text from "@tiptap/extension-text";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Paragraph from "@tiptap/extension-paragraph";
import Strike from "@tiptap/extension-strike";
import EditorBubbleMenu from "../EditorBubbleMenu";
import Heading from "@tiptap/extension-heading";

interface PackingListProps {
  tripId: string;
  savedPackingList?: string;
}

const PackingList: React.FC<PackingListProps> = ({
  tripId,
  savedPackingList,
}) => {
  const { settings } = useAuth();
  const lastChanges = localStorage.getItem(
    getPackingListLocalStorageKey(tripId)
  );

  const editor = useEditor({
    extensions: [
      Document,
      Text,
      Paragraph,
      Bold,
      Italic,
      Strike,
      TaskList,
      TaskItem,
      Heading.configure({
        levels: [2, 3, 4],
      }),
    ],
    content:
      lastChanges ||
      savedPackingList ||
      `
      <h3>🧼 TOILETRIES</h3>
         <ul data-type="taskList">
        <li data-checked="false">
          <label contenteditable="false">
            <input type="checkbox" />
            <span></span>
          </label>
          <div>
            <p>toothbrush</p>
          </div>
        </li>
        <li data-checked="true">
          <label contenteditable="false">
            <input type="checkbox" />
            <span></span>
          </label>
          <div>
            <p>toothpaste</p>
          </div>
        </li>
        <li data-checked="false">
          <label contenteditable="false">
            <input type="checkbox" />
            <span></span>
          </label>
          <div>
            <p>shampoo</p>
          </div>
        </li>
        <li data-checked="false">
          <label contenteditable="false">
            <input type="checkbox" />
            <span></span>
          </label>
          <div>
            <p>conditioner</p>
          </div>
        </li>
      </ul>
        `,
    onUpdate: ({ editor }) => {
      localStorage.setItem(
        getPackingListLocalStorageKey(tripId),
        editor.getHTML()
      );
      addTripToLocalStorage(tripId);
    },
  });

  const [showEditor, setShowEditor] = useState(
    !!lastChanges || !!savedPackingList
  );

  return (
    <div>
      <div className="flex items-center space-x-3 mb-5">
        <h1 className="text-3xl">packing list</h1>
        <SimpleTooltip
          content="Create a packing list from scratch or quickly copy over your default list. You can set up your default list in settings."
          theme="dark"
          side="top"
          width="w-50"
        >
          <PiSealQuestionFill
            size={20}
            className={twMerge(
              "opacity-50 cursor-pointer",
              settings?.font === FontFamily.HANDWRITTEN ? "mt-2.5" : ""
            )}
          />
        </SimpleTooltip>
      </div>
      <div
        className={twMerge(
          "border border-secondary rounded-2xl p-4 space-y-4 ",
          !showEditor ? "text-center py-10" : "py-6"
        )}
      >
        {showEditor && editor ? (
          <>
            <EditorBubbleMenu
              editor={editor}
              actionsToShow={{
                heading1: true,
                heading2: true,
                heading3: true,
                taskList: true,
              }}
            />
            <EditorContent
              editor={editor}
              className={(twMerge("mt-2 mb-3"), settings?.font)}
            />
          </>
        ) : (
          <>
            <div>
              <Button.Secondary
                className={twMerge(
                  "normal-case not-italic w-2/3",
                  settings?.font
                )}
              >
                <span>Copy over default packing list</span>
              </Button.Secondary>
            </div>
            <div className="flex justify-center w-full">
              <div className="flex items-center space-x-4">
                <hr className="border-0 border-b border-secondary w-32" />
                <p className="font-brand tracking-wide italic">OR</p>
                <hr className="border-0 border-b border-secondary w-32" />
              </div>
            </div>
            <div>
              <Button.Primary
                className={twMerge(
                  "border border-secondary w-2/3 normal-case not-italic",
                  settings?.font
                )}
                onClick={() => setShowEditor(true)}
              >
                <span>Make a new list</span>
              </Button.Primary>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PackingList;
