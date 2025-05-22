import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
export const connections = {}; // Object to store the connections
export const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://bhaveshgautam2302:cFgQlH8qkRJQECUe@cluster0.w9lqx.mongodb.net/MASTER-DB?retryWrites=true&w=majority&appName=Cluster0');
        if(mongoose.connection.readyState === 1){
            console.log("Successfully connected to MASTER-ADMIN-CRM database");
        }
        console.log("Connected to MASTER-ADMIN-CRM database");
        connections["MASTER-ADMIN-CRM"] = mongoose.connection;
        listConnectedDatabases(connections) // List the connected databases
        // console.log(`Test document created in master`);
    } catch (error) {
        console.error("Error connecting to MASTER-ADMIN-CRM database:", error);
    }
};

// Dynamic connections for company-specific databases
export const getConnection = async (dbName) => {
    try {
        const dbUri = `mongodb+srv://bhaveshgautam2302:cFgQlH8qkRJQECUe@cluster0.w9lqx.mongodb.net/${dbName}?retryWrites=true&w=majority&appName=Cluster0`;
        if (!connections[dbName]) {
            console.log(`Creating a new connection for database: ${dbName}`);
            const connection = mongoose.createConnection(dbUri);
            connection.on('connected', () => {
                console.log(`Successfully connected to database: ${dbName}`);
            });
            connection.on('error', (err) => {
                console.error(`Error connecting to database ${dbName}:`, err);
            });
            // Wait for the connection to be established
            await new Promise((resolve, reject) => {
                connection.on('connected', resolve);
                connection.on('error', reject);
            });
            connections[dbName] = connection;
        } else {
            console.log(`Reusing existing connection for database: ${dbName}`);
        }
        // console.log(connections[dbName]);
        return connections[dbName];
    } catch (error) {
        console.error("Error in getConnection:", error);
        throw error;  // Re-throw the error for further handling
    }
};
export const closeConnection = (dbName) => {
    try {
        if (connections[dbName]) {
            console.log(`Closing connection to database: ${dbName}`);
            connections[dbName].close(); // Close the connection
            delete connections[dbName];  // Delete the connection from the connections object
            console.log(`Connection to ${dbName} closed successfully.`);
        } else {
            console.log(`No active connection found for ${dbName}`);
        }
    } catch (error) {
        console.error("Error in closing connection:", error);
    }
};
// Function to list all the currently connected databases
export const listConnectedDatabases = (connections) => {
    console.log("Currently connected databases:", Object.keys(connections));
    return Object.keys(connections); // Return the list of gym DB names
};


