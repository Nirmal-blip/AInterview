import jwt from "jsonwebtoken";
import Company from "../models/master_db_model.js";
const protectRoute=async(req,res,next)=>{
    try {
        const token=req.cookies.jwt;
        if(!token){
            console.log("no token provided");
            return res.status(401).json({error:"UNAUTHORISED NO TOKEN PROVIDED "})
        }
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        if(!decoded){
            return res.status(401).json({error:"UNAUTHORISED INVALID TOKEN "})
        }
        const user=await Company.findById(decoded.company_id).select('-password');
        if(!user){
            return res.status(404).json({error:"USER NOT FOUND "});
        }
        req.user=user; //attach the user object to the request
        next();     //move to next middleware
    } catch (error) {
        console.log("error in protected routes",error);
        res.status(500).json({error:"INTERNAL SERVER ERROR"})
    }
}
export const protectroutestudent=async(req,res,next)=>{
    try {
        const token=req.cookies.jwt;
        if(!token){
            console.log("no token provided");
            return res.status(401).json({error:"UNAUTHORISED NO TOKEN PROVIDED "})
        }
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        if(!decoded){
            return res.status(401).json({error:"UNAUTHORISED INVALID TOKEN "})
        }
        const user=await Company.findById(decoded.student_id).select('-password');
        if(!user){
            return res.status(404).json({error:"USER NOT FOUND "});
        }
        req.user=user; //attach the user object to the request
        next();     //move to next middleware
     } 
 catch(err){
    console.log(err)
 }
}
export default protectRoute
