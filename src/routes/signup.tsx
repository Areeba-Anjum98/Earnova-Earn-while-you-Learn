import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { API_BASE } from "@/lib/config";
import { Mail, Lock, User, ArrowRight, Briefcase, GraduationCap } from "lucide-react";
import logo from "@/assets/logo.jpeg";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Sign up — Earnova" },
      {
        name: "description",
        content:
          "Create your Earnova account and start earning on your terms with flexible student jobs.",
      },
      { property: "og:title", content: "Sign up — Earnova" },
      {
        property: "og:description",
        content: "Create your Earnova account and start earning today.",
      },
    ],
  }),
  component: SignupPage,
});

function SignupPage() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"student" | "employer">("student");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async () => {
    setError("");

    // ✅ Client-side validation
    if (!name.trim()) return setError("Name is required");
    if (!email.trim()) return setError("Email is required");
    if (password.length < 6) return setError("Password must be at least 6 characters");

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Signup failed");
        return;
      }

      if (data.token) {
        // ✅ Save auth data
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        // ✅ Redirect to subscription plan selection
        navigate({ to: "/subscription" });
      } else {
        setError(data.message || "Signup failed — no token received");
      }
    } catch (err) {
      setError("Cannot connect to server. Make sure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-16 overflow-hidden">
      {/* Background blobs */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 -right-24 h-96 w-96 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute bottom-1/4 -left-24 h-96 w-96 rounded-full bg-accent/20 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-2 mb-8 group">
          <div className="relative">
            <div className="absolute inset-0 rounded-xl bg-gradient-primary blur-md opacity-40 group-hover:opacity-70 transition-opacity" />
            <div className="relative h-11 w-11 rounded-xl bg-white flex items-center justify-center overflow-hidden ring-1 ring-border">
              <img src={logo} alt="Earnova logo" className="h-full w-full object-contain" />
            </div>
          </div>
          <span className="font-bold text-xl tracking-tight">Earnova</span>
        </Link>

        <div className="glass-strong rounded-3xl p-8 shadow-elevated">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Create your account</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Join thousands of students earning on their terms
            </p>
          </div>

          {/* Role Selector */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              type="button"
              onClick={() => setRole("student")}
              className={`flex items-center justify-center gap-2 rounded-xl border py-3 text-sm font-medium transition-all ${
                role === "student"
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-border text-muted-foreground hover:border-accent/40"
              }`}
            >
              <GraduationCap className="h-4 w-4" />
              Student
            </button>
            <button
              type="button"
              onClick={() => setRole("employer")}
              className={`flex items-center justify-center gap-2 rounded-xl border py-3 text-sm font-medium transition-all ${
                role === "employer"
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-border text-muted-foreground hover:border-accent/40"
              }`}
            >
              <Briefcase className="h-4 w-4" />
              Employer
            </button>
          </div>

          <div className="space-y-5">
            {/* Name */}
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Full name
              </label>
              <div className="relative group">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary transition-colors duration-200 group-focus-within:text-primary" />
                <input
                  id="name"
                  type="text"
                  placeholder="Alex Johnson"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSignup()}
                  className="w-full rounded-xl border border-border bg-background/60 backdrop-blur-sm pl-10 pr-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary transition-colors duration-200 group-focus-within:text-primary" />
                <input
                  id="email"
                  type="email"
                  placeholder="you@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSignup()}
                  className="w-full rounded-xl border border-border bg-background/60 backdrop-blur-sm pl-10 pr-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary transition-colors duration-200 group-focus-within:text-primary" />
                <input
                  id="password"
                  type="password"
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSignup()}
                  className="w-full rounded-xl border border-border bg-background/60 backdrop-blur-sm pl-10 pr-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all"
                />
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="rounded-xl bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
                {error}
              </div>
            )}

            {/* Submit */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={handleSignup}
              disabled={loading}
              className="relative w-full overflow-hidden rounded-xl bg-gradient-primary px-5 py-3 text-sm font-semibold text-background shadow-glow group disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading ? "Creating account…" : "Create account"}
                {!loading && (
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                )}
              </span>
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            </motion.button>

            <p className="text-xs text-center text-muted-foreground">
              By signing up you agree to our Terms and Privacy Policy.
            </p>
          </div>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-primary hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
