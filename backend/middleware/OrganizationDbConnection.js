import mongoose from 'mongoose';
import Organizations from "../models/OrganizationDb_Model.js"
import { mainDBConnection } from '../dbConnection/ConnestDB.js';

// Cache for database connections
const connections = {};

export const connectToOrganizationDB = async (req, res, next) => {
  const { organizationName } = req;
  console.log("organizationName", organizationName)

  if (!organizationName) {
    return res.status(400).json({ message: 'Organization name is required' });
  }

  try {
    // Check if a cached connection already exists
    if (connections[organizationName]) {
      req.dbConnection = connections[organizationName];
      return next();
    }

    // Fetch organization details from the master database
    const organization = await Organizations.findOne({organizationName: organizationName});
    console.log("Organization in database",organization)
    if (!organization) {
      const organizations = await Organizations.find()
        console.log("organization not found", organizations)
      return res.status(404).json({ message: 'Organization not found' });
    }

    const dbURI = organization.MongoURI;

    // Create a new connection for the organization's database
    if(mainDBConnection){
        try{mainDBConnection.disconnect()}catch(err){console.log("err",err)}
    }
    const connection = await mongoose.connect(dbURI)

    // Cache the connection for reuse
    connections[organizationName] = connection;

    // Attach the connection to the request object
    req.dbConnection = connection;
    console.log("Connected to database")

    next();
  } catch (error) {
    console.error('Error connecting to organization database:', error);
    res.status(500).json({ message: 'Database connection error', error });
  }
};
