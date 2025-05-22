import mongoose from "mongoose";

const OrganizationDbSchema = new mongoose.Schema({
    organizationName: { type:String },
    MongoURI: { type:String }
})

const Organizations = mongoose.model("Organizations", OrganizationDbSchema);
export default Organizations;