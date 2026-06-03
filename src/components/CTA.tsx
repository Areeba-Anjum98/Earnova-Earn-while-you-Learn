import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function CTA() {
  return (
    <section className="relative py-24 md:py-32">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative overflow-hidden rounded-3xl glass-strong p-12 md:p-20 text-center"
        >
          {/* animated gradient bg */}
          <div className="absolute inset-0 -z-10 opacity-60">
            <div className="absolute inset-0 bg-gradient-hero" />
            <div className="absolute -top-20 left-1/4 h-80 w-80 rounded-full bg-violet/40 blur-3xl animate-float-slow" />
            <div
              className="absolute -bottom-20 right-1/4 h-80 w-80 rounded-full bg-accent/40 blur-3xl animate-float-slow"
              style={{ animationDelay: "-10s" }}
            />
          </div>

          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-6">
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            <span className="text-xs font-medium">Free to start • No credit card</span>
          </div>

          <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 max-w-3xl mx-auto leading-[1.05]">
            Ready to <span className="gradient-text-brand">earn smarter</span>
            <br />
            this semester?
          </h2>
          <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
            Join 50,000+ students already turning their schedules into paychecks.
          </p>

          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              to="/login"
              className="group relative overflow-hidden rounded-2xl bg-gradient-primary px-8 py-4 font-semibold text-background shadow-glow animate-pulse-glow hover:scale-105 active:scale-95 transition-transform"
            >
              <span className="relative z-10 flex items-center gap-2">
                Start Earning Today
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
            </Link>
            <Link
              to="/login"
              className="rounded-2xl glass-strong px-8 py-4 font-semibold hover:bg-white/10 transition-all hover:scale-105 active:scale-95"
            >
              Talk to Sales
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
