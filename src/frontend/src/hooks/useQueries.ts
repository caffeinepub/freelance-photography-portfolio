import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  AboutSection,
  Category,
  ContactInfo,
  MediaItem,
  SubGallery,
} from "../backend";
import type { ExternalBlob } from "../backend";
import { useActor } from "./useActor";

export function useListAllMedia() {
  const { actor, isFetching } = useActor();
  return useQuery<MediaItem[]>({
    queryKey: ["media"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listAllMedia();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useListCategories() {
  const { actor, isFetching } = useActor();
  return useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listCategories();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetFeaturedMedia() {
  const { actor, isFetching } = useActor();
  return useQuery<MediaItem | null>({
    queryKey: ["featuredMedia"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getFeaturedMediaItem();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAboutSection() {
  const { actor, isFetching } = useActor();
  return useQuery<AboutSection | null>({
    queryKey: ["about"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getAboutSection();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetContactInfo() {
  const { actor, isFetching } = useActor();
  return useQuery<ContactInfo | null>({
    queryKey: ["contact"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getContactInfo();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUploadMedia() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (item: MediaItem) => {
      if (!actor) throw new Error("Actor not available");
      return actor.uploadMediaItem(item);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media"] });
    },
  });
}

export function useUpdateMedia() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (item: MediaItem) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateMediaItem(item);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media"] });
    },
  });
}

export function useDeleteMedia() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("Actor not available");
      return actor.deleteMediaItem(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media"] });
      queryClient.invalidateQueries({ queryKey: ["featuredMedia"] });
    },
  });
}

export function useSetFeaturedMedia() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("Actor not available");
      return actor.setFeaturedMediaItem(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["featuredMedia"] });
    },
  });
}

export function useClearFeaturedMedia() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.clearFeaturedMediaItem();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["featuredMedia"] });
    },
  });
}

// Convention: gallery category IDs are prefixed with "g-", video with "v-"
export function useCreateCategory() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, name }: { id: string; name: string }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.createCategory(id, name);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

export function useDeleteCategory() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("Actor not available");
      return actor.deleteCategory(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

export function useUpdateAbout() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      bio,
      profilePhoto,
    }: { bio: string; profilePhoto: ExternalBlob | null }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateAboutSection(bio, profilePhoto);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["about"] });
    },
  });
}

export function useUpdateContact() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      email,
      socialLinks,
    }: { email: string; socialLinks: Array<[string, string]> }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateContactInfo(email, socialLinks);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contact"] });
    },
  });
}

// Sub-gallery hooks
export function useListSubGalleries() {
  const { actor, isFetching } = useActor();
  return useQuery<SubGallery[]>({
    queryKey: ["subGalleries"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listSubGalleries();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateSubGallery() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      name,
      thumbnail,
      position,
    }: {
      id: string;
      name: string;
      thumbnail: ExternalBlob;
      position: bigint;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.createSubGallery(id, name, thumbnail, position);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subGalleries"] });
    },
  });
}

export function useUpdateSubGalleryName() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, newName }: { id: string; newName: string }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateSubGalleryName(id, newName);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subGalleries"] });
    },
  });
}

export function useUpdateSubGalleryThumbnail() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      thumbnail,
    }: {
      id: string;
      thumbnail: ExternalBlob;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateSubGalleryThumbnail(id, thumbnail);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subGalleries"] });
    },
  });
}

export function useDeleteSubGallery() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("Actor not available");
      return actor.deleteSubGallery(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subGalleries"] });
    },
  });
}

export function useListMediaBySubGallery(subGalleryId: string) {
  const { actor, isFetching } = useActor();
  return useQuery<MediaItem[]>({
    queryKey: ["media", "subgallery", subGalleryId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listMediaByCategory(subGalleryId);
    },
    enabled: !!actor && !isFetching && !!subGalleryId,
  });
}
