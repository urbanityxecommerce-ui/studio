"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Loader2, Sparkles, Users } from "lucide-react";

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
import { analyzeCompetitorContent, type AnalyzeCompetitorContentOutput } from "@/ai/flows/analyze-competitor-content";
import { Badge } from "../ui/badge";

const formSchema = z.object({
  competitorChannelOrVideoLink: z.string().url({ message: "Please enter a valid URL." }),
});

type FormValues = z.infer<typeof formSchema>;

export default function CompetitorAnalysisClient() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);
  const [results, setResults] = React.useState<AnalyzeCompetitorContentOutput | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      competitorChannelOrVideoLink: "",
    },
  });

  async function onSubmit(data: FormValues) {
    setIsLoading(true);
    setResults(null);
    try {
      const result = await analyzeCompetitorContent(data);
      if (result) {
        setResults(result);
        toast({
          title: "Analysis Complete!",
          description: `Successfully analyzed the competitor's content.`,
        });
      } else {
        throw new Error("Failed to analyze content. The output was empty.");
      }
    } catch (error) {
      console.error("Error analyzing content:", error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description:
          "There was a problem analyzing the content. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <header className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Competitor Analysis</h1>
        <p className="text-muted-foreground">
          Analyze your competitors to find content gaps and opportunities.
        </p>
      </header>

      <Card>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader>
              <CardTitle>Analyze Competitor</CardTitle>
              <CardDescription>
                Enter a link to a competitor's YouTube or Instagram channel/video.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="competitorChannelOrVideoLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Competitor Link</FormLabel>
                    <FormControl>
                      <Input placeholder="https://www.youtube.com/c/..." {...field} />
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
                Analyze Content
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
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Analysis for "{form.getValues('competitorChannelOrVideoLink')}"</CardTitle>
                    <CardDescription>Here's a breakdown of your competitor's content.</CardDescription>
                </CardHeader>
            </Card>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle>Top Videos</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="list-disc space-y-2 pl-5">
                            {results.topVideos.map((video, i) => <li key={i}>{video}</li>)}
                        </ul>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Headline Patterns</CardTitle>
                    </CardHeader>
                    <CardContent>
                    <ul className="list-disc space-y-2 pl-5">
                            {results.headlinePatterns.map((pattern, i) => <li key={i}>{pattern}</li>)}
                        </ul>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>Common Tags</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-wrap gap-2">
                        {results.commonTags.map((tag, i) => <Badge key={i} variant="secondary">{tag}</Badge>)}
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>Content Gap Opportunities</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="list-disc space-y-2 pl-5">
                            {results.gapOpportunities.map((opp, i) => <li key={i}>{opp}</li>)}
                        </ul>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>Recommended Content Angles</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="list-disc space-y-2 pl-5">
                            {results.contentAngles.map((angle, i) => <li key={i}>{angle}</li>)}
                        </ul>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>Average Watch Time</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{results.averageWatchTime}</p>
                    </CardContent>
                </Card>
            </div>
        </div>
      )}

      {!isLoading && !results && (
        <Card className="flex flex-col items-center justify-center p-12 text-center">
          <div className="mb-4 rounded-full bg-secondary p-4">
            <Users className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-xl">Outsmart your competition</CardTitle>
          <CardDescription className="mt-2 max-w-sm">
            Enter a competitor's link to reveal their content strategy, identify weaknesses, and discover opportunities to outrank them.
          </CardDescription>
        </Card>
      )}
    </div>
  );
}
