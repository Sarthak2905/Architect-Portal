import { createContext, useContext, useEffect, useState } from "react";
import { axiosClient } from "../api/axiosClient";

const AuthContext = createContext(null);

const isPortalRoute = () => window.location.pathname.startsWith("/portal");

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Portal pages are public and have nothing to do with owner auth —
        // never attempt to verify/refresh an owner session there.
        if (isPortalRoute()) {
            setIsLoading(false);
            return;
        }

        const bootstrap = async () => {
            const token = localStorage.getItem("accessToken");
            if (!token) {
                setIsLoading(false);
                return;
            }
            try {
                const { data } = await axiosClient.get("/auth/me");
                setUser(data.data);
            } catch {
                localStorage.removeItem("accessToken");
            } finally {
                setIsLoading(false);
            }
        };
        bootstrap();
    }, []);

    const login = (accessToken, userData) => {
        localStorage.setItem("accessToken", accessToken);
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem("accessToken");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
    return ctx;
};