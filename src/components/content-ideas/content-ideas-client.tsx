"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  CalendarPlus,
  Copy,
  Download,
  FileJson,
  Lightbulb,
  Loader2,
  PlusSquare,
  Sparkles,
} from "lucide-react";

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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import {
  generateContentIdeas,
  type GenerateContentIdeasOutput,
} from "@/ai/flows/generate-content-ideas";
import IdeaCard from "./idea-card";
import { Accordion } from "@/components/ui/accordion";
import IdeaCardSkeleton from "./idea-card-skeleton";

const formSchema = z.object({
  category: z.string().min(2, { message: "Category is required." }),
  subcategory: z.string().min(2, { message: "Subcategory is required." }),
  targetAudience: z
    .string()
    .min(2, { message: "Target audience is required." }),
  language: z.string().min(2, { message: "Language is required." }),
  preferredFormat: z.enum(["short", "long"]),
  tone: z.string().min(2, { message: "Tone is required." }),
});

type FormValues = z.infer<typeof formSchema>;

export default function ContentIdeasClient() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);
  const [ideas, setIdeas] =
    React.useState<GenerateContentIdeasOutput["ideas"] | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: "Tech",
      subcategory: "Smartphones",
      targetAudience: "Beginners",
      language: "English",
      preferredFormat: "short",
      tone: "Friendly",
    },
  });

  async function onSubmit(data: FormValues) {
    setIsLoading(true);
    setIdeas(null);
    try {
      const result = await generateContentIdeas(data);
      if (result && result.ideas) {
        setIdeas(result.ideas);
        toast({
          title: "Success!",
          description: `Generated ${result.ideas.length} new content ideas.`,
        });
      } else {
        throw new Error("Failed to generate ideas. The output was empty.");
      }
    } catch (error) {
      console.error("Error generating content ideas:", error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description:
          "There was a problem generating your content ideas. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <header className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Content Ideas</h1>
        <p className="text-muted-foreground">
          Generate viral content ideas with the power of AI.
        </p>
      </header>

      <Card>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader>
              <CardTitle>Idea Generator</CardTitle>
              <CardDescription>
                Fill in the details below to generate 5 unique content ideas.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Tech">Tech</SelectItem>
                        <SelectItem value="Beauty">Beauty</SelectItem>
                        <SelectItem value="Finance">Finance</SelectItem>
                        <SelectItem value="Gaming">Gaming</SelectItem>
                        <SelectItem value="Lifestyle">Lifestyle</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="subcategory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subcategory</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Smartphones" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="targetAudience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target Audience</FormLabel>sever
                    <FormControl>
                      <Input placeholder="e.g., Beginners" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="language"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Language</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a language" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="English">English</SelectItem>
                        <SelectItem value="Spanish">Spanish</SelectItem>
                        <SelectItem value="Hindi">Hindi</SelectItem>
                        <SelectItem value="French">French</SelectItem>
                        <SelectItem value="German">German</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tone</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Friendly, Professional" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="preferredFormat"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Preferred Format</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex items-center space-x-4"
                      >
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="short" />
                          </FormControl>
                          <FormLabel className="font-normal">Short</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="long" />
                          </FormControl>
                          <FormLabel className="font-normal">Long</FormLabel>
                        </FormItem>
                      </RadioGroup>
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
                Generate Ideas
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      {isLoading && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Generating Ideas...</h2>
          </div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <IdeaCardSkeleton key={i} />
            ))}
          </div>
        </div>
      )}

      {ideas && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-2xl font-bold">{ideas.length} Ideas Generated</h2>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" /> CSV
              </Button>
              <Button variant="outline" size="sm">
                <FileJson className="mr-2 h-4 w-4" /> JSON
              </Button>
              <Button variant="outline" size="sm">
                <CalendarPlus className="mr-2 h-4 w-4" /> Calendar
              </Button>
              <Button variant="outline" size="sm">
                <PlusSquare className="mr-2 h-4 w-4" /> Planner
              </Button>
            </div>
          </div>
          <Accordion type="multiple" className="space-y-4">
            {ideas.map((idea, index) => (
              <IdeaCard key={index} idea={idea} />
            ))}
          </Accordion>
        </div>
      )}

      {!isLoading && !ideas && (
        <Card className="flex flex-col items-center justify-center p-12 text-center">
          <div className="mb-4 rounded-full bg-secondary p-4">
            <Lightbulb className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-xl">Let's create some magic!</CardTitle>
          <CardDescription className="mt-2 max-w-sm">
            Your next viral video is just a few clicks away. Fill out the form
            above to generate your personalized content ideas.
          </CardDescription>
        </Card>
      )}
    </div>
  );
}
