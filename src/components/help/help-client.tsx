"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { HelpCircle } from "lucide-react";


export default function HelpClient() {
  const faqs = [
    {
      question: "What is the Content Ideas feature for?",
      answer: "This is your personal brainstorming partner! Just tell it a topic, who you're trying to reach, and the style you want, and it will generate 5 complete video/content ideas for you, including catchy titles, viral hooks, and even thumbnail concepts.",
    },
    {
        question: "How does Keyword Research work?",
        answer: "Enter any topic, and the AI will provide you with a list of 10 related keywords. It also gives you an estimate of how many people search for that keyword each month and how difficult it might be to rank for, helping you choose the best keywords to target."
    },
    {
      question: "What do I need for the Competitor Analysis feature?",
      answer: "You'll need a link to a competitor's YouTube channel or one of their specific videos. The tool will then analyze their content to show you their top videos, common headline patterns, and suggest ways you can create better content to compete.",
    },
    {
      question: "How does the Thumbnail Optimizer work?",
      answer: "Just upload the thumbnail image you've created and enter your video title. The AI will analyze it based on design principles that lead to higher click-through rates (CTR). It will give you a score and actionable advice on how to improve things like text readability, colors, and subject focus.",
    },
    {
        question: "Is the Rank Tracker data real-time from Google?",
        answer: "Currently, the Rank Tracker provides a realistic *simulation* of ranking data. Since accessing live Google search results is complex and costly, this feature is designed to give you a powerful example of what a rank report looks like. We are working hard on launching real-time tracking soon, and your support helps us get there faster!"
    },
    {
        question: "The AI-generated ideas or captions feel a bit generic. How can I improve them?",
        answer: "The quality of AI generation depends heavily on the quality of your input. To get more unique and tailored results, try to be as specific as possible in the forms. For example, instead of 'Tech' for Content Ideas, try something more specific like 'Beginner tips for iPhone 15 camera'."
    },
    {
      question: "Where can I suggest a new feature or report a problem?",
      answer: "We'd love to hear from you! Please use the 'Feedback' page, accessible from the bottom of the sidebar navigation, to send us your ideas or report any issues. Your feedback is crucial for making the app better.",
    }
  ];

  return (
    <div className="space-y-8">
      <header className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Help & FAQ</h1>
        <p className="text-muted-foreground">
          Find answers to common questions about using the CreatorX SEO toolkit.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
          <CardDescription>
            If you can't find an answer here, please use the Feedback page to contact us.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem value={`item-${index}`} key={index}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      <Card className="flex flex-col items-center justify-center p-12 text-center">
          <div className="mb-4 rounded-full bg-secondary p-4">
            <HelpCircle className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-xl">Still need help?</CardTitle>
          <CardDescription className="mt-2 max-w-sm">
            Don't hesitate to reach out through the Feedback page. We're here to assist you!
          </CardDescription>
        </Card>
    </div>
  );
}
