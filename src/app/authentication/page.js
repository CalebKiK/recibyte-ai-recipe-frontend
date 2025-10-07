"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";
import toast from "react-hot-toast";
import UserAuthentication from "@/components/shared/UserAuthentication";

function AuthContent() {
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("auth") === "required") {
      toast.error("You must sign in to access the dashboard");
    }
  }, [searchParams]);

  return <UserAuthentication />;
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthContent />
    </Suspense>
  );
}