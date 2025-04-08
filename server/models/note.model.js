import { Schema, model } from "mongoose";

let noteSchema = new Schema({
  title: {
    type: String,
    unique: false,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  tags: {
    type: [String],
    default: [],
    required: false,
  },
  createdOn: {
    type: Date,
    default: Date.now,
  },
  isPinned: {
    type: Boolean,
    default: false,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

// Ensure the userId field is indexed for better query performance
noteSchema.index({ userId: 1 });

let Note = model("Note", noteSchema);
export default Note;
