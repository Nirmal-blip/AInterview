import mongoose from "mongoose"

const userOtpSchema = mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    otp: {
        type: String,
        required: true
    },
    createdAt: {
        type: String,
        required: true
    },
    expiresAt: {
        type: String,
        required: true
    }
})

const UserOtp = mongoose.model('UserOTP', userOtpSchema)

export default UserOtp