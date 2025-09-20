"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { fetchUserByToken } from "@/api/users";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedToken = localStorage.getItem("access");
        if (storedToken) {
            setToken(storedToken);
            try {
                const decoded = jwtDecode(storedToken);
                // console.log("Decoded token in AuthContext.js file to see user:", jwtDecode(token));
                setUser(decoded);
            } catch (err) {
                console.error("Invalid token", err);
                logout();
            }
        };
    }, []);

    const login = async ({ access, refresh }) => {
        // console.log("Received token in login:", newToken);
        // localStorage.setItem("authToken", newToken);
        // setToken(newToken);

        localStorage.setItem("access", access);
        localStorage.setItem("refresh", refresh);
        setToken(access);

        try {
            const decoded = jwtDecode(access); 
            const userData = await fetchUserByToken(access);
            setUser(userData);
            
        } catch (err) {
            console.error("Invalid login token", err);
            logout();
        }
    };

    const logout = async () => {
        // localStorage.removeItem("authToken");
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ token, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );

};

export const useAuth = () => useContext(AuthContext);