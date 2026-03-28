import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  ChevronDown,
  ChevronRight,
  ImageIcon,
  Loader2,
  Pencil,
  Plus,
  Trash2,
  Upload,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ExternalBlob } from "../../backend";
import type { MediaItem, SubGallery } from "../../backend";
import {
  useCreateSubGallery,
  useDeleteMedia,
  useDeleteSubGallery,
  useListMediaBySubGallery,
  useListSubGalleries,
  useUpdateSubGalleryName,
  useUpdateSubGalleryThumbnail,
  useUploadMedia,
} from "../../hooks/useQueries";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Sub-component: Photos panel for a single sub-gallery
function SubGalleryPhotos({ subGallery }: { subGallery: SubGallery }) {
  const { data: photos, isLoading } = useListMediaBySubGallery(subGallery.id);
  const uploadMedia = useUploadMedia();
  const deleteMedia = useDeleteMedia();

  const [uploadOpen, setUploadOpen] = useState(false);
  const [photoTitle, setPhotoTitle] = useState("");
  const [photoDesc, setPhotoDesc] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);

  const handleUploadPhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoFile) {
      toast.error("Please select a photo");
      return;
    }
    if (!photoTitle.trim()) {
      toast.error("Title is required");
      return;
    }
    try {
      const bytes = new Uint8Array(await photoFile.arrayBuffer());
      const blob = ExternalBlob.fromBytes(bytes).withUploadProgress((pct) =>
        setProgress(pct),
      );
      const item: MediaItem = {
        id: crypto.randomUUID(),
        title: photoTitle.trim(),
        description: photoDesc.trim(),
        category: subGallery.id,
        mediaType: "photo",
        blob,
        position: BigInt(Date.now()),
      };
      await uploadMedia.mutateAsync(item);
      toast.success("Photo uploaded");
      setUploadOpen(false);
      setPhotoTitle("");
      setPhotoDesc("");
      setPhotoFile(null);
      setProgress(0);
    } catch {
      toast.error("Upload failed");
    }
  };

  const handleDeletePhoto = async (id: string) => {
    if (!confirm("Delete this photo?")) return;
    try {
      await deleteMedia.mutateAsync(id);
      toast.success("Photo deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="pt-4">
      <div className="flex items-center justify-between mb-4">
        <p className="font-sans text-xs tracking-[0.18em] uppercase text-[oklch(0.55_0_0)]">
          Photos
        </p>
        <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
          <DialogTrigger asChild>
            <Button
              size="sm"
              variant="outline"
              className="gap-1.5 text-xs"
              data-ocid="subgalleries.photo.upload_button"
            >
              <Upload size={12} /> Upload Photo
            </Button>
          </DialogTrigger>
          <DialogContent
            className="sm:max-w-md"
            data-ocid="subgalleries.photo.upload.dialog"
          >
            <DialogHeader>
              <DialogTitle className="font-display">
                Upload Photo to "{subGallery.name}"
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleUploadPhoto} className="space-y-4">
              <div>
                <Label htmlFor="photo-title">Title</Label>
                <Input
                  id="photo-title"
                  value={photoTitle}
                  onChange={(e) => setPhotoTitle(e.target.value)}
                  placeholder="e.g. Golden Hour"
                  required
                  data-ocid="subgalleries.photo.title.input"
                />
              </div>
              <div>
                <Label htmlFor="photo-desc">Description</Label>
                <Textarea
                  id="photo-desc"
                  value={photoDesc}
                  onChange={(e) => setPhotoDesc(e.target.value)}
                  placeholder="Optional description"
                  rows={2}
                  data-ocid="subgalleries.photo.description.textarea"
                />
              </div>
              <div>
                <Label htmlFor="photo-file">Photo File</Label>
                <input
                  id="photo-file"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setPhotoFile(e.target.files?.[0] ?? null)}
                  required
                  className="block w-full text-sm text-[oklch(0.65_0_0)] file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-secondary file:text-secondary-foreground file:text-xs file:font-medium hover:file:bg-accent cursor-pointer mt-1"
                  data-ocid="subgalleries.photo.file.upload_button"
                />
              </div>
              {progress > 0 && progress < 100 && (
                <div
                  className="text-xs text-[oklch(0.65_0_0)]"
                  data-ocid="subgalleries.photo.upload.loading_state"
                >
                  Uploading… {progress}%
                </div>
              )}
              <Button
                type="submit"
                disabled={uploadMedia.isPending}
                className="w-full"
                data-ocid="subgalleries.photo.upload.submit_button"
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
          className="flex items-center gap-2 text-[oklch(0.55_0_0)]"
          data-ocid="subgalleries.photos.loading_state"
        >
          <Loader2 size={14} className="animate-spin" />
          <span className="text-xs">Loading photos…</span>
        </div>
      ) : photos && photos.length > 0 ? (
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {photos.map((photo, idx) => (
            <div
              key={photo.id}
              className="relative group"
              data-ocid={`subgalleries.photo.item.${idx + 1}`}
            >
              <img
                src={photo.blob.getDirectURL()}
                alt={photo.title}
                className="w-full aspect-square object-cover"
              />
              <div className="absolute inset-0 bg-[oklch(0.09_0_0/0)] group-hover:bg-[oklch(0.09_0_0/0.7)] transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                <button
                  type="button"
                  onClick={() => handleDeletePhoto(photo.id)}
                  className="p-1.5 rounded-full border border-destructive text-destructive hover:bg-destructive hover:text-white transition-colors"
                  data-ocid={`subgalleries.photo.delete_button.${idx + 1}`}
                >
                  <Trash2 size={12} />
                </button>
              </div>
              <p className="text-[10px] text-[oklch(0.50_0_0)] mt-1 truncate">
                {photo.title}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div
          className="text-center py-8 border border-dashed border-border text-xs text-[oklch(0.45_0_0)]"
          data-ocid="subgalleries.photos.empty_state"
        >
          No photos yet. Upload your first photo.
        </div>
      )}
    </div>
  );
}

