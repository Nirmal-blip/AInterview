// import Admin from '../models/Admin_Model'
import StudentData from '../models/StudentData_Modeal.js';
import { sendMail } from '../utils/sendMail.js';
import crypto from 'crypto'
import bcrypt from 'bcrypt'
import generateTokenAndSetCookie from '../utils/generateTokens.js';

export const uploadData = async(req,res)=>{
    try {
        const studentData = req.body; // Array of student data from the frontend
        
        if (!Array.isArray(studentData) || studentData.length === 0) {
            return res.status(400).json({ error: "Invalid or empty data." });
        }
        
        // Save all entries into the database
        const savedData = await StudentData.insertMany(studentData);
        res.status(201).json({ success: true, message: "Data saved successfully!", data: savedData });
    } catch (error) {
          console.log(req.body)
        console.error("Error saving data:", error);
        res.status(500).json({ success: false, error: "Failed to save data." });
      }
}

export const getData = async(req,res)=>{
    try {
        const students = await StudentData.find();
        res.status(200).json(students);
      } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ success: false, error: "Failed to fetch data." });
      }
}

export const sendLink = async(req,res)=>{
    try {
        const { email } = req.body;
        const { organizationName } = req.query
    
        // Find student by email
        const student = await StudentData.findOne({ email });
        if (!student) {
          return res.status(404).json({ success: false, error: "Student not found" });
        }
    
        // Generate unique link, username, and password
        const link = `http://localhost:5173/interview/login/${organizationName}/${student._id}`;
        const username = `${student.name.toLowerCase().replace(/\s/g, "")}${Math.floor(Math.random() * 1000)}`;
        const password = crypto.randomBytes(4).toString("hex");
    
        // Set expiry for 15 minutes
        const expiryTime = new Date(Date.now() + 15 * 60 * 1000);
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);
        console.log(hashPassword)
        student.interviewDetails = { username, password: hashPassword, expiry: expiryTime };
        await student.save();
    
        // Send email
        await sendMail(
          email,
          "AI-Interview Link",
          `Hello ${student.name},<br>Your AI interview details are:<br> 
          Link: <a href="${link}">${link}</a><br> 
          Username: ${username}<br> 
          Password: ${password}<br> 
          This link will expire in 15 minutes.<br>Best of luck!`
        );
    
        res.status(200).json({ success: true, message: "Link has been sent" });
      } catch (error) {
        console.error("Error in sendLink controller:", error);
        res.status(500).json({ success: false, error: "Failed to send link" });
      }
}

export const validateLink = async(req,res)=>{
  try{const { studentId } = req.body
  const student = await StudentData.findById(studentId)
  if(student){
    return res.status(201).json({success:true})
  }
  return res.status(404).json({success: false})}catch(err){
    console.log("error while validating link",err)
    res.status(500).json({message: "Internal server error"})
  }
}

export const studentLogin = async(req,res)=>{
  try{
    const { username, password, studentId }= req.body
    const student = await StudentData.findById(studentId)
    if(student){
      if(student.interviewDetails.expiry.getTime() < Date.now()){
        return res.status(400).json({success:false, message:"username and password has been expired"})
      }
      if(username != student.interviewDetails.username){
        return res.status(400).json({success:false, message:"Invalid username or password"})
      }
      if(!(await bcrypt.compare(password, student.interviewDetails.password))){
        return res.status(400).json({success:false, message:"Invalid username or password"})
      }
      console.log("login success")
      generateTokenAndSetCookie(student._id, res)
      return res.status(201).json({success:true, student:{_id: student._id, email: student.email, mobile: student.mobile, status: student.status, interviewDetails: student.interviewDetails}})
    }
    return res.status(404).json({success:false, message: "Invalid studentId"})
  }catch(err){
    console.log("Error while student login",err)
    res.status(500).json({success:false,message:"Internal server error"})
  }
}

export const getStudentData = async(req,res)=>{
  const { studentId } = req.params
  const student = await StudentData.findById(studentId)
  res.status(201).json(student)
}

// const isLinkExpired = (createdAt) => {
//     const expirationTime = 15 * 60 * 1000; // 15 minutes in milliseconds
//     return Date.now() - new Date(createdAt).getTime() > expirationTime;
//   };

// export const validateLink = async (req,res)=>{
//     try {
//         const { studentId } = req.params;
//         const {username,password} = req.body
    
//         // Find student by ID
//         const student = await StudentData.findById(studentId);
    
//         if (!student) {
//           return res.status(404).json({ success: false, message: "Page not found" });
//         }
    
//         // Check if the link has expired
//         if (isLinkExpired(student.createdAt)) {
//           return res.status(400).json({ success: false, message: "Link has expired." });
//         }
    
//         // Generate username and password if not already present
//         if(username!=)
    
//         // Send response with credentials
//         res.status(200).json({
//           success: true,
//           data: {
//             link: `http://localhost:5174/interview/${studentId}`,
//             username: student.username,
//             password: student.password,
//           },
//         });
//       } catch (error) {
//         console.error("Error validating link:", error);
//         res.status(500).json({ success: false, message: "Internal server error." });
//       }
// }