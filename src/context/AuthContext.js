"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { fetchUserByToken, fetchUserProfile } from "@/api/users";
import { refreshAccessToken } from "@/api/token/refresh";
import { BASE_URL } from "@/api/config";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // useEffect(() => {
    //     const initAuth = async () => {
    //     let access = localStorage.getItem("access");
    //     const refresh = localStorage.getItem("refresh");

    //     if (!access && refresh) {
    //         // No access, but refresh available → try to refresh
    //         try {
    //         access = await refreshAccessToken();
    //         setToken(access);
    //         localStorage.setItem("access", access);
    //         } catch {
    //         logout();
    //         return;
    //         }
    //     }

    //     if (access) {
    //         try {
    //         setToken(access);
    //         const decoded = jwtDecode(access);
    //         // Optionally fetch user profile from backend
    //         const userData = await fetchUserByToken(access);
    //         setUser(userData || decoded);
    //         } catch (err) {
    //         console.error("Invalid token at init", err);
    //         logout();
    //         }
    //     }
    //     };

    //     initAuth();
    // }, []);

    useEffect(() => {
        const initAuth = async () => {
            try {
                const profile = await fetchUserProfile();
                setUser(profile);
            } catch (err) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        initAuth();
    }, []);

    // const login = async ({ access, refresh }) => {
    //     // console.log("Received token in login:", newToken);
    //     // localStorage.setItem("authToken", newToken);
    //     // setToken(newToken);

    //     localStorage.setItem("access", access);
    //     localStorage.setItem("refresh", refresh);
    //     setToken(access);

    //     try {
    //         const decoded = jwtDecode(access); 
    //         const userData = await fetchUserByToken(access);
    //         setUser(userData || decoded);
            
    //     } catch (err) {
    //         console.error("Invalid login token", err);
    //         logout();
    //     }
    // };

    const login = async (email, password) => {
        const res = await fetch(`${BASE_URL}/token/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include", // 🔑 store cookies
            body: JSON.stringify({ email, password }),
        });

        if (!res.ok) throw await res.json();

        const profile = await fetchUserProfile();
        setUser(profile);
    };

    // const logout = async () => {
    //     // localStorage.removeItem("authToken");
    //     localStorage.removeItem("access");
    //     localStorage.removeItem("refresh");
    //     setToken(null);
    //     setUser(null);
    // };

    const logout = async () => {
        setUser(null);
        // Optional: hit a backend logout endpoint that clears cookies
        await fetch(`${BASE_URL}/logout/`, {
            method: "POST",
            credentials: "include",
        });
    };

    return (
        // <AuthContext.Provider value={{ token, user, login, logout }}>
        //     {children}
        // </AuthContext.Provider>
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );

};

export const useAuth = () => useContext(AuthContext);