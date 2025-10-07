"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/shared/Navbar";
import UserDashboard from "@/components/dashboard/UserDashboard";
import toast from "react-hot-toast";

export default function DashboardPage() {
    const { user, token, loading } = useAuth();
    const router = useRouter();
    const [dots, setDots] = useState("");

    useEffect(() => {
            const interval = setInterval(() => {
                setDots((prev) => {
                    if (prev === "....") return "";
                    return prev + ".";
                });
            }, 500);
            return () => clearInterval(interval);
        }, []
    );

    useEffect(() => {
        if (user === null) {
            // still loading, don’t redirect yet
            return;
        }

        if (!loading && !token) {
            toast.error("You must sign in to access dashboard.");
            router.push("/authentication");
        }
    }, [loading, token, router]);

    if (loading) {
        const loadingStyle = {
            textColor: 'gray',
            marginTop: '20px'
        };
        return (
            <div style={loadingStyle}>
                <p>Cooking up your dashboard{dots}</p>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return(
        <div className="dashboard-page">
            <Navbar />
            <UserDashboard />
        </div>
    )
}