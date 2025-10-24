"use client";

import * as React from "react";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
    </svg>
  );

export default function FeedbackClient() {
  const [feedback, setFeedback] = React.useState("");
  const whatsappNumber = "7478802433";
  const email = "biznessindia@gmail.com";

  const handleWhatsAppSend = () => {
    const message = `*App Feedback:*\n\n${feedback}`;
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  const handleEmailSend = () => {
    const subject = "App Feedback / Suggestion";
    const body = `${feedback}`;
    const url = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = url;
  };


  return (
    <div className="space-y-8">
      <header className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Submit Feedback</h1>
        <p className="text-muted-foreground">
          Have an idea for a new feature or an improvement? We'd love to hear it!
        </p>
      </header>

      <Card>
            <CardHeader>
              <CardTitle>Your Suggestion</CardTitle>
              <CardDescription>
                Describe your idea below and send it to us via WhatsApp or Email.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="feedback">Feedback</Label>
                    <Textarea
                        id="feedback"
                        name="feedback"
                        placeholder="I have an idea for..."
                        className="min-h-[150px]"
                        required
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                    />
                </div>
            </CardContent>
            <CardFooter className="flex-wrap gap-4">
              <Button onClick={handleWhatsAppSend} disabled={!feedback}>
                 <WhatsAppIcon className="mr-2 h-4 w-4" />
                Send via WhatsApp
              </Button>
               <Button onClick={handleEmailSend} variant="outline" disabled={!feedback}>
                 <Mail className="mr-2 h-4 w-4" />
                Send via Email
              </Button>
            </CardFooter>
      </Card>
    </div>
  );
}
