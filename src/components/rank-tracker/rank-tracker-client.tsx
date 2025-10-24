"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Loader2, Search, Sparkles, BarChart } from "lucide-react";

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
import { trackKeywordRanks, type TrackKeywordRanksOutput } from "@/ai/flows/track-keyword-ranks";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const formSchema = z.object({
  topic: z.string().min(2, { message: "A topic is required." }),
  url: z.string().url({ message: "A valid URL is required." }),
});

type FormValues = z.infer<typeof formSchema>;

export default function RankTrackerClient() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);
  const [results, setResults] = React.useState<TrackKeywordRanksOutput | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: "",
      url: "",
    },
  });

  async function onSubmit(data: FormValues) {
    setIsLoading(true);
    setResults(null);
    try {
      const result = await trackKeywordRanks(data);
      if (result) {
        setResults(result);
        toast({
          title: "Success!",
          description: `Generated rank tracking report for "${data.topic}".`,
        });
      } else {
        throw new Error("Failed to get rank tracking data. The output was empty.");
      }
    } catch (error) {
      console.error("Error getting rank tracking data:", error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description:
          "There was a problem getting your rank tracking report. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const getRankColor = (rank: number | string) => {
    if (typeof rank !== 'number') return 'bg-gray-500';
    if (rank <= 3) return 'bg-green-500';
    if (rank <= 10) return 'bg-blue-500';
    if (rank <= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  }

  return (
    <div className="space-y-8">
      <header className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Rank Tracker</h1>
        <p className="text-muted-foreground">
          Monitor your keyword rankings over time with simulated data. Real-time rank tracking is coming soon! Your support will help us launch it faster.
        </p>
      </header>

      <Card>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader>
              <CardTitle>Track Rankings</CardTitle>
              <CardDescription>
                Enter a topic and a URL to generate a simulated ranking report.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="topic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Topic / Main Keyword</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 'Next.js 15'" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com" {...field} />
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
                  <Search className="mr-2 h-4 w-4" />
                )}
                Track Keywords
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
        <Card>
            <CardHeader>
                <CardTitle>Ranking Report for "{form.getValues('topic')}"</CardTitle>
                <CardDescription>Simulated ranking data for {form.getValues('url')}</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Keyword</TableHead>
                            <TableHead className="text-center">Current Rank</TableHead>
                            <TableHead className="text-center">Best Rank</TableHead>
                            <TableHead>Monthly Searches</TableHead>
                            <TableHead>Competition</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {results.rankedKeywords.map((kw, index) => (
                            <TableRow key={index}>
                                <TableCell className="font-medium">{kw.keyword}</TableCell>
                                <TableCell className="text-center">
                                  <Badge style={{ backgroundColor: getRankColor(kw.rank) }} className="text-primary-foreground">
                                    {kw.rank}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-center">{kw.bestRank}</TableCell>
                                <TableCell>{kw.monthlySearches.toLocaleString()}</TableCell>
                                <TableCell>
                                    <Badge variant={kw.competition === 'low' ? 'secondary' : kw.competition === 'medium' ? 'default' : 'destructive'}>{kw.competition}</Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
      )}

      {!isLoading && !results && (
        <Card className="flex flex-col items-center justify-center p-12 text-center">
          <div className="mb-4 rounded-full bg-secondary p-4">
            <BarChart className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-xl">Track your ranking progress</CardTitle>
          <CardDescription className="mt-2 max-w-sm">
            Enter a topic and your URL to see how you (might) stack up against the competition on Google.
          </CardDescription>
        </Card>
      )}
    </div>
  );
}
