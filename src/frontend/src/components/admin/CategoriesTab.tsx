import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  useCreateCategory,
  useDeleteCategory,
  useListCategories,
} from "../../hooks/useQueries";
import {
  isGalleryCategory,
  isVideoCategory,
  makeCategoryId,
} from "../../utils/categoryUtils";

export default function CategoriesTab() {
  const { data: categories, isLoading } = useListCategories();
  const createCategory = useCreateCategory();
  const deleteCategory = useDeleteCategory();

  const [name, setName] = useState("");
  const [sectionType, setSectionType] = useState<"gallery" | "video">(
    "gallery",
  );

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      const id = makeCategoryId(name.trim(), sectionType);
      await createCategory.mutateAsync({ id, name: name.trim() });
      toast.success("Genre created");
      setName("");
    } catch {
      toast.error("Failed to create genre");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this genre?")) return;
    try {
      await deleteCategory.mutateAsync(id);
      toast.success("Genre deleted");
    } catch {
      toast.error("Failed to delete genre");
    }
  };

  const galleryCategories = categories?.filter(isGalleryCategory) ?? [];
  const videoCategories = categories?.filter(isVideoCategory) ?? [];

  return (
    <div className="max-w-lg">
      <h2 className="font-display text-xl text-foreground mb-6">Genres</h2>

      <form
        onSubmit={handleCreate}
        className="space-y-3 mb-8"
        data-ocid="categories.form"
      >
        <div className="flex gap-2">
          <div className="flex-1">
            <Label htmlFor="cat-name" className="sr-only">
              Genre name
            </Label>
            <Input
              id="cat-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Genre name (e.g. Wildlife, Wedding)"
              required
              data-ocid="categories.name.input"
            />
          </div>
          <div className="w-36">
            <Label className="sr-only">Section</Label>
            <Select
              value={sectionType}
              onValueChange={(v) => setSectionType(v as "gallery" | "video")}
            >
              <SelectTrigger data-ocid="categories.section.select">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gallery">Gallery</SelectItem>
                <SelectItem value="video">Video</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            type="submit"
            disabled={createCategory.isPending}
            data-ocid="categories.add_button"
          >
            {createCategory.isPending ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Plus size={14} />
            )}
          </Button>
        </div>
        <p className="text-[11px] text-[oklch(0.45_0_0)]">
          Choose whether this genre belongs to the Gallery or Video section.
        </p>
      </form>

      {isLoading ? (
        <div
          className="flex items-center gap-2 text-[oklch(0.60_0_0)]"
          data-ocid="categories.loading_state"
        >
          <Loader2 className="animate-spin" size={16} />
          <span className="text-sm">Loading...</span>
        </div>
      ) : (
        <div className="space-y-6">
          <div>
            <h3 className="font-sans text-xs tracking-[0.2em] uppercase text-[oklch(0.45_0_0)] mb-3">
              Gallery Genres
            </h3>
            {galleryCategories.length > 0 ? (
              <ul className="space-y-2">
                {galleryCategories.map((cat, idx) => (
                  <li
                    key={cat.id}
                    className="flex items-center justify-between py-3 px-4 border border-border"
                    data-ocid={`categories.gallery.item.${idx + 1}`}
                  >
                    <span className="font-sans text-sm text-foreground">
                      {cat.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDelete(cat.id)}
                      className="text-[oklch(0.45_0_0)] hover:text-destructive transition-colors"
                      data-ocid={`categories.delete_button.${idx + 1}`}
                      aria-label={`Delete ${cat.name}`}
                    >
                      <Trash2 size={14} />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p
                className="font-sans text-sm text-[oklch(0.45_0_0)] py-3 px-4 border border-dashed border-border"
                data-ocid="categories.gallery.empty_state"
              >
                No gallery genres yet.
              </p>
            )}
          </div>

          <div>
            <h3 className="font-sans text-xs tracking-[0.2em] uppercase text-[oklch(0.45_0_0)] mb-3">
              Video Genres
            </h3>
            {videoCategories.length > 0 ? (
              <ul className="space-y-2">
                {videoCategories.map((cat, idx) => (
                  <li
                    key={cat.id}
                    className="flex items-center justify-between py-3 px-4 border border-border"
                    data-ocid={`categories.video.item.${idx + 1}`}
                  >
                    <span className="font-sans text-sm text-foreground">
                      {cat.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDelete(cat.id)}
                      className="text-[oklch(0.45_0_0)] hover:text-destructive transition-colors"
                      data-ocid={`categories.video.delete_button.${idx + 1}`}
                      aria-label={`Delete ${cat.name}`}
                    >
                      <Trash2 size={14} />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p
                className="font-sans text-sm text-[oklch(0.45_0_0)] py-3 px-4 border border-dashed border-border"
                data-ocid="categories.video.empty_state"
              >
                No video genres yet.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
