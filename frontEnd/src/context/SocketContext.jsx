import { useState } from "react";
import { useEffect } from "react";
import { useContext } from "react";
import { createContext } from "react";
import { io } from "socket.io-client";
const urlBack = import.meta.env.VITE_LOCALHOST_BACK;

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!socket) setSocket(io(urlBack));
  }, [socket]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
export const useSocket = () => useContext(SocketContext);
