import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useAuth } from "../../../hooks/useAuth";
import { twMerge } from "tailwind-merge";
import { useEffect } from "react";

interface TasklistProps {
  onSubmit: (tasklist: string) => Promise<undefined | Error>;
  savedTaskList: string;
  tripId: string;
}

const LOCAL_STORAGE_KEY = (tripId: string) => `unsaved-tasklist-${tripId}`;

const Tasklist: React.FC<TasklistProps> = ({
  onSubmit,
  savedTaskList,
  tripId,
}) => {
  const { settings } = useAuth();
  const lastChanges = localStorage.getItem(LOCAL_STORAGE_KEY(tripId));
  const editor = useEditor({
    extensions: [StarterKit, TaskList, TaskItem],
    content: lastChanges ?? savedTaskList,
    onUpdate: ({ editor }) => {
      localStorage.setItem(LOCAL_STORAGE_KEY(tripId), editor.getHTML());
    },
  });

  useEffect(() => {
    return () => {
      (async () => {
        const unsavedData = localStorage.getItem(LOCAL_STORAGE_KEY(tripId));

        if (unsavedData) {
          try {
            const error = await onSubmit(unsavedData);
            if (!error) {
              localStorage.removeItem(LOCAL_STORAGE_KEY(tripId));
            } else {
              console.error("Failed to save tasklist:", error);
            }
          } catch (err) {
            console.error("Error during unmount save:", err);
          }
        }
      })();
    };
  }, [tripId, onSubmit]);

  return (
    <div className="space-y-3 text-secondary">
      <h1 className="text-lg">Tasklist</h1>
      <EditorContent
        editor={editor}
        className={(twMerge("mt-2 mb-3"), settings?.font)}
      />
    </div>
  );
};

export default Tasklist;
