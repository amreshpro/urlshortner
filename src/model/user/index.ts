import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 2 },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6 },
  age: { type: Number },
  city: { type: String, required: true, minlength: 2 },
  country: { type: String, required: true, minlength: 2 },
  createdAt: { type: Date, default: Date.now },
  role: { type: String, enum: ["user", "admin"], default: "user" }, // Role field
});

// Create Mongoose model for User
const User = mongoose.model("users", userSchema);
export default User;
