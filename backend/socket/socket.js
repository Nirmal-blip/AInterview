import { Server } from "socket.io";
import http from "http";
import express from "express";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173","http://localhost:5174","http://localhost:3000"
            
        ], // Replace with your frontend URL
        methods: ["GET", "POST"],
    },
});

const userSocketMap = {};

export const getReceiverSocketId = (receiverId) => {
    return userSocketMap[receiverId];
};

io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    const userId = socket.handshake.query.userId;
    if (userId && userId !== "undefined") {
        userSocketMap[userId] = socket.id;
        console.log(`User ${userId} connected with socket ID: ${socket.id}`);
    }

    io.emit("getOnlineUsers", Object.keys(userSocketMap));



    socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`);
        const userIdToRemove = Object.keys(userSocketMap).find(key => userSocketMap[key] === socket.id);
        if (userIdToRemove) {
            delete userSocketMap[userIdToRemove];
        }
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});

export { app, server, io };