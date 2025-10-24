
'use client';

import AppLayout from '@/components/layout/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { CheckCircle, Zap } from 'lucide-react';
import { useState, useEffect } from 'react';

const whatsAppNumber = "7478802433";

const proBenefits = [
    "Unlimited 1-on-1 WhatsApp Guidance",
    "Advanced SEO & Content Strategy",
    "Custom Thumbnail Design Service",
    "Actionable Feedback on Your Content",
    "Priority Support & Feature Requests",
    "Outrank Your Competitors",
];

const starterBenefits = [
    "1-on-1 WhatsApp Guidance (Bi-Weekly Check-in)",
    "Thumbnail Reviews (Up to 2 per month)",
    "AI-Powered Content Ideas",
    "Keyword Research & Competitor Analysis",
    "Standard Email Support",
];

const pricing = {
    'en-IN': {
        starter: { price: '₹189/month', currency: 'INR' },
        pro: { price: '₹999/month', currency: 'INR' },
    },
    'en-US': {
        starter: { price: '$4/month', currency: 'USD' },
        pro: { price: '$15/month', currency: 'USD' },
    },
    'default': {
        starter: { price: '₹189/month', currency: 'INR' },
        pro: { price: '₹999/month', currency: 'INR' },
    },
};

type PlanType = 'starter' | 'pro';

export default function UpgradePage() {
    const [displayPrices, setDisplayPrices] = useState(pricing.default);
    const [whatsappUrls, setWhatsappUrls] = useState({ starter: '', pro: '' });

    useEffect(() => {
        const userLang = navigator.language;
        let selectedPrices = pricing.default;

        if (userLang.toLowerCase().includes('in')) {
             selectedPrices = pricing['en-IN'];
        } else if (userLang.toLowerCase().includes('us')) {
             selectedPrices = pricing['en-US'];
        }

        setDisplayPrices(selectedPrices);

        const starterMessage = `Hi! I'm interested in upgrading to the CreatorX SEO *Starter Plan* for ${selectedPrices.starter.price}.\n\nPlease let me know the next steps!`;
        const proMessage = `Hi! I'm interested in upgrading to the CreatorX SEO *Pro Plan* for ${selectedPrices.pro.price}.\n\nPlease let me know the next steps!`;
        
        setWhatsappUrls({
            starter: `https://wa.me/${whatsAppNumber}?text=${encodeURIComponent(starterMessage)}`,
            pro: `https://wa.me/${whatsAppNumber}?text=${encodeURIComponent(proMessage)}`,
        });

    }, []);

    const handleUpgradeClick = (plan: PlanType) => {
        const url = whatsappUrls[plan];
        if (url) {
            window.open(url, "_blank");
        }
    };

    return (
        <AppLayout>
            <div className="flex flex-col items-center text-center space-y-12">
                <header className="space-y-4 max-w-3xl">
                    <Zap className="mx-auto h-16 w-16 text-primary animate-pulse" />
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tighter">Choose Your Plan & Unlock Your Potential</h1>
                    <p className="text-lg text-muted-foreground">
                        Whether you're just starting out or ready to go pro, we have a plan that fits your needs. Let's grow your channel together.
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
                    {/* Starter Plan Card */}
                    <Card className="flex flex-col text-left shadow-lg">
                        <CardHeader>
                            <CardTitle className="text-2xl">Starter Plan</CardTitle>
                            <CardDescription>Essential tools for new creators.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6 flex-grow">
                             <div className="text-left pt-4">
                                <p className="text-4xl font-bold tracking-tight">{displayPrices.starter.price}</p>
                                <p className="text-sm text-muted-foreground">Billed monthly. Cancel anytime.</p>
                            </div>
                            <div className="space-y-3">
                                {starterBenefits.map((benefit, index) => (
                                    <div key={index} className="flex items-center gap-3">
                                        <CheckCircle className="h-5 w-5 text-green-500" />
                                        <span className="text-foreground">{benefit}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button onClick={() => handleUpgradeClick('starter')} size="lg" className="w-full text-lg h-12 mt-4" disabled={!whatsappUrls.starter} variant="outline">
                                Get Started
                            </Button>
                        </CardFooter>
                    </Card>

                    {/* Pro Plan Card */}
                    <Card className="flex flex-col text-left shadow-2xl border-2 border-primary ring-4 ring-primary/20">
                         <CardHeader>
                            <CardTitle className="text-2xl">Pro Plan</CardTitle>
                            <CardDescription>For creators ready to dominate their niche.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6 flex-grow">
                             <div className="text-left pt-4">
                                <p className="text-4xl font-bold tracking-tight">{displayPrices.pro.price}</p>
                                <p className="text-sm text-muted-foreground">Billed monthly. Cancel anytime.</p>
                            </div>
                            <div className="space-y-3">
                                {proBenefits.map((benefit, index) => (
                                    <div key={index} className="flex items-center gap-3">
                                        <CheckCircle className="h-5 w-5 text-green-500" />
                                        <span className="text-foreground">{benefit}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button onClick={() => handleUpgradeClick('pro')} size="lg" className="w-full text-lg h-12 mt-4" disabled={!whatsappUrls.pro}>
                                <Zap className="mr-2 h-5 w-5" />
                                Go Pro
                            </Button>
                        </CardFooter>
                    </Card>
                </div>

                <div className="max-w-2xl text-center">
                    <p className="text-sm text-muted-foreground">
                        Upon clicking, you will be redirected to WhatsApp to start a conversation with our lead strategist. We believe in human connection to drive real results.
                    </p>
                </div>
            </div>
        </AppLayout>
    );
}
