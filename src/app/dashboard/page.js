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
        if (!token) {
            toast.error("You must sign in to access dashboard.");
            router.push("/authentication");
        }
    }, [token, router]);

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