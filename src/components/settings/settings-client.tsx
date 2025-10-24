"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Loader2, KeyRound, Save } from "lucide-react";

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

const YOUTUBE_API_KEY_STORAGE_KEY = "youtube_api_key";

const formSchema = z.object({
  youtubeApiKey: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function SettingsClient() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);
  const [isMounted, setIsMounted] = React.useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      youtubeApiKey: "",
    },
  });

  React.useEffect(() => {
    setIsMounted(true);
    const storedApiKey = localStorage.getItem(YOUTUBE_API_KEY_STORAGE_KEY);
    if (storedApiKey) {
      form.setValue("youtubeApiKey", storedApiKey);
    }
  }, [form]);

  function onSubmit(data: FormValues) {
    setIsLoading(true);
    try {
      if (data.youtubeApiKey) {
        localStorage.setItem(YOUTUBE_API_KEY_STORAGE_KEY, data.youtubeApiKey);
        // This is a client-side only operation for demonstration.
        // In a real app, this should be a secure server call.
        // For the purpose of this tool, we'll set a non-public env var conceptually.
        // But since we can't modify server env at runtime, we rely on localstorage
        // and the flow to read from a secure place.
        // The fix is to ensure the tool reads from `process.env.YOUTUBE_API_KEY`.
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
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description:
          "There was a problem saving your settings. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }
  
  if (!isMounted) {
    return null;
  }

  return (
    <div className="space-y-8">
      <header className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your application settings and API keys.
        </p>
      </header>

       <Alert>
        <KeyRound className="h-4 w-4" />
        <AlertTitle>Where to get a YouTube API Key?</AlertTitle>
        <AlertDescription>
            The Competitor Analysis feature requires a YouTube Data API key to fetch public data about channels and videos. You can get a free API key from the Google Cloud Console. Follow the official guide {" "}
            <Link href="https://developers.google.com/youtube/v3/getting-started" target="_blank" rel="noopener noreferrer" className="font-medium text-primary underline">
                here
            </Link>.
        </AlertDescription>
      </Alert>

      <Card>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader>
              <CardTitle>API Keys</CardTitle>
              <CardDescription>
                Manage your API keys for external services. Your keys are stored locally in your browser and are not shared. For the YouTube API key to work, you must also set it as a secret in your environment called YOUTUBE_API_KEY.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
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
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Save Settings
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
