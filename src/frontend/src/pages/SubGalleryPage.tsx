import Lightbox from "@/components/Lightbox";
import { useParams } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import type { MediaItem } from "../backend";
import {
  useListMediaBySubGallery,
  useListSubGalleries,
} from "../hooks/useQueries";

const SKELETONS = [
  { key: "sk-a", h: 280 },
  { key: "sk-b", h: 360 },
  { key: "sk-c", h: 200 },
  { key: "sk-d", h: 320 },
  { key: "sk-e", h: 240 },
  { key: "sk-f", h: 300 },
];

const SAMPLE_PHOTOS: Record<string, MediaItem[]> = {
  "sg-wildlife": [
    {
      id: "sp-w1",
      title: "Into the Mist",
      description: "Ancient forest at first light",
      mediaType: "photo",
      category: "sg-wildlife",
      position: BigInt(1),
      blob: {
        getDirectURL: () =>
          "/assets/generated/portfolio-wild-1.dim_800x1000.jpg",
      } as any,
    },
    {
      id: "sp-w2",
      title: "Summit",
      description: "High alpine wilderness at dusk",
      mediaType: "photo",
      category: "sg-wildlife",
      position: BigInt(2),
      blob: {
        getDirectURL: () =>
          "/assets/generated/portfolio-wild-2.dim_800x600.jpg",
      } as any,
    },
  ],
  "sg-portrait": [
    {
      id: "sp-p1",
      title: "Inner Light",
      description: "Studio portrait — natural directional light",
      mediaType: "photo",
      category: "sg-portrait",
      position: BigInt(1),
      blob: {
        getDirectURL: () =>
          "/assets/generated/portfolio-portrait-1.dim_700x900.jpg",
      } as any,
    },
  ],
  "sg-landscape": [
    {
      id: "sp-l1",
      title: "Coastal Solitude",
      description: "Dawn light breaking over the coastline",
      mediaType: "photo",
      category: "sg-landscape",
      position: BigInt(1),
      blob: {
        getDirectURL: () =>
          "/assets/generated/hero-coastline.dim_1920x1080.jpg",
      } as any,
    },
  ],
  "sg-street": [
    {
      id: "sp-s1",
      title: "City Pulse",
      description: "Urban reflections after midnight rain",
      mediaType: "photo",
      category: "sg-street",
      position: BigInt(1),
      blob: {
        getDirectURL: () =>
          "/assets/generated/portfolio-city-1.dim_900x600.jpg",
      } as any,
    },
  ],
  "sg-events": [
    {
      id: "sp-e1",
      title: "Celebration",
      description: "Evening reception at Villa Hermosa",
      mediaType: "photo",
      category: "sg-events",
      position: BigInt(1),
      blob: {
        getDirectURL: () =>
          "/assets/generated/portfolio-events-1.dim_900x600.jpg",
      } as any,
    },
  ],
};

export default function SubGalleryPage() {
  const { subGalleryId } = useParams({ from: "/gallery/$subGalleryId" });
  const { data: subGalleries, isLoading: sgLoading } = useListSubGalleries();
  const { data: photos, isLoading: photosLoading } =
    useListMediaBySubGallery(subGalleryId);

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const subGallery = subGalleries?.find((sg) => sg.id === subGalleryId);
  const displayPhotos =
    photos && photos.length > 0 ? photos : (SAMPLE_PHOTOS[subGalleryId] ?? []);

  const isLoading = sgLoading || photosLoading;

  return (
    <div className="min-h-screen bg-background">
      {/* Header bar */}
      <header className="sticky top-0 z-40 bg-[oklch(0.09_0_0/0.95)] backdrop-blur border-b border-border">
        <div className="max-w-content mx-auto px-6 md:px-10 h-14 flex items-center">
          <a
            href="/#gallery"
            className="font-sans text-xs tracking-[0.18em] uppercase text-[oklch(0.55_0_0)] hover:text-foreground transition-colors inline-flex items-center gap-2"
            data-ocid="subgallery.back.link"
          >
            <ArrowLeft size={14} />
            Galleries
          </a>
        </div>
      </header>

      <main className="max-w-content mx-auto px-6 md:px-10 py-16">
        {/* Heading */}
        <div className="mb-12">
          {isLoading ? (
            <div className="h-12 w-48 bg-[oklch(0.18_0_0)] animate-pulse rounded" />
          ) : (
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="section-title text-4xl md:text-5xl"
            >
              {subGallery?.name ?? subGalleryId}
            </motion.h1>
          )}
        </div>

        {isLoading ? (
          <div className="masonry-grid" data-ocid="subgallery.loading_state">
            {SKELETONS.map(({ key, h }) => (
              <div
                key={key}
                className="bg-[oklch(0.18_0_0)] animate-pulse"
                style={{ height: `${h}px` }}
              />
            ))}
          </div>
        ) : displayPhotos.length === 0 ? (
          <div
            className="text-center py-24 border border-dashed border-border"
            data-ocid="subgallery.empty_state"
          >
            <p className="font-sans text-sm text-[oklch(0.45_0_0)]">
              No photos in this gallery yet.
            </p>
          </div>
        ) : (
          <div className="masonry-grid">
            {displayPhotos.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: (idx % 6) * 0.07 }}
                className="relative group cursor-pointer overflow-hidden"
                onClick={() => setLightboxIndex(idx)}
                data-ocid={`subgallery.item.${idx + 1}`}
              >
                <img
                  src={item.blob.getDirectURL()}
                  alt={item.title}
                  className="w-full h-auto block transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-[oklch(0.09_0_0/0)] group-hover:bg-[oklch(0.09_0_0/0.5)] transition-all duration-300 flex items-end">
                  <div className="p-4 translate-y-3 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <p className="font-display text-sm text-foreground">
                      {item.title}
                    </p>
                    {item.description && (
                      <p className="font-sans text-[10px] tracking-widest uppercase text-[oklch(0.65_0_0)] mt-1">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      {lightboxIndex !== null && (
        <Lightbox
          items={displayPhotos}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onPrev={() =>
            setLightboxIndex((prev) => Math.max(0, (prev ?? 0) - 1))
          }
          onNext={() =>
            setLightboxIndex((prev) =>
              Math.min(displayPhotos.length - 1, (prev ?? 0) + 1),
            )
          }
        />
      )}
    </div>
  );
}
