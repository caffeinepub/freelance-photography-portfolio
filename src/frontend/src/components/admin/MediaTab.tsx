import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Plus, Star, Trash2, Upload } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ExternalBlob } from "../../backend";
import type { MediaItem } from "../../backend";
import {
  useClearFeaturedMedia,
  useDeleteMedia,
  useGetFeaturedMedia,
  useListAllMedia,
  useListCategories,
  useSetFeaturedMedia,
  useUploadMedia,
} from "../../hooks/useQueries";
import { isGalleryCategory, isVideoCategory } from "../../utils/categoryUtils";

export default function MediaTab() {
  const { data: media, isLoading } = useListAllMedia();
  const { data: categories } = useListCategories();
  const { data: featured } = useGetFeaturedMedia();
  const uploadMedia = useUploadMedia();
  const deleteMedia = useDeleteMedia();
  const setFeatured = useSetFeaturedMedia();
  const clearFeatured = useClearFeaturedMedia();

  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [mediaType, setMediaType] = useState<"photo" | "video">("photo");
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const filteredCategories =
    categories?.filter((c) =>
      mediaType === "photo" ? isGalleryCategory(c) : isVideoCategory(c),
    ) ?? [];

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please select a file");
      return;
    }
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    try {
      const bytes = new Uint8Array(await file.arrayBuffer());
      const blob = ExternalBlob.fromBytes(bytes).withUploadProgress((pct) =>
        setUploadProgress(pct),
      );
      const item: MediaItem = {
        id: crypto.randomUUID(),
        title: title.trim(),
        description: description.trim(),
        category: category || "Uncategorized",
        mediaType,
        blob,
        position: BigInt(Date.now()),
      };
      await uploadMedia.mutateAsync(item);
      toast.success("Media uploaded successfully");
      setOpen(false);
      setTitle("");
      setDescription("");
      setCategory("");
      setFile(null);
      setUploadProgress(0);
    } catch {
      toast.error("Upload failed");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this media item?")) return;
    try {
      await deleteMedia.mutateAsync(id);
      toast.success("Deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  const handleSetFeatured = async (id: string) => {
    try {
      if (featured?.id === id) {
        await clearFeatured.mutateAsync();
        toast.success("Featured cleared");
      } else {
        await setFeatured.mutateAsync(id);
        toast.success("Set as featured hero item");
      }
    } catch {
      toast.error("Failed");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-xl text-foreground">Media Library</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2" data-ocid="media.upload_button">
              <Plus size={14} /> Upload Media
            </Button>
          </DialogTrigger>
          <DialogContent
            className="sm:max-w-md"
            data-ocid="media.upload.dialog"
          >
            <DialogHeader>
              <DialogTitle className="font-display">
                Upload New Media
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <Label htmlFor="media-title">Title</Label>
                <Input
                  id="media-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Coastal Solitude"
                  required
                  data-ocid="media.title.input"
                />
              </div>
              <div>
                <Label htmlFor="media-desc">Description</Label>
                <Textarea
                  id="media-desc"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Optional description"
                  rows={2}
                  data-ocid="media.description.textarea"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Media Type</Label>
                  <Select
                    value={mediaType}
                    onValueChange={(v) => {
                      setMediaType(v as "photo" | "video");
                      setCategory("");
                    }}
                  >
                    <SelectTrigger data-ocid="media.type.select">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="photo">Photo</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Genre</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger data-ocid="media.category.select">
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredCategories.map((c) => (
                        <SelectItem key={c.id} value={c.name}>
                          {c.name}
                        </SelectItem>
                      ))}
                      <SelectItem value="Uncategorized">
                        Uncategorized
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="media-file">File</Label>
                <input
                  id="media-file"
                  type="file"
                  accept={mediaType === "photo" ? "image/*" : "video/*"}
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                  required
                  className="block w-full text-sm text-[oklch(0.65_0_0)] file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-secondary file:text-secondary-foreground file:text-xs file:font-medium hover:file:bg-accent cursor-pointer mt-1"
                  data-ocid="media.file.upload_button"
                />
              </div>
              {uploadProgress > 0 && uploadProgress < 100 && (
                <div
                  className="text-xs text-[oklch(0.65_0_0)]"
                  data-ocid="media.upload.loading_state"
                >
                  Uploading… {uploadProgress}%
                </div>
              )}
              <Button
                type="submit"
                disabled={uploadMedia.isPending}
                className="w-full"
                data-ocid="media.upload.submit_button"
              >
                {uploadMedia.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Upload size={14} className="mr-2" />
                )}
                {uploadMedia.isPending ? "Uploading..." : "Upload"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div
          className="flex items-center gap-2 text-[oklch(0.60_0_0)]"
          data-ocid="media.loading_state"
        >
          <Loader2 className="animate-spin" size={16} />
          <span className="text-sm">Loading media...</span>
        </div>
      ) : media && media.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {media.map((item, idx) => (
            <div
              key={item.id}
              className="relative group"
              data-ocid={`media.item.${idx + 1}`}
            >
              {item.mediaType === "photo" ? (
                <img
                  src={item.blob.getDirectURL()}
                  alt={item.title}
                  className="w-full aspect-square object-cover"
                />
              ) : (
                <div className="w-full aspect-square bg-[oklch(0.18_0_0)] flex items-center justify-center">
                  {/* biome-ignore lint/a11y/useMediaCaption: captions not available for user-uploaded content */}
                  <video
                    src={item.blob.getDirectURL()}
                    className="w-full h-full object-cover"
                    muted
                  />
                </div>
              )}
              <div className="absolute inset-0 bg-[oklch(0.09_0_0/0)] group-hover:bg-[oklch(0.09_0_0/0.7)] transition-all flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                <button
                  type="button"
                  onClick={() => handleSetFeatured(item.id)}
                  className={`p-2 rounded-full border transition-colors ${
                    featured?.id === item.id
                      ? "border-yellow-400 text-yellow-400"
                      : "border-border text-[oklch(0.65_0_0)] hover:text-foreground"
                  }`}
                  title={
                    featured?.id === item.id
                      ? "Remove from featured"
                      : "Set as hero"
                  }
                  data-ocid={`media.featured.toggle.${idx + 1}`}
                >
                  <Star
                    size={14}
                    fill={featured?.id === item.id ? "currentColor" : "none"}
                  />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(item.id)}
                  className="p-2 rounded-full border border-border text-[oklch(0.65_0_0)] hover:text-destructive hover:border-destructive transition-colors"
                  title="Delete"
                  data-ocid={`media.delete_button.${idx + 1}`}
                >
                  <Trash2 size={14} />
                </button>
              </div>
              <p className="text-xs text-[oklch(0.60_0_0)] mt-1 truncate px-0.5">
                {item.title}
              </p>
              <p className="text-[10px] text-[oklch(0.40_0_0)] px-0.5">
                {item.category}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div
          className="text-center py-16 border border-dashed border-border"
          data-ocid="media.empty_state"
        >
          <p className="font-sans text-sm text-[oklch(0.45_0_0)]">
            No media uploaded yet. Click "Upload Media" to get started.
          </p>
        </div>
      )}
    </div>
  );
}
