import mongoose from "mongoose";
const { Schema } = mongoose;
const AdminPaymentSchema = new Schema({
    company_db_name: { type: String, required: true },
    email: { type: String, required: true },
    company_name: { type: String, required: true },
    PlanType:{type:String,enum:['Basic','Pro','Elite',''],default:""},
    credits:{type:Number,required:true},
    PaymentId:{type:String,required:true},
    amount:{type:Schema.Types.Decimal128,required:true},
    PaidByAdmin:{type:Boolean,required:true,default:false},
    start_date:{type:Date,required:true},
    end_date:{type:Date,required:true},
    OrderId:{type:String,required:true},
    created_at: { type: Date, default: Date.now }
});
const AdminPayment = mongoose.model('AdminPayment', AdminPaymentSchema);
export default AdminPayment