'use client';

import AppLayout from '@/components/layout/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Zap } from 'lucide-react';

const whatsAppNumber = "7478802433";
const price = "$19/month";
const message = `Hi! I'm interested in upgrading to the CreatorX SEO premium monthly subscription for ${price}.\n\nI'm excited about the personalized guidance for SEO, content improvements, and custom thumbnail creation. Please let me know the next steps!`;
const whatsappUrl = `https://wa.me/${whatsAppNumber}?text=${encodeURIComponent(message)}`;

const benefits = [
    "Personalized 1-on-1 WhatsApp Guidance",
    "Advanced SEO & Content Strategy",
    "Custom Thumbnail Design Service",
    "Actionable Feedback on Your Content",
    "Priority Support & Feature Requests",
    "Outrank Your Competitors",
];

export default function UpgradePage() {
    const handleUpgradeClick = () => {
        window.open(whatsappUrl, "_blank");
    };

    return (
        <AppLayout>
            <div className="flex flex-col items-center text-center space-y-12">
                <header className="space-y-4 max-w-2xl">
                    <Zap className="mx-auto h-16 w-16 text-primary animate-pulse" />
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tighter">Unlock Your Full Potential</h1>
                    <p className="text-lg text-muted-foreground">
                        Go premium to get personalized, 1-on-1 expert guidance that goes beyond automated tools. Let's grow your channel together.
                    </p>
                </header>

                <Card className="w-full max-w-2xl text-left shadow-2xl">
                    <CardHeader>
                        <CardTitle className="text-2xl">Premium Subscription</CardTitle>
                        <CardDescription>Everything you need to succeed, all in one place.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-3">
                            {benefits.map((benefit, index) => (
                                <div key={index} className="flex items-center gap-3">
                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                    <span className="text-foreground">{benefit}</span>
                                </div>
                            ))}
                        </div>
                        <div className="text-center pt-4">
                            <p className="text-4xl font-bold tracking-tight">{price}</p>
                            <p className="text-sm text-muted-foreground">Billed monthly. Cancel anytime.</p>
                        </div>
                         <Button onClick={handleUpgradeClick} size="lg" className="w-full text-lg h-12 mt-4">
                            <Zap className="mr-2 h-5 w-5" />
                            Upgrade Now & Chat on WhatsApp
                        </Button>
                    </CardContent>
                </Card>

                <div className="max-w-2xl text-center">
                    <p className="text-sm text-muted-foreground">
                        Upon clicking, you will be redirected to WhatsApp to start a conversation with our lead strategist. We believe in human connection to drive real results.
                    </p>
                </div>
            </div>
        </AppLayout>
    );
}
