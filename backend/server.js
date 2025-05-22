import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
dotenv.config();
import path from "path";
import cors from "cors";
import http from "http";
import { closeConnection, connectDB, connections, getConnection, listConnectedDatabases } from "./dbConnection/connectDB.js";
import authRoutes from "./routes/Authroutes.js";
import PaymentRoutes from './routes/PaymentRoutes.js';
import StudentRoutes from './routes/StudentRoutes.js';
import { Server } from "socket.io"; // Import the correct Server class for Socket.IO
const __dirname = path.resolve();
const PORT = process.env.PORT || 5000;
console.log(__dirname);
const app = express();
const server = http.createServer(app); // Create an HTTP server with Express
export const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173","http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  },
});

io.on("connection", async (socket) => {
  console.log("A user connected");
  const { Authuser } = socket.handshake.query;
  let parsedAuthuser;
  if (Authuser) {
    parsedAuthuser = JSON.parse(Authuser); // Parse the serialized object
    console.log(parsedAuthuser?.company_db_name);
    if (parsedAuthuser?.company_db_name !== undefined) {
      await connections[parsedAuthuser?.company_db_name] ||
        await getConnection(parsedAuthuser?.company_db_name);
    }
    listConnectedDatabases(connections);
  }
  socket.on('tabClosed',async(uniqueID)=>{
   console.log(uniqueID,' tab closed ... ');
  });
  socket.on("disconnect", () => {
    console.log("User disconnected");
    if (parsedAuthuser?.company_db_name !== undefined) {
      closeConnection(parsedAuthuser?.company_db_name);
      listConnectedDatabases(connections);
    }
  });
});
app.post("/select-questions", async (req, res) => {
  try {
    const { num_questions } = req.body;
    const response = await axios.post("http://localhost:8000/select-questions/", {
      num_questions,
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/get-questions/:session_id", async (req, res) => {
  try {
    const { session_id } = req.params;
    const response = await axios.get(`http://localhost:8000/get-questions/${session_id}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/process-audio", async (req, res) => {
  try {
    const { question_id, audio_file } = req.body;
    const response = await axios.post("http://localhost:8000/process-audio/", {
      question_id,
      audio_file,
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  })
);
app.use(bodyParser.json());
app.use("/api/auth", authRoutes);
app.use('/api/Payment',PaymentRoutes);
app.use('/api/students',StudentRoutes);
server.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await connectDB(); // Connect to the database
});
