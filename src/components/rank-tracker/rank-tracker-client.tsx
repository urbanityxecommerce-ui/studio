"use client";

import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { BarChart } from "lucide-react";

export default function RankTrackerClient() {
  return (
    <div className="space-y-8">
       <header className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Rank Tracker</h1>
        <p className="text-muted-foreground">
          Monitor your keyword rankings over time.
        </p>
      </header>
      <Card className="flex flex-col items-center justify-center p-12 text-center">
          <div className="mb-4 rounded-full bg-secondary p-4">
            <BarChart className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-xl">Feature Coming Soon!</CardTitle>
          <CardDescription className="mt-2 max-w-sm">
            We're working hard to bring you a powerful rank tracker. Soon you'll be able to monitor your content's performance on search engines right here.
          </CardDescription>
        </Card>
    </div>
  );
}
