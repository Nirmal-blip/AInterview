import bcrypt from "bcryptjs";
import nodemailer from 'nodemailer';
import  { closeConnection, connections, getConnection, listConnectedDatabases } from "../dbConnection/connectDB.js";
import crypto from "crypto";
import CryptoJS from "crypto-js";
import dotenv from "dotenv";
import Company from "../models/master_db_model.js";
import { Student } from "../models/student_model.js";
import { OTP_MODEL } from "../models/OTP_MODEL.js";
import generateTokenAndSetCookie, { generateTokenAndSetCookieStudent } from '../utils/generateTokens.js';
import AdminPayment from "../models/PaymentModelAdmin.js";
dotenv.config();
export const SignUp = async (req, res) => {
    const { company_name, company_email ,password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const companyDbName = `COMPANY_${company_name.toUpperCase().replace(/ /g, '_')}`;
        const SignupConnectionToSpecificDB = await getConnection(companyDbName);
        const newCompany=new Company({company_name,email:company_email,password:hashedPassword,company_db_name:companyDbName});
        if(newCompany){
            await newCompany.save();
            generateTokenAndSetCookie(newCompany._id, res);
            console.log('New company saved successfully.');
            const student_model=Student(SignupConnectionToSpecificDB);
            listConnectedDatabases(connections);
            console.log('All models initialized for the new company.');
        }
        res.status(201).json({
            _id: newCompany._id,
            company_name: newCompany.company_name,
            company_email: newCompany.email,
            PaidByAdmin: false,
            credits: 0,
            company_db_name: newCompany.company_db_name
        });
    } catch (error) {
        console.error("Error during company registration:", error);
        res.status(500).json({ message: 'Error during company registration', error });
    }
};
export const login=async(req,res)=>{
    const { email, password } = req.body;
    try {
       const company=await Company.findOne({email});
       if(!company) return res.status(400).json({ message: 'company not found !!!' });
       const isPasswordMatch = await bcrypt.compare(password, company.password);
       if (!isPasswordMatch) return res.status(400).json({ message: 'WRONG PASSWORD' });
       generateTokenAndSetCookie(company._id, res);
       await getConnection(company.company_db_name);
       listConnectedDatabases(connections);
       const PaymentStatus= await AdminPayment.findOne({company_db_name:company.company_db_name});
        res.status(200).json({
            _id: company._id,
            PaidByAdmin: PaymentStatus?.PaidByAdmin || false,
            credits: PaymentStatus?.credits || 0,
            company_name: company.company_name,
            company_email: company.email,
            company_db_name: company.company_db_name
        });
    } catch (error) {
        console.log("error in login controller",error);
        res.status(500).json({ message: 'Error during login', error });
    }
}
export const logout=(req,res)=>{
    try {
        const companyDbName = req.body.company_db_name; 
        listConnectedDatabases(connections); // List all the currently connected
        if (companyDbName && connections[companyDbName]) {
            closeConnection(companyDbName);  // Close the connection using the manager
            console.log(`Connection to ${companyDbName} closed successfully.`);
        }
        console.log('/n');
        listConnectedDatabases(connections)
      res.cookie('jwt','',{maxAge:0});
      res.status(200).json({message:"logged out successfully"})
    } catch (error) {
      console.log("error in logout controller",error);
      res.status(500).json({error:"internal server error"})
    }
  }
  const decryptData = (ciphertext, key) => {
    try {
      const bytes = CryptoJS.AES.decrypt(ciphertext, key);
      const originalText = bytes.toString(CryptoJS.enc.Utf8);
      if (!originalText) {
        throw new Error("Decryption failed or invalid key");
      }
      return originalText;
    } catch (error) {
      console.error("Error decrypting data:", error.message);
      return null;
    }
  };
  
  export const StudentLogin=async(req,res)=>{
    try{
      const {db_name,email,password}=req.body;
      let conn= null;
      conn=connections[db_name] || await getConnection(db_name);
      const studentModel=Student(conn);
      const student=await studentModel.findOne({email});
      if(!student) return res.status(400).json({message:"student not found"});
      const isPasswordMatch= decryptData(student.password,process.env.ENCRYPTION_KEY)===password;
      if(!isPasswordMatch) return res.status(400).json({message:"WRONG PASSWORD"});
      student.link_status='LOCKED';
      await student.save();
      generateTokenAndSetCookieStudent(student._id,res);
      res.status(200).json({
        _id: student._id,
        student_name: student.student_name,
        email: student.email,
        phone_number: student.phone_number,
        unique_link: student.unique_link,
        link_status: student.link_status
      });

    }catch(err){
      console.log(err);
    }
  }
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  const sendOtpEmail = async (email, otp, reason) => {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "OTP Verification",
      text: `Your OTP for ${reason} is: ${otp}`,
    };
  
    try {
      await transporter.sendMail(mailOptions);
      console.log("OTP sent to", email);
    } catch (error) {
      console.error("Error sending OTP email:", error);
    }
}
  
  export const SendOTP = async (req, res) => {
    const { email, reason } = req.body;
    try {
      const otp = crypto.randomInt(100000, 999999).toString(); // Generate a 6-digit OTP
      const saltRounds = 10;
      // Hash the OTP
      const hashedOtp = await bcrypt.hash(otp, saltRounds);
      const OtpModel=OTP_MODEL(connections["MASTER-ADMIN-CRM"]);
      // Save hashed OTP to OtpModel
      await OtpModel.updateOne(
        { email },
        { email, otp: hashedOtp },
        { upsert: true } // Create or update OTP entry
      );
      // Send plain OTP via email
      await sendOtpEmail(email, otp, reason);
      res.json({ message: "OTP sent to your email." });
    } catch (error) {
      console.error("Error sending OTP:", error);
      res.status(500).json({ error: "Failed to send OTP" });
    }
  };
