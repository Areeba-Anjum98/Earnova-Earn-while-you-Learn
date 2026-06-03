import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Ayesha K.",
    role: "CS Student, LUMS",
    quote: "I made Rs. 45,000 last month tutoring around my classes. The platform is amazing.",
    rating: 5,
  },
  {
    name: "Ahmed R.",
    role: "Design, NCA",
    quote: "Instant payouts changed everything. No more chasing payments from clients.",
    rating: 5,
  },
  {
    name: "Fatima N.",
    role: "Biology, UHS",
    quote: "Found a research gig in 2 days. Paid 3x what I was making before.",
    rating: 5,
  },
  {
    name: "Bilal T.",
    role: "Marketing, IBA",
    quote: "The dashboard makes me feel like a real professional. Genuinely beautiful product.",
    rating: 5,
  },
  {
    name: "Hira S.",
    role: "Engineering, LUMS",
    quote: "Schedule-first matching means I never overbook. It just works.",
    rating: 5,
  },
  {
    name: "Omar M.",
    role: "Film, Beaconhouse",
    quote: "Booked 3 weekend photo gigs in one week. Game changer for student creatives.",
    rating: 5,
  },
];

export function Testimonials() {
  const row1 = [...testimonials, ...testimonials];
  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      <div className="container mx-auto px-4 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto"
        >
          <div className="inline-flex glass rounded-full px-4 py-1.5 text-xs font-medium text-accent mb-4">
            Loved by Students
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            Real stories, <span className="gradient-text-brand">real earnings</span>
          </h2>
        </motion.div>
      </div>

      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

        <motion.div
          className="flex gap-5"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        >
          {row1.map((t, i) => (
            <div
              key={i}
              className="glass rounded-2xl p-6 min-w-[340px] max-w-[340px] hover:border-accent/30 transition-colors"
            >
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: t.rating }).map((_, k) => (
                  <Star key={k} className="h-4 w-4 fill-accent text-accent" />
                ))}
              </div>
              <p className="text-sm leading-relaxed mb-5 text-foreground/90">"{t.quote}"</p>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-primary" />
                <div>
                  <div className="font-semibold text-sm">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
