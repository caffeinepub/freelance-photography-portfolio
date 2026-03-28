import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface ContactInfo {
    socialLinks: Array<[string, string]>;
    email: string;
}
export interface Category {
    id: string;
    name: string;
}
export interface AboutSection {
    bio: string;
    profilePhoto?: ExternalBlob;
}
export interface SubGallery {
    id: string;
    thumbnail: ExternalBlob;
    name: string;
    position: bigint;
}
export interface MediaItem {
    id: string;
    title: string;
    blob: ExternalBlob;
    description: string;
    mediaType: string;
    category: string;
    position: bigint;
}
export interface UserProfile {
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    clearFeaturedMediaItem(): Promise<void>;
    createCategory(id: string, name: string): Promise<void>;
    createSubGallery(id: string, name: string, thumbnail: ExternalBlob, position: bigint): Promise<void>;
    deleteCategory(id: string): Promise<void>;
    deleteMediaItem(id: string): Promise<void>;
    deleteSubGallery(id: string): Promise<void>;
    getAboutSection(): Promise<AboutSection | null>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getContactInfo(): Promise<ContactInfo | null>;
    getFeaturedMediaItem(): Promise<MediaItem | null>;
    getMediaItem(id: string): Promise<MediaItem | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    listAllMedia(): Promise<Array<MediaItem>>;
    listCategories(): Promise<Array<Category>>;
    listMediaByCategory(categoryId: string): Promise<Array<MediaItem>>;
    listSubGalleries(): Promise<Array<SubGallery>>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setFeaturedMediaItem(id: string): Promise<void>;
    updateAboutSection(bio: string, profilePhoto: ExternalBlob | null): Promise<void>;
    updateContactInfo(email: string, socialLinks: Array<[string, string]>): Promise<void>;
    updateMediaItem(item: MediaItem): Promise<void>;
    updateSubGalleryName(id: string, newName: string): Promise<void>;
    updateSubGalleryThumbnail(id: string, thumbnail: ExternalBlob): Promise<void>;
    uploadMediaItem(item: MediaItem): Promise<void>;
    _resetAdminWithSecret(userSecret: string): Promise<void>;
}
