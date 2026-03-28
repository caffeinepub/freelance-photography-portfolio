import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ExternalBlob } from "../../backend";
import { useGetAboutSection, useUpdateAbout } from "../../hooks/useQueries";

export default function AboutTab() {
  const { data: about, isLoading } = useGetAboutSection();
  const updateAbout = useUpdateAbout();

  const [bio, setBio] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (about?.bio) setBio(about.bio);
    if (about?.profilePhoto) setPreview(about.profilePhoto.getDirectURL());
  }, [about]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let photoBlob: ExternalBlob | null = about?.profilePhoto ?? null;
      if (photoFile) {
        const bytes = new Uint8Array(await photoFile.arrayBuffer());
        photoBlob = ExternalBlob.fromBytes(bytes);
      }
      await updateAbout.mutateAsync({ bio, profilePhoto: photoBlob });
      toast.success("About section updated");
    } catch {
      toast.error("Update failed");
    }
  };

  if (isLoading) {
    return (
      <div
        className="flex items-center gap-2 text-[oklch(0.60_0_0)]"
        data-ocid="about.loading_state"
      >
        <Loader2 className="animate-spin" size={16} />
        <span className="text-sm">Loading...</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="max-w-xl space-y-6">
      <h2 className="font-display text-xl text-foreground">About Section</h2>

      <div>
        <Label htmlFor="about-bio">Bio</Label>
        <Textarea
          id="about-bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={8}
          placeholder="Write your bio..."
          data-ocid="about.bio.textarea"
        />
      </div>

      <div>
        <Label htmlFor="about-photo">Profile Photo</Label>
        {preview && (
          <img
            src={preview}
            alt="Profile"
            className="w-32 h-40 object-cover mb-3 border border-border"
          />
        )}
        <input
          id="about-photo"
          type="file"
          accept="image/*"
          onChange={(e) => {
            const f = e.target.files?.[0] ?? null;
            setPhotoFile(f);
            if (f) setPreview(URL.createObjectURL(f));
          }}
          className="block w-full text-sm text-[oklch(0.65_0_0)] file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-secondary file:text-secondary-foreground file:text-xs hover:file:bg-accent cursor-pointer"
          data-ocid="about.photo.upload_button"
        />
      </div>

      <Button
        type="submit"
        disabled={updateAbout.isPending}
        data-ocid="about.save_button"
      >
        {updateAbout.isPending ? (
          <Loader2 size={14} className="mr-2 animate-spin" />
        ) : (
          <Save size={14} className="mr-2" />
        )}
        {updateAbout.isPending ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
}
