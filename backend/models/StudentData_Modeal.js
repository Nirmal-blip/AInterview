import mongoose from 'mongoose'

const StudentDataSchema = new mongoose.Schema({
    name: { type:String, required: true },
    email: { type:String, required: true },
    mobile: { type:Number, required: true },
    status: { type:String, default: 'Pending' },
    interviewDetails: {
        username: { type:String, default:null },
        password: { type:String, default:null },
        expiry: { type:Date, default:null }
    },
    performance: {
        feature1: {type: String, default:"Interview not completed yet"},
        feature2: {type: String, default:"Interview not completed yet"},
        feature3: {type: String, default:"Interview not completed yet"},
        feature4: {type: String, default:"Interview not completed yet"}
    },
})

const StudentData = mongoose.model('StudentData', StudentDataSchema)

export default StudentData