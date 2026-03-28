import { Play } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import type { Category, MediaItem } from "../backend";
import Lightbox from "./Lightbox";

const SAMPLE_MEDIA: MediaItem[] = [
  {
    id: "sample-1",
    title: "Coastal Solitude",
    description: "Dawn light breaking over the Pacific coastline",
    mediaType: "photo",
    category: "The Wild",
    position: BigInt(1),
    blob: {
      getDirectURL: () => "/assets/generated/hero-coastline.dim_1920x1080.jpg",
    } as any,
  },
  {
    id: "sample-2",
    title: "Into the Mist",
    description: "Ancient forest at first light",
    mediaType: "photo",
    category: "The Wild",
    position: BigInt(2),
    blob: {
      getDirectURL: () => "/assets/generated/portfolio-wild-1.dim_800x1000.jpg",
    } as any,
  },
  {
    id: "sample-3",
    title: "City Pulse",
    description: "Urban reflections after midnight rain",
    mediaType: "photo",
    category: "City Pulse",
    position: BigInt(3),
    blob: {
      getDirectURL: () => "/assets/generated/portfolio-city-1.dim_900x600.jpg",
    } as any,
  },
  {
    id: "sample-4",
    title: "Inner Light",
    description: "Studio portrait session — natural directional light",
    mediaType: "photo",
    category: "Portrait Studies",
    position: BigInt(4),
    blob: {
      getDirectURL: () =>
        "/assets/generated/portfolio-portrait-1.dim_700x900.jpg",
    } as any,
  },
  {
    id: "sample-5",
    title: "Quiet Morning",
    description: "Still life, editorial lifestyle",
    mediaType: "photo",
    category: "Still Life",
    position: BigInt(5),
    blob: {
      getDirectURL: () =>
        "/assets/generated/portfolio-stilllife-1.dim_800x800.jpg",
    } as any,
  },
  {
    id: "sample-6",
    title: "Celebration",
    description: "Evening reception at Villa Hermosa",
    mediaType: "photo",
    category: "Events",
    position: BigInt(6),
    blob: {
      getDirectURL: () =>
        "/assets/generated/portfolio-events-1.dim_900x600.jpg",
    } as any,
  },
  {
    id: "sample-7",
    title: "Summit",
    description: "High alpine wilderness at dusk",
    mediaType: "photo",
    category: "The Wild",
    position: BigInt(7),
    blob: {
      getDirectURL: () => "/assets/generated/portfolio-wild-2.dim_800x600.jpg",
    } as any,
  },
];

const SAMPLE_CATEGORIES: Category[] = [
  { id: "all", name: "All" },
  { id: "wild", name: "The Wild" },
  { id: "city", name: "City Pulse" },
  { id: "portrait", name: "Portrait Studies" },
  { id: "stilllife", name: "Still Life" },
  { id: "events", name: "Events" },
];

interface PortfolioSectionProps {
  media: MediaItem[] | undefined;
  categories: Category[] | undefined;
  isLoading: boolean;
}

export default function PortfolioSection({
  media,
  categories,
  isLoading,
}: PortfolioSectionProps) {
  const [activeFilter, setActiveFilter] = useState("All");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const displayMedia = media && media.length > 0 ? media : SAMPLE_MEDIA;
  const allCategories = [
    { id: "all", name: "All" },
    ...(categories && categories.length > 0
      ? categories
      : SAMPLE_CATEGORIES.filter((c) => c.id !== "all")),
  ];

  const filtered =
    activeFilter === "All"
      ? displayMedia
      : displayMedia.filter((m) => m.category === activeFilter);

  return (
    <section id="works" className="py-20 md:py-28">
      <div className="max-w-content mx-auto px-6 md:px-10">
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <p className="font-sans text-xs tracking-[0.25em] uppercase text-[oklch(0.45_0_0)] mb-3">
              Portfolio
            </p>
            <h2 className="section-title text-4xl md:text-5xl">
              Selected Works
            </h2>
          </div>

          <div
            className="flex flex-wrap gap-2"
            data-ocid="portfolio.filter.tab"
          >
            {allCategories.map((cat) => (
              <button
                type="button"
                key={cat.id}
                onClick={() => setActiveFilter(cat.name)}
                className={`font-sans text-[11px] tracking-[0.15em] uppercase px-4 py-2 border transition-colors ${
                  activeFilter === cat.name
                    ? "border-[oklch(0.65_0_0)] text-foreground bg-[oklch(0.18_0_0)]"
                    : "border-border text-[oklch(0.55_0_0)] hover:border-[oklch(0.40_0_0)] hover:text-[oklch(0.77_0_0)]"
                }`}
                data-ocid={`portfolio.filter.${cat.name.toLowerCase().replace(/\s+/g, "_")}.tab`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="masonry-grid" data-ocid="portfolio.loading_state">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                // biome-ignore lint/suspicious/noArrayIndexKey: skeleton placeholders have no stable id
                key={i}
                className="bg-[oklch(0.18_0_0)] animate-pulse"
                style={{ height: `${200 + (i % 3) * 80}px` }}
              />
            ))}
          </div>
        ) : (
          <div className="masonry-grid">
            {filtered.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: (idx % 6) * 0.07 }}
                className="relative group cursor-pointer overflow-hidden"
                onClick={() => setLightboxIndex(filtered.indexOf(item))}
                data-ocid={`portfolio.item.${idx + 1}`}
              >
                {item.mediaType === "video" ? (
                  <div className="relative">
                    <div className="w-full bg-[oklch(0.18_0_0)] aspect-video flex items-center justify-center">
                      {/* biome-ignore lint/a11y/useMediaCaption: captions not available for user-uploaded content */}
                      <video
                        src={item.blob.getDirectURL()}
                        className="w-full h-full object-cover"
                        muted
                        preload="metadata"
                      />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center bg-[oklch(0.09_0_0/0.4)]">
                      <div className="w-14 h-14 rounded-full border border-[oklch(0.95_0_0/0.7)] flex items-center justify-center">
                        <Play size={20} className="text-foreground ml-1" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <img
                    src={item.blob.getDirectURL()}
                    alt={item.title}
                    className="w-full h-auto block transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                )}

                <div className="absolute inset-0 bg-[oklch(0.09_0_0/0)] group-hover:bg-[oklch(0.09_0_0/0.5)] transition-all duration-300 flex items-end">
                  <div className="p-4 translate-y-3 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <p className="font-display text-sm text-foreground">
                      {item.title}
                    </p>
                    <p className="font-sans text-[10px] tracking-widest uppercase text-[oklch(0.65_0_0)] mt-1">
                      {item.category}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {filtered.length === 0 && !isLoading && (
          <div className="text-center py-16" data-ocid="portfolio.empty_state">
            <p className="font-sans text-sm text-[oklch(0.45_0_0)]">
              No items in this category yet.
            </p>
          </div>
        )}
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          items={filtered}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onPrev={() =>
            setLightboxIndex((prev) => Math.max(0, (prev ?? 0) - 1))
          }
          onNext={() =>
            setLightboxIndex((prev) =>
              Math.min(filtered.length - 1, (prev ?? 0) + 1),
            )
          }
        />
      )}
    </section>
  );
}
