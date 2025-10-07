"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { fetchUserProfile } from "@/api/users";
import { BASE_URL } from "@/api/config";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            try {
                const profile = await fetchUserProfile();
                console.log("Fetched user profile:", profile);
                const userData = Array.isArray(profile) ? profile[0]?.user : profile?.user || profile;
                console.log("Fetched user data:", userData);
                setUser(userData);
                setToken("valid");
            } catch (err) {
                try {
                    await fetch(`${BASE_URL}/token/refresh/`, {
                        method: "POST",
                        credentials: "include",
                    });

                    // Retry profile fetch
                    const profile = await fetchUserProfile();
                    const userData = Array.isArray(profile) ? profile[0]?.user : profile?.user || profile;
                    setUser(userData);
                    setToken("valid");
                } catch (refreshErr) {
                    // Refresh failed -> force logout
                    setUser(null);
                    setToken(null);
                }
            } finally {
                setLoading(false);
            }
        };
        initAuth();
    }, []);

    const login = async (email, password) => {
        const res = await fetch(`${BASE_URL}/token/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include", // 🔑 store cookies
            body: JSON.stringify({ email, password }),
        });

        if (!res.ok) throw await res.json();

        setToken("valid");

        const profile = await fetchUserProfile();
        const userData = Array.isArray(profile) ? profile[0]?.user : profile?.user || profile;
        setUser(userData);
    };

    const logout = async () => {
        setUser(null);
        // Optional: hit a backend logout endpoint that clears cookies
        await fetch(`${BASE_URL}/users/logout/`, {
            method: "POST",
            credentials: "include",
        });
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );

};

export const useAuth = () => useContext(AuthContext);