import mongoose from 'mongoose'

let mainDBConnection = null
const connectDB=async()=>{
    try {
        mainDBConnection=await mongoose.connect(process.env.MONGO_URI);
        console.log("connected to mongo DB");  
      } catch (error) {
        console.log("error conencting")
    }
}

export {connectDB, mainDBConnection}