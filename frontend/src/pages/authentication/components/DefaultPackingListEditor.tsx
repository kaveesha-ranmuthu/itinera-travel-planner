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
import EditorBubbleMenu from "../../trips/components/EditorBubbleMenu";
import PopupModal from "../../trips/components/PopupModal";
import Button from "../../../components/Button";

interface DefaultPackingListEditorProps {
  open: boolean;
  onClose: () => void;
}

const DefaultPackingListEditor: React.FC<DefaultPackingListEditorProps> = ({
  onClose,
  open,
}) => {
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
    content: defaultPackingListContent,
    onUpdate: ({ editor }) => null,
  });

  if (!editor) return null;

  return (
    <PopupModal
      className="h-[550px] max-h-[550px] overflow-scroll"
      isOpen={open}
      onClose={onClose}
      modalWidth="w-[500px]"
    >
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-brand italic tracking-wide">
          packing list
        </h1>
        <div className="space-x-2">
          <Button.Secondary
            onClick={() => null}
            type="submit"
            className="border border-secondary px-4 py-1 text-base transition ease-in-out duration-300"
          >
            Save
          </Button.Secondary>
          <Button.Primary
            onClick={onClose}
            type="submit"
            className="border border-secondary px-4 py-1 text-base transition ease-in-out duration-300"
          >
            Cancel
          </Button.Primary>
        </div>
      </div>
      <hr className="opacity-20 mb-4 mt-3" />
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
        className="mt-2 mb-3 font-brand italic tracking-wide"
      />
    </PopupModal>
  );
};

const defaultPackingListContent = `
        <h3>🧼 Toiletries</h3>
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
      </ul>`;

export default DefaultPackingListEditor;
