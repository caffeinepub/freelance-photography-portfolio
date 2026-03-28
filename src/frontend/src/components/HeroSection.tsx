import { motion } from "motion/react";
import type { MediaItem } from "../backend";

interface HeroSectionProps {
  featuredItem: MediaItem | null | undefined;
}

export default function HeroSection({ featuredItem }: HeroSectionProps) {
  const bgUrl = featuredItem
    ? featuredItem.blob.getDirectURL()
    : "/assets/generated/hero-coastline.dim_1920x1080.jpg";

  const scrollToWorks = () => {
    document.querySelector("#works")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      className="relative w-full h-screen min-h-[600px] flex items-center justify-center overflow-hidden"
      aria-label="Hero"
    >
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('${bgUrl}')` }}
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[oklch(0.09_0_0/0.3)] via-[oklch(0.09_0_0/0.45)] to-[oklch(0.09_0_0/0.8)]" />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-sans text-xs tracking-[0.3em] uppercase text-[oklch(0.65_0_0)] mb-6"
        >
          Photography &amp; Visual Stories
        </motion.p>

        <motion.h1
          id="dkjl3d"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4 }}
          className="font-display text-6xl md:text-8xl font-bold text-foreground uppercase tracking-tight leading-none mb-6"
        >
          Farrukh
          <br />
          <span className="">Mirza</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="font-sans text-lg tracking-[0.15em] text-[oklch(0.65_0_0)] mb-10"
        >
          Capturing moments that transcend the ordinary
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          onClick={scrollToWorks}
          className="cta-button"
          data-ocid="hero.view_portfolio.button"
        >
          View Portfolio
        </motion.button>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <div className="w-px h-12 bg-gradient-to-b from-transparent to-[oklch(0.65_0_0)]" />
        <span className="font-sans text-[10px] tracking-[0.25em] uppercase text-[oklch(0.65_0_0)]">
          Scroll
        </span>
      </motion.div>
    </section>
  );
}