// Sub-component: Single sub-gallery row
function SubGalleryRow({ sg }: { sg: SubGallery }) {
  const [expanded, setExpanded] = useState(false);
  const [renameOpen, setRenameOpen] = useState(false);
  const [newName, setNewName] = useState(sg.name);
  const [thumbFile, setThumbFile] = useState<File | null>(null);
  const [thumbOpen, setThumbOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const updateName = useUpdateSubGalleryName();
  const updateThumb = useUpdateSubGalleryThumbnail();
  const deleteSubGallery = useDeleteSubGallery();

  const handleRename = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) {
      toast.error("Name cannot be empty");
      return;
    }
    try {
      await updateName.mutateAsync({ id: sg.id, newName: newName.trim() });
      toast.success("Gallery renamed");
      setRenameOpen(false);
    } catch {
      toast.error("Rename failed");
    }
  };

  const handleUpdateThumbnail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!thumbFile) {
      toast.error("Please select an image");
      return;
    }
    try {
      const bytes = new Uint8Array(await thumbFile.arrayBuffer());
      const blob = ExternalBlob.fromBytes(bytes);
      await updateThumb.mutateAsync({ id: sg.id, thumbnail: blob });
      toast.success("Thumbnail updated");
      setThumbOpen(false);
      setThumbFile(null);
    } catch {
      toast.error("Update failed");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteSubGallery.mutateAsync(sg.id);
      toast.success("Gallery deleted");
      setDeleteOpen(false);
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="border border-border bg-[oklch(0.12_0_0)] overflow-hidden">
      {/* Row header */}
      <div className="flex items-center gap-3 p-3">
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="flex items-center gap-3 flex-1 min-w-0 text-left"
          data-ocid="subgalleries.expand.toggle"
        >
          <img
            src={sg.thumbnail.getDirectURL()}
            alt={sg.name}
            className="w-12 h-12 object-cover flex-shrink-0"
          />
          <span className="font-sans text-sm text-foreground truncate flex-1">
            {sg.name}
          </span>
          {expanded ? (
            <ChevronDown
              size={14}
              className="text-[oklch(0.55_0_0)] flex-shrink-0"
            />
          ) : (
            <ChevronRight
              size={14}
              className="text-[oklch(0.55_0_0)] flex-shrink-0"
            />
          )}
        </button>

        {/* Actions */}
        <div className="flex items-center gap-1 flex-shrink-0">
          {/* Rename */}
          <Dialog open={renameOpen} onOpenChange={setRenameOpen}>
            <DialogTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                className="h-7 w-7 p-0 text-[oklch(0.55_0_0)] hover:text-foreground"
                title="Rename"
                data-ocid="subgalleries.rename.open_modal_button"
              >
                <Pencil size={12} />
              </Button>
            </DialogTrigger>
            <DialogContent
              className="sm:max-w-xs"
              data-ocid="subgalleries.rename.dialog"
            >
              <DialogHeader>
                <DialogTitle className="font-display">
                  Rename Gallery
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleRename} className="space-y-4">
                <div>
                  <Label htmlFor="rename-input">New Name</Label>
                  <Input
                    id="rename-input"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    required
                    data-ocid="subgalleries.rename.input"
                  />
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setRenameOpen(false)}
                    data-ocid="subgalleries.rename.cancel_button"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={updateName.isPending}
                    data-ocid="subgalleries.rename.confirm_button"
                  >
                    {updateName.isPending ? (
                      <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                    ) : null}
                    Save
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          {/* Change thumbnail */}
          <Dialog open={thumbOpen} onOpenChange={setThumbOpen}>
            <DialogTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                className="h-7 w-7 p-0 text-[oklch(0.55_0_0)] hover:text-foreground"
                title="Change Thumbnail"
                data-ocid="subgalleries.thumbnail.open_modal_button"
              >
                <ImageIcon size={12} />
              </Button>
            </DialogTrigger>
            <DialogContent
              className="sm:max-w-xs"
              data-ocid="subgalleries.thumbnail.dialog"
            >
              <DialogHeader>
                <DialogTitle className="font-display">
                  Change Thumbnail
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleUpdateThumbnail} className="space-y-4">
                <div>
                  <Label htmlFor="thumb-file">New Thumbnail</Label>
                  <input
                    id="thumb-file"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setThumbFile(e.target.files?.[0] ?? null)}
                    required
                    className="block w-full text-sm text-[oklch(0.65_0_0)] file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-secondary file:text-secondary-foreground file:text-xs file:font-medium hover:file:bg-accent cursor-pointer mt-1"
                    data-ocid="subgalleries.thumbnail.upload_button"
                  />
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setThumbOpen(false)}
                    data-ocid="subgalleries.thumbnail.cancel_button"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={updateThumb.isPending}
                    data-ocid="subgalleries.thumbnail.confirm_button"
                  >
                    {updateThumb.isPending ? (
                      <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                    ) : null}
                    Update
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          {/* Delete */}
          <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
            <DialogTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                className="h-7 w-7 p-0 text-[oklch(0.55_0_0)] hover:text-destructive"
                title="Delete Gallery"
                data-ocid="subgalleries.delete.open_modal_button"
              >
                <Trash2 size={12} />
              </Button>
            </DialogTrigger>
            <DialogContent
              className="sm:max-w-xs"
              data-ocid="subgalleries.delete.dialog"
            >
              <DialogHeader>
                <DialogTitle className="font-display">
                  Delete Gallery
                </DialogTitle>
              </DialogHeader>
              <p className="text-sm text-[oklch(0.60_0_0)]">
                Are you sure you want to delete "{sg.name}"? This cannot be
                undone.
              </p>
              <DialogFooter>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setDeleteOpen(false)}
                  data-ocid="subgalleries.delete.cancel_button"
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={deleteSubGallery.isPending}
                  data-ocid="subgalleries.delete.confirm_button"
                >
                  {deleteSubGallery.isPending ? (
                    <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                  ) : null}
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Expanded photos panel */}
      {expanded && (
        <>
          <Separator />
          <div className="p-4">
            <SubGalleryPhotos subGallery={sg} />
          </div>
        </>
      )}
    </div>
  );
}

