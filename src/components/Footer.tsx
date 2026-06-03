import { Facebook, Github, Linkedin, Instagram } from "lucide-react";
import logo from "@/assets/logo.jpeg";

export function Footer() {
  const cols = [
    { title: "Product", links: ["Find Jobs", "Post a Job", "Pricing", "Dashboard"] },
    { title: "Company", links: ["About", "Careers", "Press", "Contact"] },
    { title: "Resources", links: ["Help Center", "Blog", "Community", "Status"] },
    { title: "Legal", links: ["Privacy", "Terms", "Security", "Cookies"] },
  ];

  return (
    <footer className="relative pt-20 pb-10 border-t border-white/5">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-10 mb-12">
          <div className="lg:col-span-2">
            <a href="#" className="flex items-center gap-2 mb-4">
              <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center overflow-hidden ring-1 ring-border">
                <img src={logo} alt="Earnova logo" className="h-full w-full object-contain" />
              </div>
              <span className="font-bold text-lg">Earnova</span>
            </a>
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
              Pakistan's first student job marketplace. Connecting students with local employers for
              meaningful work opportunities.
            </p>
            <div className="flex gap-2 mt-5">
              {[
                {
                  icon: Facebook,
                  href: "https://www.facebook.com/share/1Cn8sbf5kQ/",
                  label: "Facebook",
                },
                {
                  icon: Github,
                  href: "#",
                  label: "Github",
                },
                {
                  icon: Linkedin,
                  href: "#",
                  label: "LinkedIn",
                },
                {
                  icon: Instagram,
                  href: "https://www.instagram.com/the.earnova?igsh=bTQ5Zm43ZGdkeTRs",
                  label: "Instagram",
                },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target={href === "#" ? undefined : "_blank"}
                  rel={href === "#" ? undefined : "noreferrer"}
                  className="h-9 w-9 rounded-lg glass flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/10 hover:scale-110 transition-all"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {cols.map((c) => (
            <div key={c.title}>
              <h4 className="font-semibold mb-4 text-sm">{c.title}</h4>
              <ul className="space-y-3">
                {c.links.map((l) => (
                  <li key={l}>
                    <a
                      href="#"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-wrap items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © 2026 Earnova. Built for students, by students.
          </p>
          <p className="text-xs text-muted-foreground">
            Made with <span className="gradient-text-brand font-semibold">passion</span> for
            Pakistan
          </p>
        </div>
      </div>
    </footer>
  );
}
