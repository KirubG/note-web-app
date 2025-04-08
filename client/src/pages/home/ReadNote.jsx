import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axios";
import { MdArrowBack } from "react-icons/md";
import { FaLink } from "react-icons/fa";
import Linkify from "linkify-react";

const ReadNote = () => {
  const { noteId } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isCopied, setIsCopied] = useState(false);

    const options = {
      target: "_blank",
      rel: "noopener noreferrer",
      className: "text-blue-600 underline hover:text-blue-800",
    };

  const copyNoteLink = () => {
    const noteUrl = `${window.location.origin}/read/${noteId}`;
    navigator.clipboard.writeText(noteUrl);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const response = await axiosInstance.get(`/get-note/${noteId}`);
        if (!response.data.note) {
          navigate("/404"); // Redirect if note doesn't exist
        }
        setNote(response.data.note);
      } catch (error) {
        navigate("/404"); // Redirect on error
      }
    };
    fetchNote();
  }, [noteId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-red-500 text-lg mb-4">{error}</p>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-gray-600 text-lg mb-4">Note not found</p>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
        >
          <MdArrowBack className="mr-1" size={20} />
          Back to Notes
        </button>
        <button
          onClick={copyNoteLink}
          className="flex items-center px-3 py-1 bg-gray-100 rounded hover:bg-gray-200"
        >
          <FaLink className="mr-2" />
          {isCopied ? "Copied!" : "Copy Link"}
        </button>
      </div>
      <Linkify options={options}>
      <div className="bg-white rounded-lg shadow-xl p-6">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-3xl font-bold text-gray-800 underline">{note.title}</h1>
          <span className="text-sm text-gray-500">
            {new Date(note.createdOn).toLocaleDateString()}
          </span>
        </div>

        {note.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {note.tags.map((tag, index) => (
              <span
              key={index}
              className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="prose max-w-none">
          {note.content.split("\n").map((paragraph, index) => (
            <p key={index} className="mb-4 text-gray-700">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
          </Linkify>
    </div>
  );
};

export default ReadNote;
