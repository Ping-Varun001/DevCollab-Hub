import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
    const { user } = useAuth();
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        if (user) {
            const backendUrl = import.meta.env.VITE_BACKEND_URL || 'https://devcollab-backend-ggdi.onrender.com';
            const newSocket = io(backendUrl);
            setSocket(newSocket);

            return () => newSocket.close();
        } else if (socket) {
            socket.close();
            setSocket(null);
        }
    }, [user]);

    return (
        <SocketContext.Provider value={{ socket }}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => useContext(SocketContext);
