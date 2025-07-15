import Bold from "@tiptap/extension-bold";
import Document from "@tiptap/extension-document";
import Heading from "@tiptap/extension-heading";
import Italic from "@tiptap/extension-italic";
import Paragraph from "@tiptap/extension-paragraph";
import Strike from "@tiptap/extension-strike";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import Text from "@tiptap/extension-text";
import { EditorContent, useEditor } from "@tiptap/react";
import { useState } from "react";
import { twMerge } from "tailwind-merge";
import Button from "../../components/Button";
import { useAuth } from "../../hooks/useAuth";
import {
  addTripToLocalStorage,
  getPackingListLocalStorageKey,
} from "../../pages/trips/components/sections/helpers";
import { useSaving } from "../../hooks/useSaving";
import EditorBubbleMenu from "../../components/EditorBubbleMenu";
import InfoTooltip from "../../components/InfoTooltip";

interface PackingListProps {
  tripId: string;
  savedPackingList?: string;
}

const PackingList: React.FC<PackingListProps> = ({
  tripId,
  savedPackingList,
}) => {
  const { settings } = useAuth();
  const { isSaving } = useSaving();
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
    content: lastChanges || savedPackingList,
    onUpdate: ({ editor }) => {
      savePackingListToLocalStorage(editor.getHTML());
    },
  });

  const [showEditor, setShowEditor] = useState(
    !!lastChanges || !!savedPackingList
  );

  const savePackingListToLocalStorage = (content: string) => {
    localStorage.setItem(getPackingListLocalStorageKey(tripId), content);
    addTripToLocalStorage(tripId);
  };

  if (!editor) return null;

  return (
    <div
      className={twMerge(
        "text-secondary",
        isSaving && "pointer-events-none opacity-50"
      )}
    >
      <div className="flex items-center space-x-3 mb-5">
        <h1 className="text-3xl">packing list</h1>
        <InfoTooltip content="Create a packing list from scratch or quickly copy over your packing list template. You can set up your template in advanced settings." />
      </div>
      <div
        className={twMerge(
          "border border-secondary rounded-2xl p-4 space-y-4 ",
          !showEditor ? "text-center py-10" : "py-6"
        )}
      >
        {showEditor ? (
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
                disabled={!settings?.packingList}
                onClick={() => {
                  savePackingListToLocalStorage(settings?.packingList || "");
                  editor.commands.setContent(settings?.packingList || "");
                  setShowEditor(true);
                }}
              >
                <span>Use packing list template</span>
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
