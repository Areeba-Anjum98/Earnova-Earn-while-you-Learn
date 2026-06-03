import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useState } from "react";
import logo from "@/assets/logo.jpeg";

export const Route = createFileRoute("/subscription")({
  head: () => ({
    meta: [
      { title: "Choose Your Plan — Earnova" },
      { name: "description", content: "Select your subscription plan to get started" },
    ],
  }),
  component: SubscriptionPage,
});

function SubscriptionPage() {
  const navigate = useNavigate();
  const [user] = useState(() => JSON.parse(localStorage.getItem("user") || "{}"));
  const [selecting, setSelecting] = useState<string | null>(null);

  const isStudent = user?.role === "student";
  const isEmployer = user?.role === "employer";

  const studentPlans = [
    {
      id: "student-free",
      name: "Free",
      price: "Rs. 0",
      period: "Forever",
      description: "For students just starting out",
      features: [
        "Apply to 15 jobs per month",
        "Basic profile & skill tags",
        "Earnings tracking & payouts",
        "In-app chat with employers",
      ],
      cta: "Get Started",
      highlighted: false,
    },
    {
      id: "student-pro",
      name: "Pro",
      price: "Rs. 300-500",
      period: "/ month",
      description: "For serious job seekers",
      features: [
        "Unlimited job applications",
        "Skills validation badge",
        "Premium training recommendations",
        "Priority placement in employer feeds",
      ],
      cta: "Choose Pro",
      highlighted: true,
    },
  ];

  const employerPlans = [
    {
      id: "employer-basic",
      name: "Basic",
      price: "Rs. 1,000",
      period: "/ month",
      description: "For small businesses",
      features: [
        "5 job posts per month",
        "View top 10 candidates",
        "Standard support",
      ],
      cta: "Get Started",
      highlighted: false,
    },
    {
      id: "employer-pro",
      name: "Professional",
      price: "Rs. 2,500",
      period: "/ month",
      description: "For growing teams",
      features: [
        "Unlimited job posts",
        "View all candidates",
        "Premium support",
        "Advanced analytics",
      ],
      cta: "Choose Pro",
      highlighted: true,
    },
  ];

  const plans = isStudent ? studentPlans : employerPlans;

  const handleSelectPlan = async (planId: string) => {
    setSelecting(planId);
    
    // Save selected plan
    localStorage.setItem("selectedPlan", planId);
    
    // Redirect to appropriate dashboard
    setTimeout(() => {
      if (isStudent) {
        navigate({ to: "/student-dashboard" });
      } else {
        navigate({ to: "/employer-dashboard" });
      }
    }, 500);
  };

  return (
    <div className="relative min-h-screen bg-background overflow-x-hidden">
      {/* Background */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-primary/8 blur-3xl" />
        <div className="absolute bottom-1/4 right-0 h-96 w-96 rounded-full bg-accent/8 blur-3xl" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/40 backdrop-blur-xl bg-background/80">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-white border border-border overflow-hidden flex items-center justify-center">
              <img src={logo} alt="logo" className="h-full w-full object-contain" />
            </div>
            <span className="font-bold tracking-tight">Earnova</span>
          </div>
          <span className="text-sm text-muted-foreground">
            {isStudent ? "Student" : "Employer"} Plans
          </span>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-16">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          {isStudent ? (
            <>
              <h1 className="text-4xl font-bold tracking-tight mb-3">
                <span className="text-foreground">Students plan.</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Choose the plan that works best for your earning goals.
              </p>
            </>
          ) : (
            <>
              <h1 className="text-4xl font-bold tracking-tight mb-3">
                <span className="text-foreground">Employer plans</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Find and hire the best student talent at affordable prices.
              </p>
            </>
          )}
        </motion.div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, idx) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className={`rounded-3xl p-8 border transition-all ${
                plan.highlighted
                  ? "border-primary/50 bg-gradient-to-br from-primary/10 to-accent/10 shadow-elevated"
                  : "border-border/50 bg-background"
              }`}
            >
              {plan.highlighted && (
                <div className="mb-4 inline-block rounded-full bg-gradient-primary px-4 py-1.5 text-xs font-semibold text-white">
                  Most Popular
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-1">{plan.name}</h3>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelectPlan(plan.id)}
                disabled={selecting === plan.id}
                className={`w-full rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                  plan.highlighted
                    ? "bg-gradient-primary text-white shadow-glow hover:shadow-lg"
                    : "bg-muted text-foreground hover:bg-muted/80"
                } disabled:opacity-60 disabled:cursor-not-allowed`}
              >
                {selecting === plan.id ? "Selecting..." : plan.cta}
              </motion.button>
            </motion.div>
          ))}
        </div>

        {/* Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 rounded-2xl border border-border/50 bg-gradient-primary/10 p-6 text-center text-sm max-w-2xl mx-auto"
        >
          <p className="font-semibold text-foreground">
            {isStudent
              ? "You can change your plan anytime from your profile settings."
              : "Cancel your subscription anytime. No hidden fees or penalties."}
          </p>
        </motion.div>
      </main>
    </div>
  );
}
