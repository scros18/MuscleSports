"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2, Mail } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, login } = useAuth();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error" | "already-verified">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("No verification token provided.");
      return;
    }

    // Verify the email
    fetch(`/api/auth/verify-email?token=${token}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setStatus("error");
          setMessage(data.error);
        } else if (data.alreadyVerified) {
          setStatus("already-verified");
          setMessage("Your email is already verified!");
        } else {
          setStatus("success");
          setMessage("Email verified successfully!");
          
          // Auto-login with the provided token
          if (data.token) {
            localStorage.setItem("auth_token", data.token);
            // Redirect to account page after 2 seconds
            setTimeout(() => {
              window.location.href = "/account";
            }, 2000);
          }
        }
      })
      .catch((error) => {
        console.error("Verification error:", error);
        setStatus("error");
        setMessage("An error occurred during verification. Please try again.");
      });
  }, [token, router]);

  return (
    <div className="container py-16 min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full">
        <Card>
          <CardHeader className="text-center">
            {status === "loading" && (
              <>
                <div className="mx-auto mb-4">
                  <Loader2 className="h-16 w-16 text-primary animate-spin" />
                </div>
                <CardTitle>Verifying Your Email</CardTitle>
                <CardDescription>Please wait while we verify your email address...</CardDescription>
              </>
            )}

            {status === "success" && (
              <>
                <div className="mx-auto mb-4 bg-green-100 dark:bg-green-950 rounded-full p-4">
                  <CheckCircle className="h-16 w-16 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle className="text-green-600 dark:text-green-400">Email Verified!</CardTitle>
                <CardDescription>{message}</CardDescription>
              </>
            )}

            {status === "already-verified" && (
              <>
                <div className="mx-auto mb-4 bg-blue-100 dark:bg-blue-950 rounded-full p-4">
                  <CheckCircle className="h-16 w-16 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle className="text-blue-600 dark:text-blue-400">Already Verified</CardTitle>
                <CardDescription>{message}</CardDescription>
              </>
            )}

            {status === "error" && (
              <>
                <div className="mx-auto mb-4 bg-red-100 dark:bg-red-950 rounded-full p-4">
                  <XCircle className="h-16 w-16 text-red-600 dark:text-red-400" />
                </div>
                <CardTitle className="text-red-600 dark:text-red-400">Verification Failed</CardTitle>
                <CardDescription>{message}</CardDescription>
              </>
            )}
          </CardHeader>

          <CardContent className="space-y-4">
            {status === "success" && (
              <div className="text-center space-y-4">
                <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">
                    🎁 Welcome Bonus!
                  </h3>
                  <p className="text-sm text-green-700 dark:text-green-300 mb-2">
                    Use code <span className="font-bold text-lg">WELCOME10</span> for 10% off your first order!
                  </p>
                </div>
                <p className="text-sm text-muted-foreground">
                  Redirecting you to your account...
                </p>
              </div>
            )}

            {status === "already-verified" && (
              <div className="space-y-3">
                <Link href="/login">
                  <Button className="w-full">
                    Go to Login
                  </Button>
                </Link>
                <Link href="/products">
                  <Button variant="outline" className="w-full">
                    Browse Products
                  </Button>
                </Link>
              </div>
            )}

            {status === "error" && (
              <div className="space-y-3">
                <p className="text-sm text-center text-muted-foreground">
                  Your verification link may have expired or is invalid.
                </p>
                <Link href="/register">
                  <Button variant="outline" className="w-full">
                    Register Again
                  </Button>
                </Link>
                <Link href="/login">
                  <Button variant="ghost" className="w-full">
                    Back to Login
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

