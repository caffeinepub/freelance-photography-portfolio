import { SiInstagram, SiX } from "react-icons/si";

export default function Footer() {
  const year = new Date().getFullYear();
  const hostname = encodeURIComponent(window.location.hostname);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Works", href: "#works" },
    { label: "About", href: "#about" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <footer className="bg-[oklch(0.09_0_0)] border-t border-border">
      <div className="max-w-content mx-auto px-6 md:px-10 py-12">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          {/* Left: brand + links */}
          <div>
            <p className="font-display text-sm tracking-widest uppercase text-foreground mb-4">
              Farrukh Mirza
            </p>
            <div className="flex flex-wrap gap-4 mb-6">
              {navLinks.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  className="font-sans text-[11px] tracking-[0.15em] uppercase text-[oklch(0.45_0_0)] hover:text-[oklch(0.77_0_0)] transition-colors"
                  data-ocid={`footer.${l.label.toLowerCase()}.link`}
                >
                  {l.label}
                </a>
              ))}
            </div>
            <div className="flex gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[oklch(0.45_0_0)] hover:text-foreground transition-colors"
                aria-label="Instagram"
                data-ocid="footer.instagram.link"
              >
                <SiInstagram size={14} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[oklch(0.45_0_0)] hover:text-foreground transition-colors"
                aria-label="X / Twitter"
                data-ocid="footer.twitter.link"
              >
                <SiX size={14} />
              </a>
            </div>
          </div>

          {/* Right: tagline */}
          <div className="flex flex-col justify-end text-right">
            <p className="font-display italic text-2xl text-[oklch(0.30_0_0)] leading-tight">
              Light is the
              <br />
              first language.
            </p>
          </div>
        </div>

        <div className="border-t border-border mt-10 pt-6 flex flex-col md:flex-row justify-between gap-2">
          <p className="font-sans text-[11px] text-[oklch(0.35_0_0)]">
            &copy; {year} Farrukh Mirza. All rights reserved.
          </p>
          <p className="font-sans text-[11px] text-[oklch(0.30_0_0)]">
            Built with ♥ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${hostname}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[oklch(0.50_0_0)] transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
