import React, { useState, useEffect } from "react";
import Taginput from "../../components/Taginput";
import { MdClose } from "react-icons/md";
import axiosInstance from "../../utils/axios";

const AddEditNotes = ({ noteData, type, onClose, getAllNotes }) => {
  const [note, setNote] = useState({
    title: "",
    content: "",
  });
  const [tags, setTags] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (type === "edit" && noteData) {
      setNote({
        title: noteData.title || "",
        content: noteData.content || "",
      });
      setTags(noteData.tags || []);
    }
  }, [noteData, type]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!note.title.trim()) {
      return setError("Please enter a title");
    }
    if (!note.content.trim()) {
      return setError("Please enter content");
    }

    setIsLoading(true);

    try {
      if (type === "add") {
        await axiosInstance.post("/add-note", {
          title: note.title.trim(),
          content: note.content.trim(),
          tags: tags.filter((tag) => tag.trim()),
        });
      } else {
        await axiosInstance.put(`/edit-note/${noteData._id}`, {
          title: note.title.trim(),
          content: note.content.trim(),
          tags: tags.filter((tag) => tag.trim()),
        });
      }

      await getAllNotes();
      onClose();
    } catch (error) {
      console.error("Error saving note:", error);
      setError(
        error.response?.data?.message ||
          (type === "add" ? "Failed to create note" : "Failed to update note")
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="absolute bg-white  rounded-lg w-full px-8 mx-auto my-2">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-500 hover:text-black transition-colors"
        aria-label="Close modal"
      >
        <MdClose size={24} />
      </button>

      <h2 className="text-2xl font-bold mb-4 text-center">
        {type === "edit" ? "Edit Note" : "Create New Note"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title *
          </label>
          <input
            type="text"
            value={note.title}
            onChange={(e) => setNote({ ...note, title: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Note title"
            maxLength={100}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Content *
          </label>
          <textarea
            value={note.content}
            onChange={(e) => setNote({ ...note, content: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 min-h-[150px]"
            placeholder="Write your note here..."
            maxLength={200000}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tags
          </label>
          <Taginput
            tags={tags}
            setTags={setTags}
            maxTags={5}
            placeholder="Add tags (press enter)"
          />
        </div>

        {error && <div className="text-red-500 text-sm py-2">{error}</div>}

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                {type === "edit" ? "Updating..." : "Creating..."}
              </span>
            ) : type === "edit" ? (
              "Update Note"
            ) : (
              "Create Note"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEditNotes;
