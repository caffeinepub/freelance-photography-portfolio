import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { label: "GALLERIES", href: "#gallery" },
    { label: "Videos", href: "#videos" },
    { label: "About", href: "#about" },
    { label: "Contact", href: "#contact" },
  ];

  const handleNav = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[oklch(0.09_0_0)] shadow-[0_1px_0_oklch(0.20_0_0)]"
          : "bg-[oklch(0.09_0_0/0.95)]"
      }`}
    >
      <div className="max-w-content mx-auto px-6 md:px-10 h-28 flex items-center justify-between">
        {/* Logo on left side */}
        <a href="/" className="flex items-center" data-ocid="nav.logo.link">
          <img
            src="/assets/uploads/logo_black_background_mar_26_2026-019d2f76-df43-744e-9d5b-3cd747caac5c-1.png"
            alt="FM Through Film & Lens"
            className="h-24 w-auto object-contain"
            data-ocid="nav.brand.logo"
          />
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <button
              type="button"
              key={link.href}
              onClick={() => handleNav(link.href)}
              className="nav-link"
              data-ocid={`nav.${link.label.toLowerCase()}.link`}
            >
              {link.label}
            </button>
          ))}
          <a href="/admin" className="nav-link" data-ocid="nav.admin.link">
            Admin
          </a>
        </nav>

        {/* Mobile: toggle */}
        <div className="md:hidden flex items-center">
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="text-[oklch(0.65_0_0)] hover:text-foreground transition-colors"
            aria-label="Toggle menu"
            data-ocid="nav.menu.toggle"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-[oklch(0.09_0_0)] border-t border-border overflow-hidden"
          >
            <div className="px-6 py-4 flex flex-col gap-4">
              {links.map((link) => (
                <button
                  type="button"
                  key={link.href}
                  onClick={() => handleNav(link.href)}
                  className="nav-link text-left"
                  data-ocid={`nav.mobile.${link.label.toLowerCase()}.link`}
                >
                  {link.label}
                </button>
              ))}
              <a
                href="/admin"
                className="nav-link"
                data-ocid="nav.mobile.admin.link"
              >
                Admin
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
