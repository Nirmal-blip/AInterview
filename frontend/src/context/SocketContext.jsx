
import React, { createContext, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuthContext } from './Authcontext';
export const SocketContext = createContext();
export const SocketProvider = ({ children }) => {
  const { Authuser } = useAuthContext();
  const socketRef = useRef(null); // Use a ref to maintain a single socket instance
  const [socketId, setSocketId] = useState(null);

  useEffect(() => {
    if (!socketRef.current) {
      // Initialize socket only once
      socketRef.current = io('http://localhost:5000', {
        query: {
          Authuser: Authuser!==null ? JSON.stringify(Authuser) : null, // Serialize the Authuser object
        },
        reconnection: true, // Enable reconnection
      });

      socketRef.current.on('connect', () => {
        setSocketId(socketRef.current.id);
        console.log('Connected to server:', socketRef.current.id);
      });

      socketRef.current.on('disconnect', () => {
        console.log('Disconnected from server');
      });
    }

    return () => {
      // Cleanup the socket on component unmount
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [Authuser]); // Dependency array ensures reinitialization if Authuser changes

  const value = {
    socket: socketRef.current,
    socketId,
  };

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};
