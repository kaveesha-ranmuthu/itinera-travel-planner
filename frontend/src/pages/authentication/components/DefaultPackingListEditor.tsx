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
import { auth } from "../../../firebase-config";
import { useUpdateUserSettings } from "../../trips/hooks/setters/useUpdateUserSettings";
import { useAuth } from "../../../hooks/useAuth";
import { useHotToast } from "../../../hooks/useHotToast";

interface DefaultPackingListEditorProps {
  open: boolean;
  onClose: () => void;
}

const DefaultPackingListEditor: React.FC<DefaultPackingListEditorProps> = ({
  onClose,
  open,
}) => {
  const { updateSettings } = useUpdateUserSettings();
  const { settings, setSettings } = useAuth();
  const { notify } = useHotToast();
  const currentPackingList = settings?.packingList;

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
    content: currentPackingList || `<p>Start typing...</p>`,
  });

  if (!editor) return null;

  const handleSave = async () => {
    const content = editor.getHTML();
    if (auth.currentUser) {
      try {
        await updateSettings({
          ...settings!,
          packingList: content,
        });
        setSettings({ ...settings!, packingList: content });
      } catch {
        notify("Something went wrong. Please try again.", "error");
      }
    }
  };

  const resetContent = () => {
    editor.commands.setContent(currentPackingList || `<p>Start typing...</p>`);
  };

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
            onClick={() => {
              handleSave();
              onClose();
            }}
            type="submit"
            className="border border-secondary px-4 py-1 text-base transition ease-in-out duration-300"
          >
            Save
          </Button.Secondary>
          <Button.Primary
            onClick={() => {
              onClose();
              resetContent();
            }}
            type="button"
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
        className={"mt-2 mb-3 font-brand italic tracking-wide"}
      />
    </PopupModal>
  );
};

export default DefaultPackingListEditor;
