"use client";

import * as React from "react";
import { useForm, ValidationError } from "@formspree/react";
import { Loader2, Send, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

export default function FeedbackClient() {
  const { toast } = useToast();
  const [state, handleSubmit] = useForm("xqkrkyrz"); // Replace with your Formspree form ID

  React.useEffect(() => {
    if (state.succeeded) {
      toast({
        title: "Feedback Sent!",
        description: "Thank you for your valuable suggestion.",
      });
    } else if (state.errors) {
       toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem sending your feedback. Please try again.",
      });
    }
  }, [state.succeeded, state.errors, toast]);


  if (state.succeeded) {
    return (
        <div className="space-y-8">
            <header className="space-y-1">
                <h1 className="text-3xl font-bold tracking-tight">Submit Feedback</h1>
                <p className="text-muted-foreground">
                Have an idea for a new feature or an improvement? We'd love to hear it!
                </p>
            </header>
            <Card className="flex flex-col items-center justify-center p-12 text-center">
                 <div className="mb-4 rounded-full bg-green-100 p-4">
                    <Send className="h-12 w-12 text-green-600" />
                </div>
                <CardTitle className="text-xl">Thank You!</CardTitle>
                <CardDescription className="mt-2 max-w-sm">
                    Your feedback has been successfully submitted. We appreciate you taking the time to help us improve.
                </CardDescription>
            </Card>
        </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Submit Feedback</h1>
        <p className="text-muted-foreground">
          Have an idea for a new feature or an improvement? We'd love to hear it!
        </p>
      </header>

      <Card>
        <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Your Suggestion</CardTitle>
              <CardDescription>
                Describe your idea and attach a screenshot if you'd like.
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
                    />
                    <ValidationError 
                        prefix="Feedback" 
                        field="feedback"
                        errors={state.errors}
                        className="text-sm font-medium text-destructive"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="file">Screenshot (Optional)</Label>
                    <Input id="file" name="attachment" type="file" />
                     <ValidationError 
                        prefix="Attachment" 
                        field="attachment"
                        errors={state.errors}
                        className="text-sm font-medium text-destructive"
                    />
                </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={state.submitting}>
                 {state.submitting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <Send className="mr-2 h-4 w-4" />
                )}
                Submit Feedback
              </Button>
            </CardFooter>
        </form>
      </Card>
    </div>
  );
}
