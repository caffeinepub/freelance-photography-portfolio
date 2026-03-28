import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Plus, Save, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useGetContactInfo, useUpdateContact } from "../../hooks/useQueries";

export default function ContactTab() {
  const { data: contact, isLoading } = useGetContactInfo();
  const updateContact = useUpdateContact();

  const [email, setEmail] = useState("");
  const [socialLinks, setSocialLinks] = useState<Array<[string, string]>>([]);

  useEffect(() => {
    if (contact) {
      setEmail(contact.email);
      setSocialLinks(contact.socialLinks);
    }
  }, [contact]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateContact.mutateAsync({ email, socialLinks });
      toast.success("Contact info updated");
    } catch {
      toast.error("Update failed");
    }
  };

  const addLink = () => setSocialLinks((prev) => [...prev, ["", ""]]);

  const updateLink = (idx: number, field: 0 | 1, value: string) => {
    setSocialLinks((prev) =>
      prev.map((link, i) =>
        i === idx ? (field === 0 ? [value, link[1]] : [link[0], value]) : link,
      ),
    );
  };

  const removeLink = (idx: number) =>
    setSocialLinks((prev) => prev.filter((_, i) => i !== idx));

  if (isLoading) {
    return (
      <div
        className="flex items-center gap-2 text-[oklch(0.60_0_0)]"
        data-ocid="contact.loading_state"
      >
        <Loader2 className="animate-spin" size={16} />
        <span className="text-sm">Loading...</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="max-w-lg space-y-6">
      <h2 className="font-display text-xl text-foreground">
        Contact Information
      </h2>

      <div>
        <Label htmlFor="contact-email">Email</Label>
        <Input
          id="contact-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          data-ocid="contact.email.input"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <Label>Social Links</Label>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={addLink}
            data-ocid="contact.add_social.button"
          >
            <Plus size={14} className="mr-1" /> Add
          </Button>
        </div>
        <div className="space-y-2">
          {socialLinks.map((link, idx) => (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: social links don't have stable IDs
              key={idx}
              className="flex gap-2"
              data-ocid={`contact.social.item.${idx + 1}`}
            >
              <Input
                value={link[0]}
                onChange={(e) => updateLink(idx, 0, e.target.value)}
                placeholder="Platform (e.g. instagram)"
                className="w-36"
                data-ocid={`contact.social.platform.input.${idx + 1}`}
              />
              <Input
                value={link[1]}
                onChange={(e) => updateLink(idx, 1, e.target.value)}
                placeholder="URL"
                className="flex-1"
                data-ocid={`contact.social.url.input.${idx + 1}`}
              />
              <button
                type="button"
                onClick={() => removeLink(idx)}
                className="text-[oklch(0.45_0_0)] hover:text-destructive transition-colors px-2"
                data-ocid={`contact.social.delete_button.${idx + 1}`}
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <Button
        type="submit"
        disabled={updateContact.isPending}
        data-ocid="contact.save_button"
      >
        {updateContact.isPending ? (
          <Loader2 size={14} className="mr-2 animate-spin" />
        ) : (
          <Save size={14} className="mr-2" />
        )}
        {updateContact.isPending ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
}
