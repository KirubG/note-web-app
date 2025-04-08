import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import NoteCard from "../../components/NoteCard";
import { MdAdd, MdSearch } from "react-icons/md";
import AddEditNotes from "./AddEditNotes";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axios";

Modal.setAppElement("#root");

const Home = () => {
  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });
  const [userInfo, setUserInfo] = useState(null);
  const [notes, setAllNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [selectedTag, setSelectedTag] = useState("all");
  const navigate = useNavigate();

  // Get all unique tags for filtering
  const allTags = ["all", ...new Set(notes.flatMap(note => note.tags))];

  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/get-user");
      setUserInfo(response.data.user);
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    }
  };

  const getAllNotes = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get("/get-notes");
      setAllNotes(response.data.notes || []);
      setFilteredNotes(response.data.notes || []);
    } catch (error) {
      console.error("Error fetching notes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditNote = (note) => {
    setOpenAddEditModal({
      isShown: true,
      type: "edit",
      data: note,
    });
  };

  const handleDeleteNote = async (noteId) => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      try {
        await axiosInstance.delete(`/delete-note/${noteId}`);
        getAllNotes();
      } catch (error) {
        console.error("Error deleting note:", error);
      }
    }
  };

  const handlePinNote = async (noteId, isCurrentlyPinned) => {
    try {
      await axiosInstance.put(`/update-pinned-note/${noteId}`, {
        isPinned: !isCurrentlyPinned,
      });
      getAllNotes();
    } catch (error) {
      console.error("Error pinning note:", error);
    }
  };

  // Filter notes based on search and selected tag
  useEffect(() => {
    let results = notes;
    
    // Filter by search text
    if (searchText) {
      results = results.filter( (note) =>
        note.title.toLowerCase().includes(searchText.toLowerCase()) ||
        note.content.toLowerCase().includes(searchText.toLowerCase()) ||
        note.tags.some(tag => tag.toLowerCase().includes(searchText.toLowerCase())))
    }
  
    // Filter by tag
    if (selectedTag !== "all") {
      results = results.filter(note => note.tags.includes(selectedTag));
    }
    
    setFilteredNotes(results);
  }, [searchText, selectedTag, notes]);

  useEffect(() => {
    getUserInfo();
    getAllNotes();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userInfo={userInfo} />

      {/* Search and Filter Section */}
      <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <MdSearch className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search notes..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={selectedTag}
          onChange={(e) => setSelectedTag(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {allTags.map(tag => (
            <option key={tag} value={tag}>
              {tag === "all" ? "All Tags" : tag}
            </option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {filteredNotes.length === 0 ? (
            <div className="text-center py-10">
              <h3 className="text-xl font-medium text-gray-600">
                {searchText || selectedTag !== "all" 
                  ? "No matching notes found" 
                  : "No notes found"}
              </h3>
              <button
                onClick={() =>
                  setOpenAddEditModal({ isShown: true, type: "add", data: null })
                }
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Create New Note
              </button>
              
            </div>
          ) : (
            <div className="container mx-auto px-4 py-2">
              <div className="grid gap-6 xl:grid-cols-3 md:grid-cols-2 grid-cols-1">
                {filteredNotes
                  .sort((a, b) => (a.isPinned === b.isPinned ? 0 : a.isPinned ? -1 : 1))
                  .map((note) => (
                    <NoteCard
                      key={note._id}
                      title={note.title}
                      date={new Date(note.createdOn).toLocaleDateString()}
                      content={note.content}
                      tags={note.tags}
                      isPinned={note.isPinned}
                      onDelete={() => handleDeleteNote(note._id)}
                      onEdit={() => handleEditNote(note)}
                      onPinNote={() => handlePinNote(note._id, note.isPinned)}
                      noteId={note._id} // Pass the noteId to the NoteCard component
                    />
                  ))}
              </div>
            </div>
          )}
        </>
      )}

      <button
        onClick={() =>
          setOpenAddEditModal({ isShown: true, type: "add", data: null })
        }
        className="fixed right-5 bottom-10 z-10 w-16 h-16 rounded-full flex items-center justify-center bg-blue-600 hover:bg-blue-700 transition-colors shadow-lg"
        aria-label="Add new note"
      >
        <MdAdd className="text-white" size={24} />
      </button>

      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={() =>
          setOpenAddEditModal({ isShown: false, type: "add", data: null })
        }
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1000,
          },
          content: {
            maxWidth: "600px",
            margin: "auto",
            borderRadius: "8px",
            padding: "0",
            border: "none",
          },
        }}
        contentLabel={openAddEditModal.type === "add" ? "Add Note" : "Edit Note"}
      >
        <AddEditNotes
          getAllNotes={getAllNotes}
          noteData={openAddEditModal.data}
          type={openAddEditModal.type}
          onClose={() =>
            setOpenAddEditModal({ isShown: false, type: "add", data: null })
          }
        />
      </Modal>
    </div>
  );
};

export default Home;