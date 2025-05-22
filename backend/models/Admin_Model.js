import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema({
  img: { type: String },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  mobile_number: { type: String, unique: true, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

// module.exports = mongoose.model('Admin', UserSchema);
const Admin = mongoose.model("Admin", AdminSchema);
export default Admin;
