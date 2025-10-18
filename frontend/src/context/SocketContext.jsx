import React, { createContext, useContext } from 'react';
import { io } from 'socket.io-client';

// Use Vite env to allow overrides; default to localhost:5000
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
const socket = io(SOCKET_URL, { autoConnect: false });
const SocketContext = createContext(socket);

export const useSocket = () => {
    return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};
