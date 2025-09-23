"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/shared/Navbar";
import UserDashboard from "@/components/dashboard/UserDashboard";
import toast from "react-hot-toast";

export default function DashboardPage() {
    const { token } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (token === null) {
        // still loading, don’t redirect yet
        return;
        }

        if (!token) {
            toast.error("You must sign in to access dashboard.");
            router.push("/authentication");
        }
    }, [token, router]);

    if (token === null) {
        return <p>Loading...</p>; // prevent flicker
    }

    if (!token) {
        return null;
    }

    return(
        <div className="dashboard-page">
            <Navbar />
            <UserDashboard />
        </div>
    )
}