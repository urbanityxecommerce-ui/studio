"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Loader2, Sparkles, Image as ImageIcon, Upload } from "lucide-react";
import Image from "next/image";

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
import { optimizeVideoThumbnails, type OptimizeVideoThumbnailsOutput } from "@/ai/flows/optimize-video-thumbnails";
import { Progress } from "../ui/progress";

const formSchema = z.object({
  videoTitle: z.string().min(2, { message: "A video title is required." }),
  thumbnail: z.custom<File>((v) => v instanceof File, {
    message: "A thumbnail image is required.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

export default function ThumbnailOptimizerClient() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);
  const [results, setResults] = React.useState<OptimizeVideoThumbnailsOutput | null>(null);
  const [preview, setPreview] = React.useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      videoTitle: "",
    },
  });
  
  const thumbnailRef = form.register("thumbnail");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      form.setValue("thumbnail", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const toBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
  });

  async function onSubmit(data: FormValues) {
    setIsLoading(true);
    setResults(null);
    try {
        const thumbnailDataUri = await toBase64(data.thumbnail);
        const result = await optimizeVideoThumbnails({ ...data, thumbnailDataUri });
        if (result) {
            setResults(result);
            toast({
            title: "Analysis Complete!",
            description: `Successfully analyzed your thumbnail.`,
            });
        } else {
            throw new Error("Failed to analyze thumbnail. The output was empty.");
        }
    } catch (error) {
      console.error("Error analyzing thumbnail:", error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description:
          "There was a problem analyzing your thumbnail. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <header className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Thumbnail Optimizer</h1>
        <p className="text-muted-foreground">
          Get AI-powered suggestions to improve your thumbnail's click-through rate.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <Card>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardHeader>
                <CardTitle>Upload Thumbnail</CardTitle>
                <CardDescription>
                  Upload your video thumbnail and title to get started.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                 <FormItem>
                  <FormLabel>Thumbnail</FormLabel>
                  <FormControl>
                    <div className="relative flex cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-muted bg-card p-8 hover:bg-muted/50">
                        {preview ? (
                             <Image src={preview} alt="Thumbnail preview" width={320} height={180} className="rounded-md object-cover" />
                        ) : (
                            <div className="text-center">
                                <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                                <p className="mt-2 text-sm text-muted-foreground">
                                Click to upload or drag and drop
                                </p>
                                <p className="text-xs text-muted-foreground">PNG, JPG, WEBP (max. 800x400px)</p>
                            </div>
                        )}
                      <Input
                        type="file"
                        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                        accept="image/png, image/jpeg, image/webp"
                        {...thumbnailRef}
                        onChange={handleFileChange}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
                <FormField
                  control={form.control}
                  name="videoTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Video Title</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 'My Awesome Video'" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isLoading || !preview}>
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="mr-2 h-4 w-4" />
                  )}
                  Analyze Thumbnail
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>

        <div className="space-y-6">
            {isLoading && (
                 <div className="flex h-full items-center justify-center rounded-lg border p-12">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                </div>
            )}
            {results && (
                 <Card>
                    <CardHeader>
                        <CardTitle>Analysis Results</CardTitle>
                        <CardDescription>Based on your thumbnail and title.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                         <div>
                            <div className="mb-2 flex justify-between items-center">
                                <h3 className="font-semibold">Predicted CTR Score</h3>
                                <span className="font-bold text-primary">{results.ctrPredictionScore}/100</span>
                            </div>
                            <Progress value={results.ctrPredictionScore} />
                        </div>
                        <div className="space-y-4">
                            <AnalysisItem title="Readability" content={results.readability} />
                            <AnalysisItem title="Subject Prominence" content={results.subjectProminence} />
                            <AnalysisItem title="Facial Close-Ups" content={results.facialCloseUps} />
                            <AnalysisItem title="Contrast" content={results.contrast} />
                            <AnalysisItem title="Clickbait Analysis" content={results.clickbaitAnalysis} />
                        </div>
                        <div>
                            <h3 className="font-semibold mb-2">Actionable Improvements</h3>
                             <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                                {results.actionableImprovements.map((item, i) => <li key={i}>{item}</li>)}
                            </ul>
                        </div>
                    </CardContent>
                </Card>
            )}

             {!isLoading && !results && (
                <Card className="flex h-full flex-col items-center justify-center p-12 text-center">
                    <div className="mb-4 rounded-full bg-secondary p-4">
                        <ImageIcon className="h-12 w-12 text-primary" />
                    </div>
                    <CardTitle className="text-xl">Get feedback on your thumbnail</CardTitle>
                    <CardDescription className="mt-2 max-w-sm">
                        Upload your thumbnail and video title to get AI-powered suggestions for improving your click-through rate.
                    </CardDescription>
                </Card>
             )}
        </div>
      </div>
    </div>
  );
}


function AnalysisItem({title, content}: {title: string, content: string}){
    return (
        <div>
            <h3 className="font-semibold">{title}</h3>
            <p className="text-sm text-muted-foreground">{content}</p>
        </div>
    )
}

