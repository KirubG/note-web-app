import express from "express";
import cors from "cors";
import { configDotenv } from "dotenv";
import mongoose from "mongoose";
import fs from "fs";
import jwt from "jsonwebtoken";
import { authenticateToken } from "./utilities.js"; //authentication middleware
import User from "./models/user.model.js"; // User model
import Note from "./models/note.model.js"; // Note model

const config = JSON.parse(fs.readFileSync("./config.json", "utf-8"));

configDotenv();

// Connect to MongoDB
mongoose
  .connect(config.connectionString, { serverSelectionTimeoutMS: 50000 })
  .then(() => {
    console.log("Connected to MongoDB Atlas");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB", err);
  });

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

// Welcome Route
app.get("/", (req, res) => {
  res.json({ data: "Hello World!" });
});

// Create Account Route
app.post("/create-account", async (req, res) => {
  let { fullName, email, password } = req.body;
  if (!fullName || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const isUserAvailable = await User.findOne({ email });

  if (isUserAvailable) {
    return res.status(400).json({ message: "User already exists" });
  }

  let newUser = new User({ fullName, email, password });
  await newUser.save();

  const accessToken = jwt.sign(
    {
      user: {
        _id: newUser._id,
        email: newUser.email,
        fullName: newUser.fullName,
      },
    },
    process.env.ACCESS_WEB_TOKEN,
    { expiresIn: "15000m" }
  );

  return res
    .status(200)
    .json({ message: "Registration successful", accessToken, newUser });
});

// Login Route
app.post("/login", async (req, res) => {
  let { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const isUserAvailable = await User.findOne({ email });
  if (!isUserAvailable) {
    return res.status(400).json({ message: "User not found" });
  }

  if (isUserAvailable.password !== password) {
    return res.status(400).json({ message: "Invalid password" });
  }

  // Create JWT token containing full user information (excluding sensitive data)
  const accessToken = jwt.sign(
    {
      user: {
        _id: isUserAvailable._id,
        email: isUserAvailable.email,
        fullName: isUserAvailable.fullName,
      },
    },
    process.env.ACCESS_WEB_TOKEN,
    { expiresIn: "15000m" }
  );

  return res.status(200).json({
    message: "Login successful",
    accessToken,
    user: isUserAvailable, // Optionally send user info (but exclude sensitive data like password)
  });
});

// Get user
app.get("/get-user", authenticateToken, async (req, res) => {
  let { user } = req.user;
  let isUser = await User.findOne({ _id: user._id });
  if (!isUser) {
    return res.sendStatus(401);
  }
  return res.status(200).json({
    user: {
      _id: isUser._id,
      email: isUser.email,
      fullName: isUser.fullName,
      createdOn: isUser.createdOn,
    },
    msg: "",
  });
});

// Add Note Route
app.post("/add-note", authenticateToken, async (req, res) => {
  try {
    let { title, content, tags } = req.body;
    let user = req.user; // This contains the simplified user object

    // Log the user object for debugging
    console.log("User from token:", user.user._id);

    if (!title || !content) {
      return res.status(400).json({ message: "All fields are required" });
    }

    let newNote = new Note({
      title,
      content,
      tags: tags || [],
      userId: user.user._id, // Access _id directly
    });

    await newNote.save();
    return res
      .status(200)
      .json({ message: "Note added successfully", newNote });
  } catch (error) {
    console.error("Error in /add-note:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Get Notes Route
app.get("/get-notes", authenticateToken, async (req, res) => {
  let user = req.user; // This contains the simplified user object

  try {
    let notes = await Note.find({ userId: user.user._id }).sort({
      isPinned: -1,
      createdOn: -1,
    });
    return res.status(200).json({ notes });
  } catch (error) {
    console.error("Error in /get-notes:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// In your server-side code (backend)
// Must match the frontend request
app.get("/get-note/:noteId", authenticateToken, async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params.noteId,
      userId: req.user.user._id,
    });
    res.json({ note });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
}); 

// Edit Note Route
app.put("/edit-note/:noteId", authenticateToken, async (req, res) => {
  let { title, content, tags, isPinned } = req.body;
  let user = req.user; // This contains the simplified user object
  let noteId = req.params.noteId;

  if (!title && !content && !tags && !isPinned) {
    return res.status(400).json({ message: "No Changes provided" });
  }

  try {
    let note = await Note.findOne({ _id: noteId, userId: user.user._id });
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }
    if (title) {
      note.title = title;
    }
    if (content) {
      note.content = content;
    }
    if (tags) {
      note.tags = tags;
    }
    if (isPinned) {
      note.isPinned = isPinned;
    }
    await note.save();
    return res.status(200).json({ message: "Note updated successfully", note });
  } catch (error) {
    console.error("Error in /edit-note:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// delete note
app.delete("/delete-note/:noteId", authenticateToken, async (req, res) => {
  let user = req.user; // This contains the simplified user object
  let noteId = req.params.noteId;

  try {
    let note = await Note.findOne({ _id: noteId, userId: user.user._id });
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }
    await note.deleteOne({ _id: noteId, userID: user.user._id });
    return res.json({ message: "Note deleted successfully" });
  } catch (error) {
    console.error("Error in /edit-note:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// update pinned
app.put("/update-pinned-note/:noteId", authenticateToken, async (req, res) => {
  let { isPinned } = req.body;
  let user = req.user; // This contains the simplified user object
  let noteId = req.params.noteId;

  try {
    let note = await Note.findOne({ _id: noteId, userId: user.user._id });
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    note.isPinned = isPinned;
    await note.save();
    return res.status(200).json({ message: "Note updated successfully", note });
  } catch (error) {
    console.error("Error in /edit-note:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Start the server
app.listen(8000, () => {
  console.log("Server is running on port 8000");
});

export default app;
