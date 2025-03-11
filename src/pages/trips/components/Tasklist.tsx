import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useAuth } from "../../../hooks/useAuth";
import { twMerge } from "tailwind-merge";

const Tasklist = () => {
  const { settings } = useAuth();
  const editor = useEditor({
    extensions: [StarterKit, TaskList, TaskItem],
    content: `
        <ul data-type="taskList">
          <li data-type="taskItem" data-checked="false">Start typing...</li>
        </ul>
    `,
  });

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
