import { Play } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import type { Category, MediaItem } from "../backend";
import { isVideoCategory } from "../utils/categoryUtils";

const SAMPLE_VIDEOS = [
  {
    id: "sv1",
    title: "Chasing Light — Patagonia",
    description:
      "A cinematic journey through the raw wilderness of Patagonia. Wind, ice, and silence. Shot on 4K over three weeks.",
    category: "Documentary",
    thumbnail: "/assets/generated/portfolio-wild-2.dim_800x600.jpg",
    url: null as string | null,
  },
  {
    id: "sv2",
    title: "Urban Stories — São Paulo",
    description:
      "Street photography meets motion. A love letter to the energy, chaos, and humanity of South America's largest city.",
    category: "Commercial",
    thumbnail: "/assets/generated/portfolio-city-1.dim_900x600.jpg",
    url: null as string | null,
  },
];

const SAMPLE_CATEGORIES: Category[] = [
  { id: "v-documentary", name: "Documentary" },
  { id: "v-wedding", name: "Wedding" },
  { id: "v-commercial", name: "Commercial" },
  { id: "v-bts", name: "Behind the Scenes" },
];

interface VideoSectionProps {
  videos: MediaItem[];
  categories: Category[];
}

export default function VideoSection({
  videos,
  categories,
}: VideoSectionProps) {
  const [playing, setPlaying] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState("All");

  const videoCats = categories.filter(isVideoCategory);
  const displayCategories =
    videoCats.length > 0 ? videoCats : SAMPLE_CATEGORIES;
  const allCategories: Category[] = [
    { id: "all", name: "All" },
    ...displayCategories,
  ];

  const displayVideos =
    videos.length > 0
      ? videos.map((v) => ({
          id: v.id,
          title: v.title,
          description: v.description,
          category: v.category,
          url: v.blob.getDirectURL(),
          thumbnail: null as string | null,
        }))
      : SAMPLE_VIDEOS;

  const filtered =
    activeFilter === "All"
      ? displayVideos
      : displayVideos.filter((v) => v.category === activeFilter);

  return (
    <section id="videos" className="py-20 bg-[oklch(0.10_0_0)]">
      <div className="max-w-content mx-auto px-6 md:px-10">
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <p className="font-sans text-xs tracking-[0.25em] uppercase text-[oklch(0.45_0_0)] mb-3">
              Motion
            </p>
            <h2 className="section-title text-4xl md:text-5xl">VIDEOS</h2>
          </div>

          <div className="flex flex-wrap gap-2" data-ocid="videos.filter.tab">
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
                data-ocid={`videos.filter.${cat.id}.tab`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16" data-ocid="videos.empty_state">
            <p className="font-sans text-sm text-[oklch(0.45_0_0)]">
              No videos in this genre yet.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {filtered.map((video, idx) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                className="group"
                data-ocid={`videos.item.${idx + 1}`}
              >
                <div className="relative aspect-video bg-[oklch(0.14_0_0)] overflow-hidden">
                  {playing === video.id && video.url ? (
                    // biome-ignore lint/a11y/useMediaCaption: captions not available for user-uploaded content
                    <video
                      src={video.url}
                      controls
                      autoPlay
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <>
                      <img
                        src={
                          video.thumbnail ??
                          "/assets/generated/portfolio-wild-2.dim_800x600.jpg"
                        }
                        alt={video.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-[oklch(0.09_0_0/0.4)] flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() => video.url && setPlaying(video.id)}
                          className={`w-16 h-16 rounded-full border border-[oklch(0.95_0_0/0.6)] flex items-center justify-center transition-all duration-300 ${
                            video.url
                              ? "hover:bg-[oklch(0.95_0_0/0.1)] cursor-pointer"
                              : "cursor-default opacity-60"
                          }`}
                          data-ocid={`videos.play.button.${idx + 1}`}
                          aria-label={`Play ${video.title}`}
                        >
                          <Play size={22} className="text-foreground ml-1" />
                        </button>
                      </div>
                    </>
                  )}
                </div>

                <div className="mt-4">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-display text-xl text-foreground">
                      {video.title}
                    </h3>
                    <span className="font-sans text-[10px] tracking-widest uppercase text-[oklch(0.45_0_0)] border border-border px-2 py-0.5">
                      {video.category}
                    </span>
                  </div>
                  <p className="font-sans text-sm text-[oklch(0.60_0_0)] mt-1 leading-relaxed">
                    {video.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
