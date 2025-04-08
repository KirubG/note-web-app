import React from "react";
import { LuPin } from "react-icons/lu";
import { MdCreate } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { FaReadme } from "react-icons/fa";
import { truncateText } from "../utils/helpers";
import { Link } from "react-router-dom";

const NoteCard = ({
  title,
  content,
  date,
  tags,
  isPinned,
  onEdit,
  onDelete,
  onPinNote,
  noteId
}) => {
  return (
    <div className="w-[380px]  min-h-[150px] p-4 border-1 rounded-xl border-slate-500 hover:shadow-2xl mt-5 transition-all ease-in-out">
      <div className="flex justify-between w-full items-center ">
        <div className="flex flex-col">
          <h4 className="text-2xl font-bold ">{title}</h4>
          <span className="text-slate-400 text-sm">{date}</span>
        </div>
        <LuPin
          className={`${isPinned ? "text-blue-600" : null} text-xl`}
          onClick={onPinNote}
        />
      </div>
      <hr className="text-slate-500 m-1" />
      <p className="font-medium">{truncateText(content)}</p>

      <div className="flex justify-between mb-2.5">
        <div>{tags.map((tag) => `#${tag}`)}</div>
        <div className="flex gap-4 items-center">
          <Link
            to={`/read/${noteId}`} // Must match your route path exactly
            className="text-slate-400 hover:text-blue-400 text-xl"
          >
            <FaReadme />
          </Link>

          <MdCreate
            className="text-slate-400 hover:text-green-400 text-xl"
            onClick={onEdit}
          />
          <MdDelete
            className="text-slate-400 hover:text-red-500 text-xl"
            onClick={onDelete}
          />
        </div>
      </div>
    </div>
  );
};

export default NoteCard;
