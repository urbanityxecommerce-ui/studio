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
      question: "How do I get a YouTube API Key?",
      answer: "You can get a YouTube Data API v3 key from the Google Cloud Console. You will need to create a project, enable the 'YouTube Data API v3' service, and then create credentials to get an API key. Make sure the key has the correct permissions to access YouTube data.",
    },
    {
        question: "Why does the Competitor Analysis feature say my API key is invalid?",
        answer: "This can happen for a few reasons: the key might be incorrect, it might not have the YouTube Data API v3 enabled, or its daily quota might be exceeded. Please double-check your key and its settings in the Google Cloud Console."
    },
    {
      question: "Is the Rank Tracker data real-time?",
      answer: "No, the Rank Tracker currently provides a realistic simulation of ranking data. Since accessing live Google search results is complex, this feature is designed to give you a powerful example of a rank report. We are working on launching real-time tracking soon!",
    },
    {
      question: "Where can I suggest a new feature?",
      answer: "We'd love to hear your ideas! Please use the 'Feedback' page, accessible from the bottom of the sidebar navigation, to send us your suggestions via WhatsApp or Email.",
    },
    {
        question: "Why do the AI-generated ideas sometimes feel generic?",
        answer: "The quality of AI generation depends heavily on the input you provide. Try to be as specific as possible with the category, subcategory, and target audience to get more unique and tailored content ideas."
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
