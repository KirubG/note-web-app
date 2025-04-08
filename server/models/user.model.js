import { Schema, model } from "mongoose";

let userSchema = new Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true }, // Unique index is defined here
  password: { type: String, required: true },
  createdOn: { type: Date, default: Date.now },
});

let User = new model("User", userSchema);
export default User;
