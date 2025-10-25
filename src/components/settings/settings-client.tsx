
"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Loader2, KeyRound, Save, User, Palette, CreditCard, ShieldAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { sendPasswordResetEmail } from "firebase/auth";
import { doc } from "firebase/firestore";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import Link from "next/link";
import { useAuth, useDoc, useFirestore, useMemoFirebase, useUser } from "@/firebase";
import { Skeleton } from "../ui/skeleton";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { useTheme } from "next-themes";
import { updateDocumentNonBlocking } from "@/firebase/non-blocking-updates";

const YOUTUBE_API_KEY_STORAGE_KEY = "youtube_api_key";

const profileFormSchema = z.object({
  firstName: z.string().min(2, { message: "First name must be at least 2 characters." }),
  lastName: z.string().min(2, { message: "Last name must be at least 2 characters." }),
});

const apiKeyFormSchema = z.object({
  youtubeApiKey: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;
type ApiKeyFormValues = z.infer<typeof apiKeyFormSchema>;

export default function SettingsClient() {
  const { toast } = useToast();
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  const [isProfileLoading, setIsProfileLoading] = React.useState(false);
  const [isApiKeyLoading, setIsApiKeyLoading] = React.useState(false);
  const [isPasswordResetLoading, setIsPasswordResetLoading] = React.useState(false);

  const userDocRef = useMemoFirebase(() => (user ? doc(firestore, 'users', user.uid) : null), [firestore, user]);
  const { data: userData, isLoading: isUserDataLoading } = useDoc<{ plan?: string; firstName?: string; lastName?: string }>(userDocRef);

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
    },
  });

  const apiKeyForm = useForm<ApiKeyFormValues>({
    resolver: zodResolver(apiKeyFormSchema),
    defaultValues: {
      youtubeApiKey: "",
    },
  });

  React.useEffect(() => {
    if (userData) {
      profileForm.setValue("firstName", userData.firstName || '');
      profileForm.setValue("lastName", userData.lastName || '');
    }
  }, [userData, profileForm]);

  React.useEffect(() => {
    const storedApiKey = localStorage.getItem(YOUTUBE_API_KEY_STORAGE_KEY);
    if (storedApiKey) {
      apiKeyForm.setValue("youtubeApiKey", storedApiKey);
    }
  }, [apiKeyForm]);

  async function onProfileSubmit(data: ProfileFormValues) {
    if (!user || !firestore) return;
    setIsProfileLoading(true);
    try {
      const userDoc = doc(firestore, 'users', user.uid);
      updateDocumentNonBlocking(userDoc, {
        firstName: data.firstName,
        lastName: data.lastName,
      });
      toast({
        title: "Profile Updated!",
        description: "Your name has been successfully updated.",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({ variant: "destructive", title: "Update Failed", description: "Could not update your profile." });
    } finally {
      setIsProfileLoading(false);
    }
  }

  function onApiKeySubmit(data: ApiKeyFormValues) {
    setIsApiKeyLoading(true);
    try {
      if (data.youtubeApiKey) {
        localStorage.setItem(YOUTUBE_API_KEY_STORAGE_KEY, data.youtubeApiKey);
        toast({
          title: "Settings Saved!",
          description: "Your YouTube API Key has been saved locally.",
        });
      } else {
        localStorage.removeItem(YOUTUBE_API_KEY_STORAGE_KEY);
        toast({
          title: "Settings Cleared!",
          description: "Your YouTube API Key has been removed.",
        });
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      toast({ variant: "destructive", title: "Save Failed", description: "There was a problem saving your settings." });
    } finally {
      setIsApiKeyLoading(false);
    }
  }

  async function handleChangePassword() {
    if (!user?.email) return;
    setIsPasswordResetLoading(true);
    try {
        await sendPasswordResetEmail(auth, user.email);
        toast({
            title: "Password Reset Email Sent",
            description: `A password reset link has been sent to ${user.email}.`,
        });
    } catch (error) {
        console.error("Error sending password reset email:", error);
        toast({ variant: "destructive", title: "Error", description: "Could not send password reset email." });
    } finally {
      setIsPasswordResetLoading(false);
    }
  }

  if (isUserLoading || isUserDataLoading) {
    return (
      <div className="space-y-8">
        <header className="space-y-1">
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-5 w-72" />
        </header>
        <Card>
          <CardHeader><Skeleton className="h-7 w-32" /></CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
          <CardFooter><Skeleton className="h-10 w-24" /></CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account, preferences, and application settings.
        </p>
      </header>

      {/* Profile Settings */}
      <Card>
        <Form {...profileForm}>
          <form onSubmit={profileForm.handleSubmit(onProfileSubmit)}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><User /> Profile</CardTitle>
              <CardDescription>Manage your personal information.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={profileForm.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl><Input placeholder="John" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={profileForm.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl><Input placeholder="Doe" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isProfileLoading}>
                {isProfileLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                Save Changes
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
      
      {/* Theme Settings */}
      <Card>
          <CardHeader>
              <CardTitle className="flex items-center gap-2"><Palette /> Theme</CardTitle>
              <CardDescription>Customize the look and feel of the application.</CardDescription>
          </CardHeader>
          <CardContent>
              <div className="flex items-center space-x-2">
                  <Switch id="theme-mode" checked={theme === 'dark'} onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')} />
                  <Label htmlFor="theme-mode">Dark Mode</Label>
              </div>
          </CardContent>
      </Card>

      {/* Subscription Settings */}
      <Card>
          <CardHeader>
              <CardTitle className="flex items-center gap-2"><CreditCard /> Subscription</CardTitle>
              <CardDescription>Manage your current plan and billing details.</CardDescription>
          </CardHeader>
          <CardContent>
              <p>Your current plan: <span className="font-semibold capitalize">{userData?.plan || 'Free'}</span></p>
          </CardContent>
           <CardFooter>
              <Button asChild>
                  <Link href="/upgrade">
                    {userData?.plan === 'pro' ? 'Manage Subscription' : 'Upgrade to Pro'}
                  </Link>
              </Button>
            </CardFooter>
      </Card>

      {/* Security Settings */}
      <Card>
          <CardHeader>
              <CardTitle className="flex items-center gap-2"><ShieldAlert /> Security</CardTitle>
              <CardDescription>Manage your account security settings.</CardDescription>
          </CardHeader>
          <CardContent>
              <Button onClick={handleChangePassword} disabled={isPasswordResetLoading}>
                  {isPasswordResetLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <KeyRound className="mr-2 h-4 w-4" />}
                  Change Password
              </Button>
               <p className="text-sm text-muted-foreground mt-2">A password reset link will be sent to your email address. If you don't see it, please check your spam folder.</p>
          </CardContent>
      </Card>


      {/* API Key Settings */}
       <Alert>
        <KeyRound />
        <AlertTitle>Where to get a YouTube API Key?</AlertTitle>
        <AlertDescription>
            The Competitor Analysis feature requires a YouTube Data API key to fetch public data about channels and videos. You can get a free API key from the Google Cloud Console. Follow the official guide {" "}
            <Link href="https://developers.google.com/youtube/v3/getting-started" target="_blank" rel="noopener noreferrer" className="font-medium text-primary underline">
                here
            </Link>.
        </AlertDescription>
      </Alert>

      <Card>
        <Form {...apiKeyForm}>
          <form onSubmit={apiKeyForm.handleSubmit(onApiKeySubmit)}>
            <CardHeader>
              <CardTitle>API Keys</CardTitle>
              <CardDescription>
                Manage your API keys for external services. Your keys are stored locally in your browser and are not shared. For the YouTube API key to work, you must also set it as a secret in your environment called YOUTUBE_API_KEY.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={apiKeyForm.control}
                name="youtubeApiKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>YouTube API Key</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your YouTube API Key" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isApiKeyLoading}>
                {isApiKeyLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                Save API Key
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
