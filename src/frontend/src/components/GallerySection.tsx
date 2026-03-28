import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "motion/react";
import type { SubGallery } from "../backend";
import { useListSubGalleries } from "../hooks/useQueries";

const SAMPLE_SUB_GALLERIES: SubGallery[] = [
  {
    id: "sg-wildlife",
    name: "Wildlife",
    position: BigInt(1),
    thumbnail: {
      getDirectURL: () => "/assets/generated/portfolio-wild-1.dim_800x1000.jpg",
    } as any,
  },
  {
    id: "sg-portrait",
    name: "Portrait",
    position: BigInt(2),
    thumbnail: {
      getDirectURL: () =>
        "/assets/generated/portfolio-portrait-1.dim_700x900.jpg",
    } as any,
  },
  {
    id: "sg-landscape",
    name: "Landscape",
    position: BigInt(3),
    thumbnail: {
      getDirectURL: () => "/assets/generated/hero-coastline.dim_1920x1080.jpg",
    } as any,
  },
  {
    id: "sg-street",
    name: "Street",
    position: BigInt(4),
    thumbnail: {
      getDirectURL: () => "/assets/generated/portfolio-city-1.dim_900x600.jpg",
    } as any,
  },
  {
    id: "sg-events",
    name: "Events",
    position: BigInt(5),
    thumbnail: {
      getDirectURL: () =>
        "/assets/generated/portfolio-events-1.dim_900x600.jpg",
    } as any,
  },
];

export default function GallerySection() {
  const { data: subGalleries, isLoading } = useListSubGalleries();

  const displayGalleries =
    subGalleries && subGalleries.length > 0
      ? subGalleries
      : SAMPLE_SUB_GALLERIES;

  return (
    <section id="gallery" className="py-20 md:py-28">
      <div className="max-w-content mx-auto px-6 md:px-10">
        <div className="mb-12">
          <p className="font-sans text-xs tracking-[0.25em] uppercase text-[oklch(0.45_0_0)] mb-3">
            Portfolio
          </p>
          <h2 className="section-title text-4xl md:text-5xl">GALLERIES</h2>
        </div>

        {isLoading ? (
          <div
            className="grid grid-cols-2 md:grid-cols-3 gap-4"
            data-ocid="gallery.loading_state"
          >
            {Array.from({ length: 6 }).map((_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: skeleton placeholders
              <Skeleton key={i} className="aspect-[4/5] w-full" />
            ))}
          </div>
        ) : displayGalleries.length === 0 ? (
          <div className="text-center py-16" data-ocid="gallery.empty_state">
            <p className="font-sans text-sm text-[oklch(0.45_0_0)]">
              No galleries yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {displayGalleries.map((sg, idx) => (
              <motion.div
                key={sg.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: (idx % 6) * 0.08 }}
                className="group cursor-pointer relative overflow-hidden aspect-[4/5] bg-[oklch(0.18_0_0)]"
                onClick={() => {
                  window.location.href = `/gallery/${sg.id}`;
                }}
                data-ocid={`gallery.item.${idx + 1}`}
              >
                <img
                  src={sg.thumbnail.getDirectURL()}
                  alt={sg.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                {/* Dark gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.04_0_0/0.85)] via-[oklch(0.04_0_0/0.2)] to-transparent" />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-[oklch(0.09_0_0/0)] group-hover:bg-[oklch(0.09_0_0/0.25)] transition-all duration-400" />
                {/* Name */}
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <p className="font-sans text-xs tracking-[0.22em] uppercase text-[oklch(0.65_0_0)] mb-1">
                    Gallery
                  </p>
                  <h3 className="font-display text-xl md:text-2xl text-white leading-tight">
                    {sg.name}
                  </h3>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
