"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function AuthSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const error = searchParams.get("error");

  useEffect(() => {
    if (error) {
      console.error("Authentication error:", error);
      router.push(`/login?error=${error}`);
      return;
    }

    if (token) {
      // Store the token
      localStorage.setItem("token", token);
      
      // Redirect to home page
      router.push("/");
    } else {
      router.push("/login?error=No token received");
    }
  }, [token, error, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
        <h1 className="text-2xl font-semibold mb-2">Completing Authentication</h1>
        <p className="text-gray-500">Please wait while we log you in...</p>
      </div>
    </div>
  );
} 