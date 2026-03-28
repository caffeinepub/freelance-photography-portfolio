import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect } from "react";
import type { MediaItem } from "../backend";

interface LightboxProps {
  items: MediaItem[];
  currentIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export default function Lightbox({
  items,
  currentIndex,
  onClose,
  onPrev,
  onNext,
}: LightboxProps) {
  const item = items[currentIndex];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose, onPrev, onNext]);

  if (!item) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-[oklch(0.05_0_0/0.97)] flex items-center justify-center"
        onClick={onClose}
        data-ocid="lightbox.modal"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-6 right-6 text-[oklch(0.65_0_0)] hover:text-foreground transition-colors"
          data-ocid="lightbox.close_button"
        >
          <X size={24} />
        </button>

        {currentIndex > 0 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onPrev();
            }}
            className="absolute left-6 top-1/2 -translate-y-1/2 text-[oklch(0.65_0_0)] hover:text-foreground transition-colors"
            data-ocid="lightbox.prev_button"
          >
            <ChevronLeft size={32} />
          </button>
        )}

        {currentIndex < items.length - 1 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
            className="absolute right-6 top-1/2 -translate-y-1/2 text-[oklch(0.65_0_0)] hover:text-foreground transition-colors"
            data-ocid="lightbox.next_button"
          >
            <ChevronRight size={32} />
          </button>
        )}

        <motion.div
          key={item.id}
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.25 }}
          className="max-w-5xl max-h-[85vh] w-full mx-16 flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {item.mediaType === "video" ? (
            // biome-ignore lint/a11y/useMediaCaption: captions not available for user-uploaded content
            <video
              src={item.blob.getDirectURL()}
              controls
              className="w-full max-h-[75vh] object-contain"
            />
          ) : (
            <img
              src={item.blob.getDirectURL()}
              alt={item.title}
              className="w-full max-h-[75vh] object-contain"
            />
          )}
          <div className="mt-4 flex items-start justify-between px-1">
            <div>
              <h3 className="font-display text-lg text-foreground">
                {item.title}
              </h3>
              {item.description && (
                <p className="font-sans text-sm text-[oklch(0.65_0_0)] mt-1">
                  {item.description}
                </p>
              )}
            </div>
            <span className="font-sans text-xs tracking-widest uppercase text-[oklch(0.45_0_0)]">
              {item.category}
            </span>
          </div>
        </motion.div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 font-sans text-xs text-[oklch(0.45_0_0)] tracking-widest">
          {currentIndex + 1} / {items.length}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
