"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Music, Building2 } from "lucide-react";

const plans = [
  {
    name: "Independent",
    description: "For solo artists and small creators",
    price: "$15",
    period: "per track",
    icon: Music,
    features: [
      "AI forensic analysis per track",
      "Smart questionnaire",
      "Human score calculation",
      "CWR file generation",
      "Eligibility assessment",
      "Download registration files",
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Label Standard",
    description: "For labels managing multiple artists",
    price: "$199",
    period: "/month",
    icon: Building2,
    features: [
      "Everything in Independent",
      "Up to 100 tracks/month",
      "Bulk upload & processing",
      "Team dashboard",
      "Priority processing",
      "Email support",
    ],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Label Unlimited",
    description: "For major labels and publishers",
    price: "$299",
    period: "/month",
    icon: Building2,
    features: [
      "Everything in Label Standard",
      "Unlimited tracks",
      "API access",
      "Custom integrations",
      "Dedicated account manager",
      "PRO submission assistance",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

export default function PricingPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-heading font-bold mb-4">
          Simple, Transparent Pricing
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Whether you&apos;re an independent musician or a major label, VeriRights has a plan
          that fits your needs.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={`relative ${
              plan.popular ? "border-gold shadow-lg shadow-gold/10" : ""
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="bg-gold text-navy-900 hover:bg-gold">Most Popular</Badge>
              </div>
            )}
            <CardHeader className="text-center pb-2">
              <div className="mx-auto mb-3 p-3 rounded-xl bg-navy-800 w-fit">
                <plan.icon className="h-6 w-6 text-gold" />
              </div>
              <CardTitle className="text-xl">{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <span className="text-4xl font-heading font-bold">{plan.price}</span>
                <span className="text-muted-foreground ml-1">{plan.period}</span>
              </div>

              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 text-gold shrink-0 mt-0.5" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Button
                className="w-full"
                variant={plan.popular ? "default" : "outline"}
              >
                {plan.cta}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-12 text-center text-sm text-muted-foreground">
        <p>All plans include a 14-day money-back guarantee. No contracts, cancel anytime.</p>
        <p className="mt-1">
          Need a custom plan for your organization?{" "}
          <a href="mailto:sales@verirights.com" className="text-gold hover:underline">
            Contact us
          </a>
        </p>
      </div>
    </div>
  );
}
