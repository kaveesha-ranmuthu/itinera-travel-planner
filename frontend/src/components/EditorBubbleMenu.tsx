import { BubbleMenu, Editor } from "@tiptap/react";
import React from "react";
import { useAuth } from "../../../hooks/useAuth";
import { twMerge } from "tailwind-merge";
import {
  BsListOl,
  BsListTask,
  BsListUl,
  BsTypeBold,
  BsTypeItalic,
  BsTypeStrikethrough,
} from "react-icons/bs";
import { LuHeading1, LuHeading2, LuHeading3 } from "react-icons/lu";
import { FontFamily } from "../../../types/types";

interface EditorBubbleMenuActions {
  bold?: boolean;
  italic?: boolean;
  strike?: boolean;
  heading1?: boolean;
  heading2?: boolean;
  heading3?: boolean;
  bulletList?: boolean;
  orderedList?: boolean;
  taskList?: boolean;
}

interface EditorBubbleMenuProps {
  editor: Editor;
  actionsToShow: EditorBubbleMenuActions;
}

const EditorBubbleMenu: React.FC<EditorBubbleMenuProps> = ({
  editor,
  actionsToShow,
}) => {
  const { settings } = useAuth();

  return (
    <BubbleMenu
      editor={editor}
      tippyOptions={{ duration: 100 }}
      className="bg-primary drop-shadow-(--drop-shadow-default)"
    >
      <div className="bubble-menu flex items-center">
        {actionsToShow.bold && (
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
        )}
        {actionsToShow.italic && (
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={twMerge(
              "p-2 cursor-pointer hover:bg-primary-hover transition ease-in-out duration-200",
              editor.isActive("italic") ? "is-active" : ""
            )}
          >
            <BsTypeItalic size={20} />
          </button>
        )}
        {actionsToShow.strike && (
          <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={twMerge(
              "p-2 cursor-pointer hover:bg-primary-hover transition ease-in-out duration-200",
              editor.isActive("strike") ? "is-active" : ""
            )}
          >
            <BsTypeStrikethrough size={20} />
          </button>
        )}
        {actionsToShow.heading1 && (
          <button
            onClick={() => editor.commands.toggleHeading({ level: 2 })}
            className="p-2 cursor-pointer hover:bg-primary-hover transition ease-in-out duration-200"
          >
            <LuHeading1 size={20} />
          </button>
        )}
        {actionsToShow.heading2 && (
          <button
            onClick={() => editor.commands.toggleHeading({ level: 3 })}
            className="p-2 cursor-pointer hover:bg-primary-hover transition ease-in-out duration-200"
          >
            <LuHeading2 size={20} />
          </button>
        )}
        {actionsToShow.heading3 && (
          <button
            onClick={() => editor.commands.toggleHeading({ level: 4 })}
            className="p-2 cursor-pointer hover:bg-primary-hover transition ease-in-out duration-200"
          >
            <LuHeading3 size={20} />
          </button>
        )}
        {actionsToShow.bulletList && (
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={twMerge(
              "p-2 cursor-pointer hover:bg-primary-hover transition ease-in-out duration-200",
              editor.isActive("bulletList") ? "is-active" : ""
            )}
          >
            <BsListUl size={20} />
          </button>
        )}
        {actionsToShow.orderedList && (
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={twMerge(
              "p-2 cursor-pointer hover:bg-primary-hover transition ease-in-out duration-200",
              editor.isActive("orderedList") ? "is-active" : ""
            )}
          >
            <BsListOl size={20} />
          </button>
        )}
        {actionsToShow.taskList && (
          <button
            onClick={() => editor.commands.toggleTaskList()}
            className={twMerge(
              "p-2 cursor-pointer hover:bg-primary-hover transition ease-in-out duration-200",
              editor.isActive("orderedList") ? "is-active" : ""
            )}
          >
            <BsListTask size={20} />
          </button>
        )}
      </div>
    </BubbleMenu>
  );
};

export default EditorBubbleMenu;