export default function SubGalleriesTab() {
  const { data: subGalleries, isLoading } = useListSubGalleries();
  const createSubGallery = useCreateSubGallery();

  const [createOpen, setCreateOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [thumbFile, setThumbFile] = useState<File | null>(null);
  const [createProgress, setCreateProgress] = useState(0);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) {
      toast.error("Gallery name is required");
      return;
    }
    if (!thumbFile) {
      toast.error("Thumbnail image is required");
      return;
    }
    try {
      const bytes = new Uint8Array(await thumbFile.arrayBuffer());
      const blob = ExternalBlob.fromBytes(bytes).withUploadProgress((pct) =>
        setCreateProgress(pct),
      );
      const id = `sg-${slugify(newName.trim())}-${Date.now().toString(36)}`;
      await createSubGallery.mutateAsync({
        id,
        name: newName.trim(),
        thumbnail: blob,
        position: BigInt(Date.now()),
      });
      toast.success("Gallery created");
      setCreateOpen(false);
      setNewName("");
      setThumbFile(null);
      setCreateProgress(0);
    } catch {
      toast.error("Failed to create gallery");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-xl text-foreground">Sub-Galleries</h2>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button
              size="sm"
              className="gap-2"
              data-ocid="subgalleries.create.open_modal_button"
            >
              <Plus size={14} /> Add Gallery
            </Button>
          </DialogTrigger>
          <DialogContent
            className="sm:max-w-md"
            data-ocid="subgalleries.create.dialog"
          >
            <DialogHeader>
              <DialogTitle className="font-display">
                Add New Gallery
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <Label htmlFor="sg-name">Gallery Name</Label>
                <Input
                  id="sg-name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Wildlife"
                  required
                  data-ocid="subgalleries.create.input"
                />
              </div>
              <div>
                <Label htmlFor="sg-thumb">Thumbnail Image</Label>
                <input
                  id="sg-thumb"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setThumbFile(e.target.files?.[0] ?? null)}
                  required
                  className="block w-full text-sm text-[oklch(0.65_0_0)] file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-secondary file:text-secondary-foreground file:text-xs file:font-medium hover:file:bg-accent cursor-pointer mt-1"
                  data-ocid="subgalleries.create.upload_button"
                />
              </div>
              {createProgress > 0 && createProgress < 100 && (
                <div
                  className="text-xs text-[oklch(0.65_0_0)]"
                  data-ocid="subgalleries.create.loading_state"
                >
                  Uploading… {createProgress}%
                </div>
              )}
              <DialogFooter>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setCreateOpen(false)}
                  data-ocid="subgalleries.create.cancel_button"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createSubGallery.isPending}
                  data-ocid="subgalleries.create.submit_button"
                >
                  {createSubGallery.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  {createSubGallery.isPending
                    ? "Creating..."
                    : "Create Gallery"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div
          className="flex items-center gap-2 text-[oklch(0.60_0_0)]"
          data-ocid="subgalleries.loading_state"
        >
          <Loader2 className="animate-spin" size={16} />
          <span className="text-sm">Loading galleries…</span>
        </div>
      ) : subGalleries && subGalleries.length > 0 ? (
        <div className="space-y-2">
          {subGalleries.map((sg, idx) => (
            <div key={sg.id} data-ocid={`subgalleries.item.${idx + 1}`}>
              <SubGalleryRow sg={sg} />
            </div>
          ))}
        </div>
      ) : (
        <div
          className="text-center py-16 border border-dashed border-border"
          data-ocid="subgalleries.empty_state"
        >
          <p className="font-sans text-sm text-[oklch(0.45_0_0)]">
            No galleries yet. Click "Add Gallery" to create your first one.
          </p>
        </div>
      )}
    </div>
  );
}
