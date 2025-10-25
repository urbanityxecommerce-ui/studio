
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
type Idea = GenerateContentIdeasOutput["ideas"][0];

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

  const downloadJSON = (data: Idea[]) => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(data, null, 2)
    )}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = "content-ideas.json";
    link.click();
    toast({ title: "JSON Exported", description: "Your ideas have been downloaded." });
  };

  const escapeCsvCell = (cell: string | string[] | number | null | undefined) => {
    if (cell === null || cell === undefined) {
      return '';
    }
    if (typeof cell === 'number') {
      return cell.toString();
    }
    const cellValue = Array.isArray(cell) ? cell.join('; ') : cell;
    let escaped = cellValue.replace(/"/g, '""');
    if (escaped.includes(',') || escaped.includes('\n') || escaped.includes('"')) {
      escaped = `"${escaped}"`;
    }
    return escaped;
  };
  
  const downloadCSV = (data: Idea[]) => {
    const headers = [
      "Title", "Viral Hook", "Short Description", "Repurpose Suggestion", "Difficulty Score",
      "SEO Title 1", "SEO Title 2", "SEO Title 3", "SEO Title 4", "SEO Title 5",
      "Thumbnail Concept 1", "Thumbnail Concept 2", "Thumbnail Concept 3",
      "Structure Point 1", "Structure Point 2", "Structure Point 3",
      "Tags"
    ];

    const rows = data.map(idea => [
      escapeCsvCell(idea.title),
      escapeCsvCell(idea.viralHook),
      escapeCsvCell(idea.shortDescription),
      escapeCsvCell(idea.repurposeSuggestion),
      escapeCsvCell(idea.difficultyScore),
      escapeCsvCell(idea.seoTitleVariations[0]),
      escapeCsvCell(idea.seoTitleVariations[1]),
      escapeCsvCell(idea.seoTitleVariations[2]),
      escapeCsvCell(idea.seoTitleVariations[3]),
      escapeCsvCell(idea.seoTitleVariations[4]),
      escapeCsvCell(idea.thumbnailConcepts[0]),
      escapeCsvCell(idea.thumbnailConcepts[1]),
      escapeCsvCell(idea.thumbnailConcepts[2]),
      escapeCsvCell(idea.timestampedStructurePoints[0]),
      escapeCsvCell(idea.timestampedStructurePoints[1]),
      escapeCsvCell(idea.timestampedStructurePoints[2]),
      escapeCsvCell(idea.tags.join(', ')),
    ]);

    const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "content-ideas.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({ title: "CSV Exported", description: "Your ideas have been downloaded." });
  };

  const handleFeatureComingSoon = () => {
    toast({
      title: "Feature Coming Soon!",
      description: "This feature is under construction. Stay tuned!",
    });
  };

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
                        <SelectItem value="Food & Cooking">Food & Cooking</SelectItem>
                        <SelectItem value="Travel">Travel</SelectItem>
                        <SelectItem value="Health & Fitness">Health & Fitness</SelectItem>
                        <SelectItem value="Education">Education</SelectItem>
                        <SelectItem value="DIY & Crafts">DIY & Crafts</SelectItem>
                        <SelectItem value="Fashion">Fashion</SelectItem>
                        <SelectItem value="Music">Music</SelectItem>
                        <SelectItem value="Movies & TV Shows">Movies & TV Shows</SelectItem>
                        <SelectItem value="Books & Writing">Books & Writing</SelectItem>
                        <SelectItem value="Business & Entrepreneurship">Business & Entrepreneurship</SelectItem>
                        <SelectItem value="Science">Science</SelectItem>
                        <SelectItem value="History & Culture">History & Culture</SelectItem>
                        <SelectItem value="Cars & Vehicles">Cars & Vehicles</SelectItem>
                        <SelectItem value="Sports">Sports</SelectItem>
                        <SelectItem value="Pets & Animals">Pets & Animals</SelectItem>
                        <SelectItem value="Parenting & Family">Parenting & Family</SelectItem>
                        <SelectItem value="Home & Garden">Home & Garden</SelectItem>
                        <SelectItem value="Comedy">Comedy</SelectItem>
                        <SelectItem value="Vlogging">Vlogging</SelectItem>
                        <SelectItem value="Dark Psychology">Dark Psychology</SelectItem>
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
                    <FormLabel>Target Audience</FormLabel>
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
              <Button variant="outline" size="sm" onClick={() => downloadCSV(ideas)}>
                <Download className="mr-2 h-4 w-4" /> CSV
              </Button>
              <Button variant="outline" size="sm" onClick={() => downloadJSON(ideas)}>
                <FileJson className="mr-2 h-4 w-4" /> JSON
              </Button>
              <Button variant="outline" size="sm" onClick={handleFeatureComingSoon}>
                <CalendarPlus className="mr-2 h-4 w-4" /> Calendar
              </Button>
              <Button variant="outline" size="sm" onClick={handleFeatureComingSoon}>
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
