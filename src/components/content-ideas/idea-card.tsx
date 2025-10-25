import type { GenerateContentIdeasOutput } from "@/ai/flows/generate-content-ideas";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Camera,
  Film,
  Hash,
  List,
  PenSquare,
  Repeat,
  Text,
  ThumbsUp,
  Timer,
  Copy,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "../ui/button";

type Idea = GenerateContentIdeasOutput["ideas"][0];

interface IdeaCardProps {
  idea: Idea;
}

export default function IdeaCard({ idea }: IdeaCardProps) {
  const { toast } = useToast();

  const getDifficultyInfo = (
    score: number
  ): { variant: "secondary" | "default" | "destructive"; text: string } => {
    if (score <= 3) return { variant: "secondary", text: "Easy" };
    if (score <= 7) return { variant: "default", text: "Medium" };
    return { variant: "destructive", text: "Hard" };
  };

  const difficulty = getDifficultyInfo(idea.difficultyScore);

  const copyTags = () => {
    navigator.clipboard.writeText(idea.tags.map(tag => tag.toLowerCase()).join(","));
    toast({
      title: "Tags Copied!",
      description: "The tags have been copied to your clipboard.",
    });
  };

  return (
    <AccordionItem value={idea.title} asChild>
      <Card className="overflow-hidden">
        <AccordionTrigger className="p-6 text-left hover:no-underline">
          <div className="flex w-full items-center justify-between gap-4">
            <span className="flex-1 font-medium">{idea.title}</span>
            <Badge variant={difficulty.variant} className="whitespace-nowrap">
              {difficulty.text}
            </Badge>
          </div>
        </AccordionTrigger>
        <AccordionContent className="p-6 pt-0">
          <Separator className="mb-6" />
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-6">
              <Section icon={ThumbsUp} title="Viral Hook">
                <p className="text-muted-foreground">{idea.viralHook}</p>
              </Section>
              <Section icon={Text} title="Short Description">
                <p className="text-muted-foreground">{idea.shortDescription}</p>
              </Section>
              <Section icon={Repeat} title="Repurpose Suggestion">
                <p className="text-muted-foreground">{idea.repurposeSuggestion}</p>
              </Section>
            </div>
            <div className="space-y-6">
              <Section icon={PenSquare} title="SEO Title Variations">
                <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
                  {idea.seoTitleVariations.map((title, i) => (
                    <li key={i}>{title}</li>
                  ))}
                </ul>
              </Section>
              <Section icon={Camera} title="Thumbnail Concepts">
                <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
                  {idea.thumbnailConcepts.map((concept, i) => (
                    <li key={i}>{concept}</li>
                  ))}
                </ul>
              </Section>
            </div>
          </div>
          <Separator className="my-6" />
          <div className="grid gap-6 md:grid-cols-2">
            <Section icon={List} title="Timestamped Structure">
              <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
                {idea.timestampedStructurePoints.map((point, i) => (
                  <li key={i}>{point}</li>
                ))}
              </ul>
            </Section>
            <Section icon={Hash} title="Tags / Hashtags">
              <div className="flex flex-col gap-2">
                <div className="flex flex-wrap gap-2">
                  {idea.tags.map((tag, i) => (
                    <Badge key={i} variant="outline" className="cursor-pointer" onClick={() => {
                      navigator.clipboard.writeText(tag);
                      toast({ title: "Tag Copied!", description: `"${tag}" copied to clipboard.`});
                    }}>
                      {tag}
                    </Badge>
                  ))}
                </div>
                <Button variant="ghost" size="sm" onClick={copyTags} className="mt-2 justify-start px-0 w-fit">
                  <Copy className="mr-2 h-4 w-4" />
                  Copy all tags
                </Button>
              </div>
            </Section>
          </div>
        </AccordionContent>
      </Card>
    </AccordionItem>
  );
}

function Section({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <h3 className="flex items-center gap-2 font-semibold">
        <Icon className="h-4 w-4 text-primary" />
        {title}
      </h3>
      {children}
    </div>
  );
}
