import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { MdOutlineAddTask } from "react-icons/md";
import { twMerge } from "tailwind-merge";
import { useAuth } from "../../../hooks/useAuth";
import {
  addTripToLocalStorage,
  getTasklistLocalStorageKey,
} from "./sections/helpers";
import { UndoRedo } from "@tiptap/extensions";

interface TasklistProps {
  savedTaskList: string;
  tripId: string;
}

const Tasklist: React.FC<TasklistProps> = ({ savedTaskList, tripId }) => {
  const { settings } = useAuth();
  const lastChanges = localStorage.getItem(getTasklistLocalStorageKey(tripId));

  const editor = useEditor({
    extensions: [StarterKit, TaskList, TaskItem, UndoRedo],
    content: lastChanges || savedTaskList,
    onUpdate: ({ editor }) => {
      localStorage.setItem(
        getTasklistLocalStorageKey(tripId),
        editor.getHTML()
      );
      addTripToLocalStorage(tripId);
    },
  });

  return (
    <div className={twMerge("space-y-3 text-secondary", settings?.font)}>
      <div className="flex justify-between items-center">
        <h1 className="text-lg">Tasklist</h1>
        <button
          type="button"
          className="hover:opacity-70 transition ease-in-out duration-300 cursor-pointer"
          onClick={() => editor?.chain().focus().toggleTaskList().run()}
        >
          <MdOutlineAddTask size={20} className="text-secondary" />
        </button>
      </div>
      <EditorContent
        editor={editor}
        className={(twMerge("mt-2 mb-3"), settings?.font)}
      />
    </div>
  );
};

export default Tasklist;
