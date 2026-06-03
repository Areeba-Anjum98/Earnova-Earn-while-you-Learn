import { motion } from "framer-motion";
import { Zap, Shield, Brain, Calendar, CreditCard, Users } from "lucide-react";
import { TiltCard } from "./TiltCard";

const features = [
  {
    icon: Brain,
    title: "AI Job Matching",
    desc: "Our smart engine pairs you with gigs that fit your skills, schedule, and goals.",
  },
  {
    icon: Zap,
    title: "Instant Payouts",
    desc: "Get paid the moment you finish — no waiting, no hidden fees.",
  },
  {
    icon: Calendar,
    title: "Schedule First",
    desc: "Set your availability around classes. Jobs come to you, not the other way around.",
  },
  {
    icon: Shield,
    title: "Verified Employers",
    desc: "Every employer is vetted. Safe campus jobs and legitimate remote opportunities only.",
  },
  {
    icon: CreditCard,
    title: "Smart Wallet",
    desc: "Track earnings, taxes, and savings goals — all in one beautiful dashboard.",
  },
  {
    icon: Users,
    title: "Community Network",
    desc: "Connect with peers, share opportunities, and build your professional reputation.",
  },
];

export function Features() {
  return (
    <section id="features" className="relative py-24 md:py-32">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <div className="inline-flex glass rounded-full px-4 py-1.5 text-xs font-medium text-accent mb-4">
            Why Students Choose Us
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            Everything you need to <span className="gradient-text-brand">earn smarter</span>
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            A complete platform built for the realities of student life.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <TiltCard className="h-full">
                <div className="relative h-full glass rounded-2xl p-7 overflow-hidden">
                  <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-gradient-primary opacity-10 blur-2xl group-hover:opacity-30 transition-opacity duration-500" />

                  <div className="relative">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-primary mb-5 shadow-glow">
                      <f.icon className="h-6 w-6 text-background" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{f.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
