
import mongoose, { Mongoose } from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const AdminSchema = new mongoose.Schema({
    company_id: {
        type: mongoose.Schema.Types.ObjectId, 
        default:()=>new mongoose.Types.ObjectId() 
    },
    company_db_name: {
      type: String,
      required: true  
    },
    company_name: {
        type: String,
        required: true,
        trim: true
      },
      email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please fill a valid email address']
      },
      password: {
        type: String,
        required: true,
        minlength: 6
      },
      createdAt: {
        type: Date,
        default: Date.now
    }
});
const Company = mongoose.model('MASTER-DB', AdminSchema);
export default Company;