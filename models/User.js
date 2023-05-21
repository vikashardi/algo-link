import { Schema, models, model } from "mongoose";

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, "Name is Required"],
  },
  mobile: {
    type: String,
    unique: [true, "Mobile already exist"],
    required: [true, "Mobile is Required"],
  },
  email: {
    type: String,
    unique: [true, "Email already exist"],
    required: [true, "Email is Required"],
  },
  password: {
    type: String,
    required: [true, "Password is Required"],
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

const User = models.User || model("User", userSchema);

export default User;
