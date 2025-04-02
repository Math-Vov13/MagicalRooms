import { createContext, useContext, useEffect, useState } from "react";

export const SocketContext = createContext()

export const useSocket = () => {
    const chronoContext = useContext(SocketContext);

    if (! chronoContext) {
        throw new Error("useSocket must be used within a SocketProvider");
    }

    return chronoContext;
}

export const SocketContextProvider = ({ children }) => {


    return (
        <SocketContext.Provider value={{  }}>
            { children }
        </SocketContext.Provider>
    )
}