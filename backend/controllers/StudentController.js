import crypto from 'crypto';
import { Student } from '../models/student_model.js';
import CryptoJS from 'crypto-js';
import { connections, getConnection } from '../dbConnection/connectDB.js';
// Helper function to generate a strong password
const secretKey=process.env.ENCRYPTION_KEY;
const generatePassword = () => {
  return crypto.randomBytes(9).toString("base64").replace(/[^a-zA-Z0-9]/g, "").slice(0, 12);
};

// Helper function to generate a unique link
const generateUniqueLink = (baseURL, studentId,DB_name) => {
  const token = crypto.randomBytes(8).toString("hex");
  return `${baseURL}/interview/${studentId}-${token}/${DB_name}`;
};
export const uploadStudents = async (req, res) => {
    const { students } = req.body;
    const {company_db_name}=req.user
    let conn= null;
    conn=connections[company_db_name] || await getConnection(company_db_name);
    const studentModel=Student(conn);
    if (!students || !Array.isArray(students)) {
      return res.status(400).json({ message: "Invalid students data." });
    }
    try {
      const baseURL = "http://localhost:5173";
      const savedStudents = await Promise.all(
        students.map(async (student) => {
          const password = generatePassword();
          const encryptedPassword = CryptoJS.AES.encrypt(password, secretKey).toString(); // Encrypt password
          const studentDoc = new studentModel({
            student_name: student.student_name,
            email: student.email,
            phone_number: student.phone_number,
            password: encryptedPassword,
            unique_link: generateUniqueLink(baseURL, student.email.split("@")[0],company_db_name),
          });
          return studentDoc.save();
        })
      );
      res.status(200).json({
        message: "Students uploaded successfully.",
        data: savedStudents,
      });
      
    } catch (error) {
      console.error("Error saving students:", error);
      res.status(500).json({ message: "Error saving students.", error });
    }
  };
  export const getStudents = async (req, res) => {
    try {
       const {company_db_name}=req.user
        let conn= null;
        conn=connections[company_db_name] || await getConnection(company_db_name);
        const studentModel=Student(conn);
      const students = await studentModel.find();
      res.status(200).json({ students });
    } catch (error) {
      console.error("Error fetching students:", error);
      res.status(500).json({ message: "Failed to fetch students.", error });
    }
  };
  export const sendLink = async (req, res) => {
    const { studentId } = req.body;
    const {company_db_name}=req.user
    let conn= null;
    conn=connections[company_db_name] || await getConnection(company_db_name);
    const studentModel=Student(conn);
    try {
      const student = await studentModel.findById(studentId);
  
      if (!student) {
        return res.status(404).json({ message: "Student not found." });
      }
        console.log(`Sending link ${student.unique_link} to ${student.email}`);
  
      res.status(200).json({ message: "Link sent successfully!" });
    } catch (error) {
      console.error("Error sending link:", error);
      res.status(500).json({ message: "Failed to send link.", error });
    }
  };
  export const checkLinkStatus=async(req,res)=>{
    try{
      const {db_name,id}=req.params;
      const link=`http://localhost:5173/interview/${id}/${db_name}`;
      console.log(link);
      let conn= null;
      conn=connections[db_name] || await getConnection(db_name);
      const studentModel=Student(conn);
      const student=await studentModel.findOne({unique_link:link});
      if(!student) return res.status(404).json({message:"Student not found",status:"NOT-FOUND"});
      res.status(200).json({message:"Link is valid",status:student.link_status});
    }
    catch(err){

    }
  }  
  export const updateStatus=async(req,res)=>{
    const {db_name}=req.params;
    const {status}=req.body;
    let conn= null;
    conn=connections[db_name] || await getConnection(db_name);
    const studentModel=Student(conn);
    const student=await studentModel.findOne({unique_link:req.body.link});
    if(!student) return res.status(404).json({message:"Student not found",status:"NOT-FOUND"});
    student.link_status=status;
    await student.save();
    res.status(200).json({message:"Status updated successfully",status:student.link_status});
  }