export const VerifyOTP = async (req, res) => {
    const { email, otp } = req.body;
    try {
      // Validate input
      if (!email || !otp) {
        return res.status(400).json({ verified: false, error: "Email and OTP are required." });
      }
     const OtpModel=OTP_MODEL(connections["MASTER-ADMIN-CRM"]);
      // Find OTP entry in the database
      const otpEntry = await OtpModel.findOne({ email });
      if (!otpEntry) {
        return res.status(400).json({ verified: false, error: "Invalid or expired OTP." });
      }
      // Verify the OTP
      const isOtpValid = await bcrypt.compare(otp, otpEntry.otp); // Compare hashed OTP
      console.log(isOtpValid,' isOtpValid')
      if (!isOtpValid) {
        return res.status(400).json({ verified: false, error: "Invalid OTP." });
      }
  
      // Clear OTP after successful verification
      await OtpModel.deleteOne({ email });
  
      res.json({ verified: true, message: "OTP verified successfully." });
    } catch (error) {
      console.error("Error verifying OTP:", error);
      res.status(500).json({ error: "Failed to verify OTP." });
    }
  };
  export const CheckMail = async (req, res) => {
    const { email } = req.body;
    try {
      const user = await Company.findOne({ email:email });
      if (!user) return res.json({ exists: false });
      if (user) {
        return res.json({ exists: true });
      }
      // res.json({ exists: false, isAdmin: false });
    } catch (error) {
      console.error("Error checking email:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  export const ResetPassword = async (req, res) => {
    const { email, newPassword } = req.body;
    try {
      const user = await Company.findOne({ email:email });
      if (!user) return res.status(404).json({ message: "User not found, associated with this email" });
      // Hash the new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      // Update the password
      user.password = hashedPassword;
      await user.save();
      res.json({ message: "Password reset successful." });
    } catch (error) {
      console.log("Error resetting password:", error);
      // console.error("Error resetting password:", error);
      res.status(500).json({ message: "Internal server error." });
    }
  }
