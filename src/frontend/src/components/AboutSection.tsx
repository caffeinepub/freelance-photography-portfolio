import { motion } from "motion/react";
import type { AboutSection as AboutSectionType } from "../backend";

const SAMPLE_BIO = `Elena Vasquez is an internationally published photographer and visual storyteller based between Barcelona and New York. With over a decade behind the lens, her work explores the tension between wilderness and the human condition — from remote Antarctic expeditions to intimate portrait sessions in her downtown studio.

Her photographs have appeared in National Geographic, Vogue Italia, The New York Times Magazine, and have been exhibited in galleries from Tokyo to Berlin. Elena's editorial approach is distinguished by meticulous composition, available-light mastery, and an unflinching commitment to emotional truth.`;

interface AboutSectionProps {
  about: AboutSectionType | null | undefined;
}

export default function AboutSection({ about }: AboutSectionProps) {
  const bio = about?.bio || SAMPLE_BIO;
  const photoUrl = about?.profilePhoto
    ? about.profilePhoto.getDirectURL()
    : "/assets/generated/about-elena.dim_600x750.jpg";

  const paragraphs = bio.split("\n\n");

  return (
    <section id="about" className="py-20 md:py-28">
      <div className="max-w-content mx-auto px-6 md:px-10">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <img
              src={photoUrl}
              alt="Elena Vasquez"
              className="w-full h-auto object-cover max-h-[600px]"
            />
            <div className="absolute -bottom-4 -right-4 w-full h-full border border-border -z-10" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <p className="font-sans text-xs tracking-[0.25em] uppercase text-[oklch(0.45_0_0)] mb-4">
              The Artist
            </p>
            <h2 className="section-title text-4xl md:text-5xl mb-6">
              About Elena
            </h2>
            <div className="w-10 h-px bg-[oklch(0.40_0_0)] mb-8" />

            {paragraphs.map((paragraph) => (
              <p
                key={paragraph.slice(0, 32)}
                className="font-sans text-sm text-[oklch(0.65_0_0)] leading-relaxed mb-4"
              >
                {paragraph}
              </p>
            ))}

            <div className="mt-8 flex flex-wrap gap-8">
              <div>
                <span className="font-display text-3xl font-bold text-foreground">
                  12+
                </span>
                <p className="font-sans text-xs tracking-[0.15em] uppercase text-[oklch(0.45_0_0)] mt-1">
                  Years of Work
                </p>
              </div>
              <div>
                <span className="font-display text-3xl font-bold text-foreground">
                  40+
                </span>
                <p className="font-sans text-xs tracking-[0.15em] uppercase text-[oklch(0.45_0_0)] mt-1">
                  Countries
                </p>
              </div>
              <div>
                <span className="font-display text-3xl font-bold text-foreground">
                  200+
                </span>
                <p className="font-sans text-xs tracking-[0.15em] uppercase text-[oklch(0.45_0_0)] mt-1">
                  Publications
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
