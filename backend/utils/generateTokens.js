import jwt from "jsonwebtoken";
const generateTokenAndSetCookie=(company_id,res)=>{
    const token=jwt.sign({company_id},process.env.JWT_SECRET,{
        expiresIn:'15d'
    });
    res.cookie('jwt',token,{
        maxAge:15*24*60*60*1000, //milli seconds
        httpOnly:true,//prevent XSS attacks,    
        sameSite:"strict" //prevent csrf attacks    
       , secure:process.env.NODE_ENV!=='development'
    })
}
export const generateTokenAndSetCookieStudent=(student_id,res)=>{
    const token=jwt.sign({student_id},process.env.JWT_SECRET,{
        expiresIn:'15d'
    });
    res.cookie('jwt',token,{
        maxAge:15*24*60*60*1000, //milli seconds
        httpOnly:true,//prevent XSS attacks,    
        sameSite:"strict" //prevent csrf attacks    
       , secure:process.env.NODE_ENV!=='development'
    })
}
export default generateTokenAndSetCookie;
