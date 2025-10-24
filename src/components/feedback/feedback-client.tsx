"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Loader2, Send, MessageSquare, Mail } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  feedback: z.string().min(10, { message: "Please enter at least 10 characters." }),
});

type FormValues = z.infer<typeof formSchema>;

const WHATSAPP_NUMBER = "7478802433";
const EMAIL_ADDRESS = "biznessindia@gmail.com";

export default function FeedbackClient() {
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      feedback: "",
    },
  });

  const handleSendEmail = (data: FormValues) => {
    const subject = encodeURIComponent("App Improvement Suggestion");
    const body = encodeURIComponent(data.feedback);
    window.location.href = `mailto:${EMAIL_ADDRESS}?subject=${subject}&body=${body}`;
  };

  const handleSendWhatsApp = (data: FormValues) => {
    const text = encodeURIComponent(data.feedback);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, '_blank');
  };
  
  // We need a dummy onSubmit for form.handleSubmit to work with our custom handlers
  function onSubmit(data: FormValues) {
    // This function is not called directly, but it's required by react-hook-form
    console.log("Form submitted with:", data);
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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader>
              <CardTitle>Your Suggestion</CardTitle>
              <CardDescription>
                Describe your idea in the box below.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="feedback"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Feedback</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="I have an idea for..."
                        className="min-h-[150px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex flex-wrap gap-4">
              <Button type="button" onClick={form.handleSubmit(handleSendWhatsApp)}>
                <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="whatsapp" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                  <path fill="currentColor" d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 .2c57.1 0 109.7 21.8 148.8 60.8 39.1 39.1 60.8 91.7 60.8 148.8 0 110.1-89.4 199.5-199.5 199.5-35.2 0-69-9.2-98.6-26.l-29.3-15-109.2 28.6-29.3-109.1-17.7-32.4-28.6-68.9-28.6-106.1 0-110.1 89.4-199.5 199.5-199.5zm113.8 152.1c-5.4-2.7-31.9-15.7-36.9-17.5-5-1.8-8.7-2.7-12.3 2.7-3.6 5.4-14 17.5-17.1 21-3.1 3.6-6.2 4-11.4 1.3-5.2-2.7-21.9-8-41.8-25.8-15.5-13.8-26-30.9-29.1-36.3-3.1-5.4-.3-8.3 2.4-11.1 2.4-2.5 5.4-6.6 8.1-9.9 2.7-3.3 3.6-5.4 5.4-9.1 1.8-3.6 1-6.8-1-9.9-1.8-3.1-12.3-29.3-16.9-40.2-4.6-10.9-9.2-9.4-12.9-9.4-3.6 0-7.8.4-12 .4-4.2 0-10.9 1.8-16.5 7.2-5.7 5.4-21.9 21.3-21.9 52.1 0 30.8 22.4 60.4 25.5 64.5 3.1 4.2 43.6 66.5 106.2 93.6 14.8 6.4 26.5 10.2 35.6 13.1 15.2 4.6 29.3 3.9 40.2 2.3 12.3-1.8 31.9-13 36.3-25.5 4.5-12.4 4.5-23 3.1-25.5-1.4-2.5-5-4.2-10.4-6.9z"></path>
                </svg>
                Send via WhatsApp
              </Button>
              <Button type="button" variant="outline" onClick={form.handleSubmit(handleSendEmail)}>
                <Mail className="mr-2 h-4 w-4" />
                Send via Email
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
