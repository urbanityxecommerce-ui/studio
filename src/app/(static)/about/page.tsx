
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, Target, Rocket } from "lucide-react";
import Image from "next/image";

export default function AboutUsPage() {
  return (
    <div className="container mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="space-y-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl md:text-6xl">About CreatorX SEO</h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            We're on a mission to empower content creators with the tools and strategies they need to succeed in a crowded digital world.
          </p>
        </div>

        <div className="relative">
          <Image 
            src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1200&h=500&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Team of creators collaborating on a whiteboard"
            width={1200}
            height={500}
            className="w-full rounded-lg object-cover"
            data-ai-hint="team strategy"
          />
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <Card className="text-center">
            <CardHeader>
              <Rocket className="mx-auto h-12 w-12 text-primary" />
              <CardTitle className="mt-4">Our Mission</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                To democratize SEO and content strategy, providing creators of all sizes with the data-driven tools needed to grow their audience and outrank the competition.
              </p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardHeader>
              <Target className="mx-auto h-12 w-12 text-primary" />
              <CardTitle className="mt-4">Our Vision</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We envision a world where creativity is matched with strategy, allowing every creator to find their audience and build a sustainable career doing what they love.
              </p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardHeader>
              <Users className="mx-auto h-12 w-12 text-primary" />
              <CardTitle className="mt-4">Our Team</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We are a passionate team of developers, data scientists, and content creators ourselves, united by a love for building tools that make a real difference.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight">Meet the Founder</h2>
          <div className="mt-8 flex flex-col items-center gap-4">
            <Avatar className="h-32 w-32">
              <AvatarImage src="https://images.unsplash.com/photo-1580894732444-84cf70b6e582?q=80&w=200&auto=format&fit=crop" alt="Sucharita Mukhopadhayay" />
              <AvatarFallback>SM</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-xl font-semibold">Sucharita Mukhopadhayay</h3>
              <p className="text-primary">Founder & CEO</p>
              <p className="mt-2 max-w-xl text-muted-foreground">
                "As a former YouTuber, I experienced the frustration of pouring my heart into content only to see it get buried. I built CreatorX SEO to give creators like me the strategic edge I never had. Our goal is to level the playing field."
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
