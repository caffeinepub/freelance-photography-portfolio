import { ArrowRight, Instagram, Twitter } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import type { ContactInfo } from "../backend";

const SAMPLE_CONTACT: ContactInfo = {
  email: "elena@vasquezphoto.com",
  socialLinks: [
    ["instagram", "https://instagram.com/elenavasquez"],
    ["twitter", "https://twitter.com/elenavasquez"],
  ],
};

interface ContactSectionProps {
  contact: ContactInfo | null | undefined;
}

export default function ContactSection({ contact }: ContactSectionProps) {
  const [emailInput, setEmailInput] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const info = contact || SAMPLE_CONTACT;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setSubmitted(true);
    }
  };

  const socialIcon = (platform: string) => {
    if (platform === "instagram") return <Instagram size={16} />;
    if (platform === "twitter") return <Twitter size={16} />;
    return null;
  };

  return (
    <section id="contact" className="py-20 md:py-28 bg-[oklch(0.10_0_0)]">
      <div className="max-w-content mx-auto px-6 md:px-10">
        <div className="grid md:grid-cols-2 gap-16">
          {/* Left: Contact info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="font-sans text-xs tracking-[0.25em] uppercase text-[oklch(0.45_0_0)] mb-3">
              Get in touch
            </p>
            <h2 className="section-title text-4xl md:text-5xl mb-8">Contact</h2>

            <div className="space-y-6">
              <div>
                <p className="font-sans text-xs tracking-widest uppercase text-[oklch(0.45_0_0)] mb-2">
                  Email
                </p>
                <a
                  href={`mailto:${info.email}`}
                  className="font-display text-lg text-foreground hover:text-[oklch(0.77_0_0)] transition-colors"
                  data-ocid="contact.email.link"
                >
                  {info.email}
                </a>
              </div>

              {info.socialLinks.length > 0 && (
                <div>
                  <p className="font-sans text-xs tracking-widest uppercase text-[oklch(0.45_0_0)] mb-3">
                    Follow
                  </p>
                  <div className="flex gap-4">
                    {info.socialLinks.map(([platform, url]) => (
                      <a
                        key={platform}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 border border-border flex items-center justify-center text-[oklch(0.60_0_0)] hover:text-foreground hover:border-[oklch(0.40_0_0)] transition-colors"
                        data-ocid={`contact.${platform}.link`}
                        aria-label={platform}
                      >
                        {socialIcon(platform)}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Right: Newsletter */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <p className="font-sans text-xs tracking-[0.25em] uppercase text-[oklch(0.45_0_0)] mb-3">
              Stay updated
            </p>
            <h3 className="font-display text-3xl text-foreground mb-4">
              Newsletter
            </h3>
            <p className="font-sans text-sm text-[oklch(0.60_0_0)] leading-relaxed mb-8">
              New collections, exhibition announcements, and behind-the-lens
              stories. No spam — only what matters.
            </p>

            {submitted ? (
              <div
                className="border border-border p-6"
                data-ocid="newsletter.success_state"
              >
                <p className="font-display text-lg text-foreground">
                  Thank you for subscribing.
                </p>
                <p className="font-sans text-sm text-[oklch(0.60_0_0)] mt-2">
                  You'll hear from us soon.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="flex border border-border"
                data-ocid="newsletter.form"
              >
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="Your email address"
                  required
                  className="flex-1 bg-transparent px-4 py-3 font-sans text-sm text-foreground placeholder-[oklch(0.40_0_0)] outline-none"
                  data-ocid="newsletter.email.input"
                />
                <button
                  type="submit"
                  className="px-4 border-l border-border text-[oklch(0.65_0_0)] hover:text-foreground hover:bg-[oklch(0.18_0_0)] transition-colors"
                  data-ocid="newsletter.submit_button"
                  aria-label="Subscribe"
                >
                  <ArrowRight size={18} />
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
