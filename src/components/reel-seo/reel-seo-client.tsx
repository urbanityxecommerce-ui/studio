"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Loader2, Sparkles, Copy, Film } from "lucide-react";

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
import { generateReelCaptions, type GenerateReelCaptionsOutput } from "@/ai/flows/generate-reel-captions";
import { Textarea } from "../ui/textarea";

const formSchema = z.object({
  topic: z.string().min(2, { message: "A topic is required." }),
});

type FormValues = z.infer<typeof formSchema>;

export default function ReelSeoClient() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);
  const [results, setResults] = React.useState<GenerateReelCaptionsOutput | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: "",
    },
  });

  async function onSubmit(data: FormValues) {
    setIsLoading(true);
    setResults(null);
    try {
      const result = await generateReelCaptions(data);
      if (result) {
        setResults(result);
        toast({
          title: "Captions Generated!",
          description: `Successfully generated captions for your Reel.`,
        });
      } else {
        throw new Error("Failed to generate captions. The output was empty.");
      }
    } catch (error) {
      console.error("Error generating captions:", error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description:
          "There was a problem generating captions. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard!",
      description: "The caption has been copied to your clipboard.",
    });
  };

  return (
    <div className="space-y-8">
      <header className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Reel SEO</h1>
        <p className="text-muted-foreground">
          Generate engaging captions for your Instagram Reels.
        </p>
      </header>

      <Card>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader>
              <CardTitle>Caption Generator</CardTitle>
              <CardDescription>
                Enter the topic of your Reel to generate creative captions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="topic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reel Topic</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 'A day in my life'" {...field} />
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
                  <Sparkles className="mr-2 h-4 w-4" />
                )}
                Generate Captions
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      {isLoading && (
        <div className="flex items-center justify-center rounded-lg border p-12">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      )}

      {results && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {results.captions.map((result, i) => (
            <Card key={i}>
                <CardHeader>
                    <CardTitle>Caption Idea {i + 1}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Textarea readOnly value={result.caption} className="h-32 resize-none" />
                    <p className="text-sm font-medium">CTA: <span className="font-normal text-muted-foreground">{result.cta}</span></p>
                </CardContent>
                <CardFooter>
                    <Button variant="outline" size="sm" onClick={() => copyToClipboard(`${result.caption}\n\n${result.cta}`)}>
                        <Copy className="mr-2 h-4 w-4" />
                        Copy
                    </Button>
                </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {!isLoading && !results && (
        <Card className="flex flex-col items-center justify-center p-12 text-center">
          <div className="mb-4 rounded-full bg-secondary p-4">
            <Film className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-xl">Boost your Reel's engagement</CardTitle>
          <CardDescription className="mt-2 max-w-sm">
            Enter a topic to generate captivating captions with compelling calls-to-action that will make your Instagram Reels go viral.
          </CardDescription>
        </Card>
      )}
    </div>
  );
}
