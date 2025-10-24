"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Loader2, Search, Sparkles } from "lucide-react";

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
import { searchKeywords, type SearchKeywordsOutput } from "@/ai/flows/search-keywords";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const formSchema = z.object({
  topic: z.string().min(2, { message: "A topic is required." }),
});

type FormValues = z.infer<typeof formSchema>;

export default function KeywordResearchClient() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);
  const [results, setResults] = React.useState<SearchKeywordsOutput | null>(null);

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
      const result = await searchKeywords(data);
      if (result) {
        setResults(result);
        toast({
          title: "Success!",
          description: `Found keyword research for "${data.topic}".`,
        });
      } else {
        throw new Error("Failed to get keyword research. The output was empty.");
      }
    } catch (error) {
      console.error("Error getting keyword research:", error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description:
          "There was a problem getting keyword research. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }
  
  const getDifficultyColor = (difficulty: 'low' | 'medium' | 'high') => {
    switch (difficulty) {
        case 'low':
            return 'bg-green-500';
        case 'medium':
            return 'bg-yellow-500';
        case 'high':
            return 'bg-red-500';
        default:
            return 'bg-gray-500';
    }
  };


  return (
    <div className="space-y-8">
      <header className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Keyword Research</h1>
        <p className="text-muted-foreground">
          Find the best keywords for your content.
        </p>
      </header>

      <Card>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader>
              <CardTitle>Keyword Finder</CardTitle>
              <CardDescription>
                Enter a topic to find related keywords, their search volume, and difficulty.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="topic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Topic</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 'Next.js 15'" {...field} />
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
                Search Keywords
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
                <CardTitle>Keyword Results for "{form.getValues('topic')}"</CardTitle>
                <CardDescription>Here are the keywords related to your topic.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Keyword</TableHead>
                            <TableHead>Monthly Searches</TableHead>
                            <TableHead>Competition</TableHead>
                            <TableHead>Difficulty</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {results.keywords.map((kw, index) => (
                            <TableRow key={index}>
                                <TableCell className="font-medium">{kw.keyword}</TableCell>
                                <TableCell>{kw.monthlySearches.toLocaleString()}</TableCell>
                                <TableCell>{kw.competition}</TableCell>
                                <TableCell>
                                    <Badge variant={kw.difficulty === 'low' ? 'secondary' : kw.difficulty === 'medium' ? 'default' : 'destructive'}>{kw.difficulty}</Badge>
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
            <Sparkles className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-xl">Find your winning keywords</CardTitle>
          <CardDescription className="mt-2 max-w-sm">
            Enter a topic above to discover valuable keywords, search volume, and competition insights to guide your content strategy.
          </CardDescription>
        </Card>
      )}
    </div>
  );
}
