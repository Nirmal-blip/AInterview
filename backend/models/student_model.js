import mongoose from "mongoose";
const StudentSchema = new mongoose.Schema({
  student_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone_number: { type: String, required: true },
  password: { type: String, required: true },
  unique_link: { type: String, required: true, unique: true },
  link_status: {
    type: String,
    enum: ['ACTIVE', 'USED', 'EXPIRED','LOCKED'], // Allowed values
    default: 'ACTIVE', 
  },
});

export const Student=(connection)=>connection.model('STUDENT', StudentSchema);