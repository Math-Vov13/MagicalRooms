import { createContext, useContext, useEffect, useState } from "react";

export const ChronoContext = createContext()

export const useChrono = () => {
    const chronoContext = useContext(ChronoContext);

    if (! chronoContext) {
        throw new Error("useChrono must be used within a ChronoProvider");
    }

    return chronoContext;
}

export const ChronoContextProvider = ({ children }) => {
    const [chrono, setChrono] = useState(0);
    const [isActive, activeChrono] = useState(true);

    useEffect(() => {
        if (!isActive) {
            return () => {};
        }

        const timer = setInterval(() => {
            setChrono(chrono + 1)
        }, 1000);
        
        return ()=> clearInterval(timer);
    }, [chrono, isActive])

    return (
        <ChronoContext.Provider value={{ chrono, isActive, activeChrono }}>
            { children }
        </ChronoContext.Provider>
    )
}