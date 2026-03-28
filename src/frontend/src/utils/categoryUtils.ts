import type { Category } from "../backend";

/**
 * Section type is encoded in the category ID prefix:
 * - "g-" prefix = gallery section
 * - "v-" prefix = video section
 * - no prefix = gallery (legacy/default)
 */
export function getSectionType(cat: Category): "gallery" | "video" {
  if (cat.id.startsWith("v-")) return "video";
  return "gallery";
}

export function isGalleryCategory(cat: Category): boolean {
  return getSectionType(cat) === "gallery";
}

export function isVideoCategory(cat: Category): boolean {
  return getSectionType(cat) === "video";
}

export function makeCategoryId(
  name: string,
  sectionType: "gallery" | "video",
): string {
  const slug = name.trim().toLowerCase().replace(/\s+/g, "-");
  return sectionType === "video" ? `v-${slug}` : `g-${slug}`;
}
