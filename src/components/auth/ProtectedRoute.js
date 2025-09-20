"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

export default function ProtectedRoute({ children }) {
  const { token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      toast.error("You must sign in to access this page.");
      router.push("/authentication");
    }
  }, [token, router]);

  if (!token) return null;

  return children;
}
