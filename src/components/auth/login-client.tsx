"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { signInAnonymously } from "firebase/auth";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/firebase";
import { Logo } from "../icons";

export default function LoginClient() {
  const { toast } = useToast();
  const auth = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);

  const setSessionCookie = async (idToken: string) => {
    const response = await fetch('/api/auth/session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ idToken }),
    });

    if (!response.ok) {
      throw new Error('Failed to set session cookie.');
    }
  };

  async function handleAnonymousSignIn() {
    setIsLoading(true);
    try {
      const userCredential = await signInAnonymously(auth);
      const idToken = await userCredential.user.getIdToken();
      await setSessionCookie(idToken);

      toast({
        title: "Login Successful!",
        description: "You are now logged in as a guest.",
      });
      router.push('/');
    } catch (error: any) {
      console.error("Anonymous Sign-In error:", error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: error.message || "There was a problem with your login request.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <div className="mb-4 flex justify-center">
                <Logo />
            </div>
            <CardTitle>Welcome to CreatorX SEO</CardTitle>
            <CardDescription>
              The ultimate SEO toolkit for creators.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
             <Button onClick={handleAnonymousSignIn} className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Enter as Guest
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}