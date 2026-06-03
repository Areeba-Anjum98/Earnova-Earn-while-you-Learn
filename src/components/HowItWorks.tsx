import { motion } from "framer-motion";
import { UserPlus, Search, Briefcase, Wallet } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    title: "Create your profile",
    desc: "Tell us your skills, schedule, and goals. Takes under 2 minutes.",
  },
  {
    icon: Search,
    title: "Get matched",
    desc: "Our AI finds gigs that fit you — flexible, nearby, or remote.",
  },
  {
    icon: Briefcase,
    title: "Work your way",
    desc: "Accept jobs with one tap. Communicate inside the app.",
  },
  {
    icon: Wallet,
    title: "Get paid instantly",
    desc: "Earnings hit your wallet the moment a job is complete.",
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="relative py-24 md:py-32">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <div className="inline-flex glass rounded-full px-4 py-1.5 text-xs font-medium text-accent mb-4">
            How It Works
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            Start earning in <span className="gradient-text-brand">4 simple steps</span>
          </h2>
        </motion.div>

        <div className="relative">
          {/* connecting line */}
          <div className="hidden lg:block absolute top-12 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.6 }}
                className="relative"
              >
                <div className="glass rounded-2xl p-6 h-full hover:shadow-elevated transition-all hover:-translate-y-1">
                  <div className="relative mb-5">
                    <div className="h-24 w-24 mx-auto rounded-2xl bg-gradient-primary flex items-center justify-center shadow-glow animate-pulse-glow">
                      <s.icon className="h-10 w-10 text-background" />
                    </div>
                    <div className="absolute -top-2 -right-2 h-8 w-8 rounded-full glass-strong flex items-center justify-center text-sm font-bold gradient-text-brand">
                      {i + 1}
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-center mb-2">{s.title}</h3>
                  <p className="text-sm text-muted-foreground text-center leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
