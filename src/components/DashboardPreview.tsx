import { motion } from "framer-motion";
import { TrendingUp, Calendar, Bell, CheckCircle2 } from "lucide-react";

export function DashboardPreview() {
  const data = [30, 45, 38, 60, 55, 75, 65, 85, 78, 92, 88, 100];

  return (
    <section id="dashboard" className="relative py-24 md:py-32 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex glass rounded-full px-4 py-1.5 text-xs font-medium text-accent mb-4">
              Powerful Dashboard
            </div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-5">
              Your earnings, <span className="gradient-text-brand">visualized beautifully</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Track every gig, every Rupee, and every milestone. Smart insights help you optimize
            </p>

            <div className="space-y-4">
              {[
                "Real-time earnings tracking with weekly insights",
                "Automatic tax calculation & save-for-taxes wallet",
                "Calendar sync with your class schedule",
                "Goal-based saving plans with progress milestones",
              ].map((t, i) => (
                <motion.div
                  key={t}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <CheckCircle2 className="h-5 w-5 text-teal mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">{t}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Dashboard mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative perspective-1000"
          >
            <div
              className="relative preserve-3d"
              style={{ transform: "rotateY(8deg) rotateX(4deg)" }}
            >
              <div className="glass-strong rounded-3xl p-6 shadow-elevated">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-gradient-primary" />
                    <div>
                      <div className="font-bold">Dashboard</div>
                      <div className="text-xs text-muted-foreground">October overview</div>
                    </div>
                  </div>
                  <Bell className="h-5 w-5 text-muted-foreground" />
                </div>

                <div className="grid grid-cols-3 gap-3 mb-5">
                  {[
                    { label: "Earned", value: "Rs. 2,847" },
                    { label: "Hours", value: "68.5" },
                    { label: "Rating", value: "4.9★" },
                  ].map((s) => (
                    <div key={s.label} className="rounded-xl bg-black/30 p-3">
                      <div className="text-[10px] text-muted-foreground uppercase">{s.label}</div>
                      <div className="font-bold text-lg gradient-text">{s.value}</div>
                    </div>
                  ))}
                </div>

                <div className="rounded-2xl bg-black/30 p-5 mb-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-xs text-muted-foreground">Earnings trend</div>
                      <div className="text-2xl font-bold">Rs. 2,847.20</div>
                    </div>
                    <div className="flex items-center gap-1 text-teal text-xs font-semibold">
                      <TrendingUp className="h-3 w-3" />
                      +18.4%
                    </div>
                  </div>
                  <div className="flex items-end gap-1.5 h-24">
                    {data.map((h, i) => (
                      <motion.div
                        key={i}
                        initial={{ height: 0 }}
                        whileInView={{ height: `${h}%` }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.05, duration: 0.6 }}
                        className="flex-1 rounded-t-md bg-gradient-to-t from-violet to-accent relative group"
                      >
                        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-30 rounded-t-md transition-opacity" />
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  {[
                    { name: "Frontend Tutoring", time: "2h ago", amount: "+Rs. 70" },
                    { name: "Design Project", time: "Yesterday", amount: "+Rs. 180" },
                  ].map((item) => (
                    <div
                      key={item.name}
                      className="flex items-center justify-between rounded-xl bg-black/20 p-3"
                    >
                      <div className="flex items-center gap-3">
                        <Calendar className="h-4 w-4 text-accent" />
                        <div>
                          <div className="text-sm font-medium">{item.name}</div>
                          <div className="text-xs text-muted-foreground">{item.time}</div>
                        </div>
                      </div>
                      <div className="font-bold text-teal">{item.amount}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="absolute inset-0 -z-10 bg-gradient-primary blur-3xl opacity-20 scale-90" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
